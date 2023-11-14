import mql, { type MqlResponse } from '@microlink/mql'
import { toUrl } from '@lib/utils'

export const getMetadata = async (
  urlString: string | URL,
): Promise<MqlResponse['data']> => {
  const url = toUrl(urlString)
  if (!url) throw new Error(`Couldn't parse url: ${urlString}`)

  console.log('fetching', url.href)
  const { status, data } = await mql(url.href, { meta: true })
  if (status !== 'success')
    throw new Error(`Error fetching metadata for ${url.href}: ${status}`)

  console.log('fetched', status)

  return data
}
