import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): JSX.Element {
  // TODO
  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling </title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <time />
            <strong />
            <p />
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    }
  );

  // TODO
  return {};
};

export const getStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID();

  // TODO
  return {
    props: {},
  };
};
