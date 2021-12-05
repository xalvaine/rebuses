import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

type Data = string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { data } = await axios.get<{
    word: { id: string; type: string; word: string }
  }>('http://free-generator.ru/generator.php?action=word&type=1')
  res.status(200).json(data.word.word)
}
