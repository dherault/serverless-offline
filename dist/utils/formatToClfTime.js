import { DateTime } from 'luxon'
const { fromMillis } = DateTime
export default function formatToClfTime(millis) {
  return fromMillis(millis).toFormat('dd/MMM/yyyy:HH:mm:ss ZZZ')
}
