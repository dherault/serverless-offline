import { BASE_URL_PLACEHOLDER } from '../config/index.js'

const { fromEntries, keys } = Object

export default function parseQueryStringParameters(url) {
  // dummy placeholder url for the WHATWG URL constructor
  // https://github.com/nodejs/node/issues/12682
  const { searchParams } = new URL(url, BASE_URL_PLACEHOLDER)

  if (Array.from(searchParams).length === 0) {
    return null
  }

  return fromEntries(searchParams)
}

export const parseQueryStringParametersForPayloadV2 = (urlSearchParams) => {

  const reduceSearchParams = (acc, entry) => {
    const [field, value] = entry;
    return Object.keys(acc).includes(field)
      ? { ...acc, [field]: String(acc[field]).concat("," + value) }
      : { ...acc, [field]: value };
  };
  
  const serializeSearchParams = (params) => {
    return Array.from(params.entries()).reduce(reduceSearchParams, {});
  };
  
  return serializeSearchParams(urlSearchParams);

}