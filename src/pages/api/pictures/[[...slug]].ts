import type { NextApiRequest, NextApiResponse } from 'next'
import request from 'request'

type Data = string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const url = `http://rebus1.com/${req.url
    ?.split(`/`)
    .filter(Boolean)
    .slice(1)
    .join(`/`)}`

  console.log(url)

  request.get(url).pipe(res)
}
