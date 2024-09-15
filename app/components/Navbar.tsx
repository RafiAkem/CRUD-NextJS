import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navLink}>
        Home
      </Link>
      <Link href="/articles" className={styles.navLink}>
        Artikel
      </Link>
    </nav>
  );
}
