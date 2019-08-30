import { DateTime } from 'luxon'

const { fromMillis } = DateTime

// CLF -> Common Log Format
// https://httpd.apache.org/docs/1.3/logs.html#common
// [day/month/year:hour:minute:second zone]
// day = 2*digit
// month = 3*letter
// year = 4*digit
// hour = 2*digit
// minute = 2*digit
// second = 2*digit
// zone = (`+' | `-') 4*digit
export default function formatToClfTime(millis) {
  return fromMillis(millis).toFormat('dd/MMM/yyyy:HH:mm:ss ZZZ')
}
