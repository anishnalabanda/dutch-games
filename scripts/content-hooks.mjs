// Vite resolves extensionless relative imports; plain Node does not. Retry with .ts
// so the content check can import game data straight from source.
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context)
  } catch (err) {
    if (specifier.startsWith('.') && !/\.[a-zA-Z]+$/.test(specifier)) {
      return next(`${specifier}.ts`, context)
    }
    throw err
  }
}
