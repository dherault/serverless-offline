import { execa } from 'execa'

export default async function pullImage(image, v3Utils) {
  try {
    await execa('docker', ['pull', '--disable-content-trust=false', image])
  } catch (err) {
    v3Utils.log.error(err.stderr)

    throw err
  }
}
