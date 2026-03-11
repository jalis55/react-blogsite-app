import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { PenLine, LayoutDashboard, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          Inkwell
        </Link>

        <nav className={`${styles.nav} ${mobileOpen ? styles.mobileOpen : ""}`}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/category/Technology" className={styles.navLink}>Tech</Link>
          <Link to="/category/Design" className={styles.navLink}>Design</Link>
          <Link to="/category/Culture" className={styles.navLink}>Culture</Link>
          <Link to="/category/Science" className={styles.navLink}>Science</Link>
        </nav>

        <div className={styles.actions}>
          {isSignedIn ? (
            <>
              <Link to="/write" className={styles.writeBtn}>
                <PenLine size={15} />
                Write
              </Link>
              <Link to="/dashboard" className={styles.iconBtn} aria-label="Dashboard">
                <LayoutDashboard size={18} />
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className={styles.signInBtn}>Sign In</button>
            </SignInButton>
          )}

          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
