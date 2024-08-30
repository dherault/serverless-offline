import { execa } from "execa"
import { log } from "../../src/utils/log.js"

export default async function pullImage(image) {
  try {
    await execa("docker", ["pull", image])
  } catch (err) {
    log.error(err.stderr)

    throw err
  }
}
