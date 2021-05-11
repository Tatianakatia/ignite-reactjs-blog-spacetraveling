import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ results }: HomeProps) {
  // TODO
  return (
    <>
      <Head>
        <title>Posts | Ignews </title>
      </Head>

      <main className={commonStyles.container}>
        <div className={commonStyles.posts}>
          {results.map(post => (
            <a key={post.uid}>
              <time>{post.updatedAt}</time>
              <strong>{post.title} </strong>
              <p>{post.subtitle}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 2,
    }
  );

  // TODO
  const results = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      subtitle: post.data.subtitle,
      author: post.data.author,
      updatedAt: new Date(post.first_publication_date).toLocaleDateString(
        'en',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  return {
    props: {
      results,
    },
  };
};
