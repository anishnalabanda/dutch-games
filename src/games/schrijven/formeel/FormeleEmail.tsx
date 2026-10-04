import { TextTaskGame } from '../taken/TextTaskGame'
import { FORMAL_TEMPLATE } from '../taken/templates'
import { tasks } from './data'

export function FormeleEmail() {
  return <TextTaskGame storeKey="nl.schrijven.formeel" title="Formele e-mail" noun="e-mail" tasks={tasks} template={FORMAL_TEMPLATE} />
}
