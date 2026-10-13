import type Anthropic from '@anthropic-ai/sdk'

/**
 * The one place the app talks to Claude. The browser calls the Anthropic API
 * directly with the owner's own key: GitHub Pages has no server to hide a key
 * behind, and a proxy in front of the open progress table would let anyone
 * spend it. The SDK is loaded on first use, so the app costs nothing extra
 * for anyone without a key.
 */

export const MODEL = 'claude-sonnet-5-5'

/** English, ready to show the owner. */
export class ClaudeError extends Error {}

let cached: { key: string; client: Anthropic } | null = null

async function clientFor(key: string): Promise<Anthropic> {
  if (cached?.key === key) return cached.client
  const { default: AnthropicClient } = await import('@anthropic-ai/sdk')
  // The key is the owner's own, typed into this page: that is the whole point
  // of the browser flag, not an accident it guards against.
  const client = new AnthropicClient({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 1 })
  cached = { key, client }
  return client
}

/** Turns an SDK failure into one English sentence. */
async function explain(error: unknown): Promise<ClaudeError> {
  const { default: A } = await import('@anthropic-ai/sdk')
  if (error instanceof ClaudeError) return error
  if (error instanceof A.AuthenticationError) return new ClaudeError('The API key was not accepted. Check it, or make a new one in the Anthropic Console.')
  if (error instanceof A.PermissionDeniedError) return new ClaudeError('This API key is not allowed to use the model. Check the key\'s workspace in the Anthropic Console.')
  if (error instanceof A.RateLimitError) return new ClaudeError('Too many requests, or the spend limit is reached. Wait a minute, or check your limits in the Anthropic Console.')
  if (error instanceof A.BadRequestError) return new ClaudeError(`Claude rejected the request: ${error.message}`)
  if (error instanceof A.APIConnectionError) return new ClaudeError('Claude could not be reached. Are you offline?')
  if (error instanceof A.APIError) return new ClaudeError(`Claude returned an error (${error.status ?? 'unknown'}). Try again in a moment.`)
  return new ClaudeError('Something went wrong talking to Claude.')
}

/** Checks a key without generating anything: looks the model up. */
export async function testKey(key: string): Promise<void> {
  try {
    const client = await clientFor(key)
    await client.models.retrieve(MODEL)
  } catch (error) {
    throw await explain(error)
  }
}

interface AskOptions {
  key: string
  system: string
  prompt: string
  /** JSON schema the answer must follow (structured outputs). */
  schema: Record<string, unknown>
  effort: 'low' | 'medium' | 'high'
}

/** One request, one JSON answer. */
export async function askJson<T>({ key, system, prompt, schema, effort }: AskOptions): Promise<T> {
  try {
    const client = await clientFor(key)
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      // If a safety classifier declines, the API re-runs the request on the
      // model Anthropic recommends for that case instead of failing.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort, format: { type: 'json_schema', schema } },
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    if (response.stop_reason === 'refusal') throw new ClaudeError('Claude declined to answer this one. The pattern checks still apply.')
    if (response.stop_reason === 'max_tokens') throw new ClaudeError('Claude\'s answer was cut off. Try again.')
    const text = response.content.find((block) => block.type === 'text')
    if (!text || text.type !== 'text') throw new ClaudeError('Claude sent back an empty answer. Try again.')
    return JSON.parse(text.text) as T
  } catch (error) {
    if (error instanceof SyntaxError) throw new ClaudeError('Claude\'s answer could not be read. Try again.')
    throw await explain(error)
  }
}
