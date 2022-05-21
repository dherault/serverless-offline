import { env } from 'node:process'

export default typeof env.SLS_DEBUG !== 'undefined'
  ? console.log.bind(null, '[offline]')
  : () => null
