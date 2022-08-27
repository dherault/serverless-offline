export async function schedule1() {
  console.log('Scheduler 1 running ...')
}

export async function schedule2(event) {
  console.log('Scheduler 2 running ...', event)
}
