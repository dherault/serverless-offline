import { randomUUID } from 'node:crypto'

export default function createUniqueId() {
  return randomUUID()
}
