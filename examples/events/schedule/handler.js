'use strict'

exports.schedule1 = async function schedule1() {
  console.log('Scheduler 1 running ...')
}

exports.schedule2 = async function schedule2(event) {
  console.log('Scheduler 2 running ...', event)
}
