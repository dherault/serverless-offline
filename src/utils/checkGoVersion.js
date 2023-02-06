import { execa } from 'execa'

export default async function checkGoVersion() {
  let goVersion

  try {
    const { stdout } = await execa('go', ['version'])
    if (/go1.\d+/g.test(stdout)) {
      goVersion = '1.x'
    }
  } catch {
    // @ignore
  }

  return goVersion
}
