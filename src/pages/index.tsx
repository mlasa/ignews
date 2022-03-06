import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    price: number;
  }
}

export default function Home(props: HomeProps) {
  return <>
    <Head>
      <title>ig.news | Home</title>
    </Head>

    <main className={styles.contentContainer}>
      <section className={styles.hero}>
        <span>👋 Olá, bem vindos</span>
        <h1>Notícias sobre o mundo <span>React</span>.</h1>
        <p>
          Obtenha acesso a todas as publicações <br />
          <span>
            por {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(props.product.price)} por mês
          </span>
        </p>
        <SubscribeButton priceId={props.product.priceId} />
      </section>

      <img src="/images/avatar.svg" alt="girl coding" />
    </main>
  </>
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KZvU2F7F75IlTrFYHOGmgZR', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    price: price.unit_amount / 100,

  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 48 // 48 horas
  }
}

/*
  Função para trabalhar com SSR
  - Existe tipagem dentro do next para essa função GetServerSideProps
  - Só pode ser colocada na **página** não dentro do componente
  - Precisa se chamar getServerSideProps e tem que ser async, mesmo que você não use o await dentro

  export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1KZvU2F7F75IlTrFYHOGmgZR', {
    expand: ['product']
  });

  const product = {
    priceId: price.id,
    price: price.unit_amount / 100,

  }

  return {
    props: {
      product
    }
  }
}
*/
