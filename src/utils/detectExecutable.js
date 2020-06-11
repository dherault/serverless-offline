import execa from 'execa'

export default async function detectExecutable(exe, versionFlag = '--version') {
  try {
    const { failed } = await execa(exe, [versionFlag])

    return failed === false
  } catch (err) {
    return false
  }
}
