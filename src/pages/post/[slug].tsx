import { GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import postStyles from './post.module.scss';

interface Post {
  slug: string;
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

export default function Post({ post }: PostProps): JSX.Element {
  // TODO
  return (
    <>
      <Head>
        <title>{post.data.title}| SpaceTraveling </title>
      </Head>

      <main className={postStyles.container}>
        <article className={postStyles.post}>
          <h1>{post.data.title}</h1>
          <h5>{post.data.author}</h5>
          <time>{post.first_publication_date}</time>
          <div className={postStyles.postContent}>{post.data.content}</div>
        </article>
      </main>
    </>
  );
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   // TODO
//   return {};
// };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    subitle: RichText.asHtml(response.data.subtitle),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'en',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  };

  // TODO
  return {
    props: {
      post,
    },
  };
};
