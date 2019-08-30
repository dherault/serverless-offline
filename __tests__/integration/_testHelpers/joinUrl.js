import { URL } from 'url'

export default function joinUrl(baseUrl, path) {
  const url = new URL(baseUrl)
  const { pathname } = url

  url.pathname = pathname === '/' ? path : `${pathname}${path}`

  return url
}
