import styles from './header.module.scss';

export default function Header() {
  // TODO
  return (
    <header className={styles.container}>
      <div className={styles.posts}>
        <img src="/images/logo.svg" alt="Space Traveling" />
        <h1 className={styles.title}>Home</h1>
        <a>Posts</a>
      </div>
    </header>
  );
}
