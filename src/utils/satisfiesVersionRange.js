import semver from 'semver'

export default function satisfiesVersionRange(version, range) {
  if (semver.valid(version) == null) {
    throw new Error(`Not a valid semver version: ${version}`)
  }

  if (semver.validRange(range) == null) {
    throw new Error(`Not a valid semver range: ${range}`)
  }

  return semver.satisfies(version, range)
}
