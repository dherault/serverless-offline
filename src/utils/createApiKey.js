import { createHash } from "node:crypto"

export default function createApiKey() {
  return createHash("md5").digest("hex")
}
