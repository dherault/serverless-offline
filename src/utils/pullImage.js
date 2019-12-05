import execa from 'execa'

export default async function pullImage(image) {
  try {
    await execa('docker', ['pull', image])
  } catch (err) {
    console.error(err.stderr)
    throw err
  }
}
