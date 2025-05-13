/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
// import process from "node:process"

// const boxenOptions = {
//   borderColor: "blue",
//   margin: 1,
//   padding: 1,
// }

// // Promotion starts on August 22, 2024
// const startAt = new Date("2024-08-22T00:00:00.000Z")
// // By October 22, 2024, the promotion will be displayed to 100% of users
// const endAt = new Date("2024-10-22T00:00:00.000Z")
// const nDays = diffDays(startAt, endAt)

function logSponsor() {
  console.log()
  // if (!shouldDisplaySponsor()) {
  //   console.log()
  //   return
  // }
  // console.log(
  //   boxen(
  //     `Sponsored by ${dodgerblue("Arccode, the RPG for developers")}\nhttps://arccode.dev?ref=so\n${gray.dim(
  //       "Disable with --noSponsor",
  //     )}`,
  //     boxenOptions,
  //   ),
  // )
}

// Display the message progressively over time to 100% of users
// function shouldDisplaySponsor() {
//   const ratio = diffDays(startAt, new Date()) / nDays

//   if (ratio >= 1) return true

//   try {
//     const nonce = Number(
//       encodeStringToNumber(process.cwd()).toString().padStart(2, "0").slice(-2),
//     )

//     return nonce <= ratio * 100
//   } catch {
//     //
//   }

//   return false
// }

// function encodeStringToNumber(string) {
//   let sum = 0

//   for (let i = 0; i < string.length; i += 1) {
//     sum += Number(string.codePointAt(i).toString(10))
//   }

//   return sum
// }

// function diffDays(a, b) {
//   return Math.round((b - a) / (1000 * 60 * 60 * 24))
// }

export default logSponsor
