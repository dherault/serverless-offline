const { stringify } = JSON

export async function schedule1(event, context) {
  console.log(
    "Scheduler 1 running ...",
    stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
  )
}

export async function schedule2(event, context) {
  console.log(
    "Scheduler 2 running ...",
    stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
  )
}
