import execa from 'execa'

export default async function buildInCotainer(
  runtime,
  codeDir,
  workDir,
  command = [],
) {
  const imageName = `lambci/lambda:build-${runtime}`
  try {
    await execa('docker', ['pull', imageName])
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
