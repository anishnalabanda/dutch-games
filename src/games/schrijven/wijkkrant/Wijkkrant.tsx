import { TextTaskGame } from '../taken/TextTaskGame'
import { KRANT_TEMPLATE } from '../taken/templates'
import { tasks } from './data'

export function Wijkkrant() {
  return <TextTaskGame storeKey="nl.schrijven.wijkkrant" title="Wijkkrant" noun="text" tasks={tasks} template={KRANT_TEMPLATE} />
}
