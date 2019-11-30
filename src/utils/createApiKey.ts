import { createHash } from 'crypto'

export default function createApiKey() {
  return createHash('md5').digest('hex')
}
