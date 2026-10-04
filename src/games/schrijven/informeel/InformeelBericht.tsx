import { TextTaskGame } from '../taken/TextTaskGame'
import { INFORMAL_TEMPLATE } from '../taken/templates'
import { tasks } from './data'

export function InformeelBericht() {
  return <TextTaskGame storeKey="nl.schrijven.informeel" title="Informeel bericht" noun="message" tasks={tasks} template={INFORMAL_TEMPLATE} />
}
