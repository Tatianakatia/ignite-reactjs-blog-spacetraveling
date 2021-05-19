import Link from 'next/link';
import styles from './header.module.scss';

import { ActiveLink } from '../ActiveLink';

export default function Header(): JSX.Element {
  // TODO
  return (
    <header className={styles.container}>
      <Link href="/">
        <img src="/images/logo.svg" alt="logo" />
      </Link>
    </header>
  );
}
