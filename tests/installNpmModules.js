import { execa } from "execa"

export default function installNpmModules(dirPath) {
  return execa("npm", ["ci"], {
    cwd: dirPath,
    stdio: "inherit",
  })
}
