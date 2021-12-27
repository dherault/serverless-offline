import execa from 'execa'

export default async function pullImage(image, v3Utils) {
  const log = v3Utils && v3Utils.log
  try {
    await execa('docker', ['pull', '--disable-content-trust=false', image])
  } catch (err) {
    if (log) {
      log.error(err.stderr)
    } else {
      console.error(err.stderr)
    }
    throw err
  }
}
