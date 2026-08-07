/* eslint-disable unicorn/numeric-separators-style */
import assert from "node:assert"
import layerFileMode from "../layerFileMode.js"

// jszip reports the unix permissions of an entry including its file type bits,
// e.g. 0o100755 for a regular, executable file
describe("layerFileMode", () => {
  it("should keep the unix permissions of the archive", () => {
    assert.equal(layerFileMode("lib/thing.so", 0o100755), 0o755)
    assert.equal(layerFileMode("lib/thing.so", 0o100600), 0o600)
  })

  it("should fall back to a default when the archive has no unix permissions", () => {
    assert.equal(layerFileMode("lib/thing.so", 0), 0o644)
    assert.equal(layerFileMode("lib/thing.so", null), 0o644)
    assert.equal(layerFileMode("lib/thing.so", undefined), 0o644)
  })

  it("should read unix permissions given as a string", () => {
    assert.equal(layerFileMode("lib/thing.so", "755"), 0o755)
  })

  it("should make a bootstrap executable when the archive has no unix permissions", () => {
    assert.equal(layerFileMode("bootstrap", null), 0o755)
    assert.equal(layerFileMode("nested/bootstrap", 0), 0o755)
  })

  it("should make a bootstrap executable when the archive says it is not", () => {
    assert.equal(layerFileMode("bootstrap", 0o100644), 0o755)
  })

  it("should keep the unix permissions of an executable bootstrap", () => {
    assert.equal(layerFileMode("bootstrap", 0o100775), 0o775)
  })
})
