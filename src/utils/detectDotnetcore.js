import execa from 'execa'

export default async function detectDotnetcore(version) {
  try {
    const { stdout: output } = await execa('dotnet', ['--list-sdks'])

    const versions = output.split('\n')
    for (let i = 0; i < versions.length; i += 1) {
      if (versions[i].startsWith(version)) {
        return true
      }
    }

    return false
  } catch (err) {
    console.log(err)
    return false
  }
}
