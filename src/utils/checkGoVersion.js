import { execa } from 'execa'

export default async function checkGoVersion() {
  let goVersion

  try {
    const { stdout } = await execa('go', ['version'])
    if (stdout.match(/go1.\d+/g)) {
      goVersion = '1.x'
    }
  } catch {
    // @ignore
  }

  return goVersion
}
