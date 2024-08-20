import boxen from "boxen"
import {
  dodgerblue,
  gray,
  lime,
  orange,
  peachpuff,
  plum,
  red,
  yellow,
} from "../config/colors.js"

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
      `Sponsored by arccode, the RPG for developers\nhttps://arccode.dev\n${gray.dim(
        "Disable with --noSponsor",
      )}`,
      boxenOptions,
    ),
  )
}

export default logSponsor
