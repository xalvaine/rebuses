import 'antd/dist/antd.variable.min.css'
import type { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import axios, { AxiosRequestConfig } from 'axios'
import { SWRConfig } from 'swr'

const fetcher = async (url: string, config?: AxiosRequestConfig) =>
  (await axios.get(`/api${url}`, config)).data

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
      <ConfigProvider componentSize='large'>
        <Component {...pageProps} />
      </ConfigProvider>
    </SWRConfig>
  )
}

export default MyApp
