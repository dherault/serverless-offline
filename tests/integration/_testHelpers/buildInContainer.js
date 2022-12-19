import execa from 'execa'
import pullImage from './pullImage.js'

export default async function buildInContainer(
  runtime,
  codeDir,
  workDir,
  command = [],
) {
  const imageName = `lambci/lambda:build-${runtime}`
  await pullImage(imageName)
  return execa('docker', [
    'run',
    '--rm',
    '-v',
    `${codeDir}:${workDir}`,
    imageName,
    ...command,
  ])
}
