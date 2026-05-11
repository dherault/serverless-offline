import { execa } from "execa"
import pullImage from "./pullImage.js"

export default async function buildInContainer(
  runtime,
  codeDir,
  workDir,
  command = [],
) {
  const imageName = `public.ecr.aws/sam/build-${runtime}:latest-x86_64`

  await pullImage(imageName)

  return execa("docker", [
    "run",
    "--rm",
    "-v",
    `${codeDir}:${workDir}`,
    "--platform",
    "linux/amd64",
    imageName,
    ...command,
  ])
}
