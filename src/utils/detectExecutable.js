import execa from 'execa'

export default async function detectExecutable(exe) {
  try {
    const { failed } = await execa(exe, ['--version'])

    return failed === false
  } catch (err) {
    return false
  }
}
