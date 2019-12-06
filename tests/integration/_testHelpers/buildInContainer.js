import execa from 'execa'
import { pullImage } from '../../../src/utils/index.js'

export default async function buildInCotainer(
  runtime,
  codeDir,
  workDir,
  command = [],
) {
  const imageName = `lambci/lambda:build-${runtime}`
  await pullImage(imageName)
  try {
    return execa('docker', [
      'run',
      '--rm',
      '-v',
      `${codeDir}:${workDir}`,
      imageName,
      ...command,
    ])
  } catch (err) {
    console.error(err.stderr)
    throw err
  }
}
