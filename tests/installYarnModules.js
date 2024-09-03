import { execa } from "execa"

export default function installYarnModules(dirPath) {
  return execa("yarn", ["--immutable"], {
    cwd: dirPath,
    stdio: "inherit",
  })
}
