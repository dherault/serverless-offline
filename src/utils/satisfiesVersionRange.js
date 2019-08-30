import { satisfies, valid, validRange } from 'semver'

export default function satisfiesVersionRange(version, range) {
  if (valid(version) == null) {
    throw new Error(`Not a valid semver version: ${version}`)
  }

  if (validRange(range) == null) {
    throw new Error(`Not a valid semver range: ${range}`)
  }

  return satisfies(version, range)
}
