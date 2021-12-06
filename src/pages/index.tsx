import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '@/styles/index.module.css'
import { Button, PageHeader, Typography } from 'antd'
import useSWR from 'swr'
import { AxiosRequestConfig } from 'axios'

const Home: NextPage = () => {
  const {
    data: word,
    mutate,
    isValidating: isWordValidating,
  } = useSWR<string>('/word')

  const { data: images, isValidating: isImagesValidating } = useSWR<string>(
    word ? ['/rebus', { params: { word } } as AxiosRequestConfig] : null,
  )

  return (
    <>
      <Head>
        <title>Генератор ребусов</title>
        <meta name='description' content='Генератор ребусов' />
      </Head>
      <PageHeader title='Генератор ребусов' />
      <div className={styles.wrapper}>
        {/*<Skeleton.Input active className={styles.skeleton} />*/}
        <Typography.Title className={styles.title} level={3}>
          {!!word && `${word?.charAt(0).toUpperCase()}${word?.slice(1)}`}
        </Typography.Title>
      </div>
      <div className={styles.imagesWrapper}>
        <div
          className={styles.images}
          dangerouslySetInnerHTML={{ __html: images || `` }}
        />
      </div>
      <div className={styles.wrapper}>
        <Button
          block
          loading={isWordValidating || isImagesValidating}
          type='primary'
          onClick={() => mutate()}
        >
          Сгенерировать ребус
        </Button>
      </div>
    </>
  )
}

export default Home
