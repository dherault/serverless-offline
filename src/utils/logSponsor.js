import boxen from "boxen"
import { gray, dodgerblue } from "../config/colors.js"

const boxenOptions = {
  borderColor: "yellow",
  dimBorder: true,
  margin: 1,
  padding: 1,
}

function logSponsor() {
  // eslint-disable-next-line no-console
  console.log(
    boxen(
      `Sponsored by ${dodgerblue("Arccode, the RPG for developers")}\nhttps://arccode.dev\n${gray.dim(
        "Disable with --noSponsor",
      )}`,
      boxenOptions,
    ),
  )
}

export default logSponsor
