import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <span>✦</span> Inkwell
          </Link>
          <p className={styles.tagline}>
            A space for thoughtful writing and ideas that matter.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>Explore</h4>
            <Link to="/category/Technology">Technology</Link>
            <Link to="/category/Design">Design</Link>
            <Link to="/category/Culture">Culture</Link>
            <Link to="/category/Science">Science</Link>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>Create</h4>
            <Link to="/write">Write a Post</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} Inkwell. Built with Convex & React.</p>
        </div>
      </div>
    </footer>
  );
}
