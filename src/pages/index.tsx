import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { useState } from 'react';
import { FiUser, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import Post from './post/[slug]';

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
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  // TODO
  const [posts, setPosts] = useState(postsPagination.results);

  return (
    <>
      <Head>
        <title>Home | spaceTraveling </title>
      </Head>

      <main className={commonStyles.container}>
        <div className={commonStyles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title} </strong>
                <p>{post.data.subtitle}</p>
                <footer>
                  <div>
                    <FiCalendar size={20} />
                    <time>
                      {format(new Date(post.first_publication_date), 'EN', {
                        locale: enGB,
                      })}
                    </time>
                  </div>
                  <div>
                    <FiUser size={20} />
                    <span>{post.data.author}</span>
                  </div>
                </footer>
              </a>
            </Link>
          ))}
          {postsPagination.next_page && (
            <button
              type="button"
              onClick={async () => {
                const response = await fetch(postsPagination.next_page);

                const { results } = await response.json();

                const newPostsArray = [...posts, results].flat();

                setPosts(newPostsArray);
              }}
            >
              Loader plus posts
            </button>
          )}
        </div>
      </main>

      {preview && (
        <aside>
          <Link href="/api/exit-preview">
            <a>Left Preview</a>
          </Link>
        </aside>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      fetch: [
        'publication.title',
        'publication.subtitle',
        'publication.author',
      ],
      pageSize: 20,
      ref: previewData?.ref ?? null,
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
      postPagination: {
        next_page: postsResponse.next_page,
        results,
        preview,
      },
    },
  };
};
