import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import iconv from 'iconv-lite'
import { JSDOM } from 'jsdom'

type Data = string[]

const decodeMap: Record<string, string> = {}
const win1251 = new TextDecoder('windows-1251')
for (let i = 0x00; i < 0xff; i++) {
  const hex =
    (i <= 0x0f ? '0' : '') + // zero-padded
    i.toString(16).toUpperCase()
  decodeMap[hex] = win1251.decode(Uint8Array.from([i]))
}

const encodeMap = Object.fromEntries(
  Object.entries(decodeMap).map(([key, value]) => [value, key]),
)

// function win1251ToString(str: string) {
//   return str.replace(/%([0-9A-F]{2})/g, (match, hex) => decodeMap[hex])
// }

function stringToWin1251(str: string) {
  return str
    .split('')
    .map((char) => `%${encodeMap[char]}`)
    .join('')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { word } = req.query as { word: string }

  const { data } = await axios.get(
    `http://rebus1.com/index.php?item=rebus_generator&enter=1&mode=1&slovo=${stringToWin1251(
      word,
    )}`,
    {
      responseType: 'arraybuffer',
    },
  )

  // console.log(iconv.encode(word, 'win1251').toString())

  console.log(
    iconv
      .encode(iconv.decode(Buffer.from(data, 'binary'), 'win1251'), 'utf8')
      .toString(),
  )

  const { document } = new JSDOM(
    iconv
      .encode(iconv.decode(Buffer.from(data, 'binary'), 'win1251'), 'utf8')
      .toString(),
  ).window

  // console.log(
  //   Array.from(document.querySelectorAll('img[alt="ребусы"]')).map(
  //     (elem) => `/api/${elem.getAttribute('src')}`,
  //   ),
  // )

  res
    .status(200)
    .json(
      Array.from(document.querySelectorAll('img[alt="ребусы"]')).map(
        (elem) => `/api/${elem.getAttribute('src')}`,
      ),
    )
}
