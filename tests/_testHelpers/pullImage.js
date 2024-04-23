import { log } from "@serverless/utils/log.js"
import { execa } from "execa"

export default async function pullImage(image) {
  try {
    await execa("docker", ["pull", image])
  } catch (err) {
    log.error(err.stderr)

    throw err
  }
}
