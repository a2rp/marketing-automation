import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FiGitBranch, FiMenu, FiPlus, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Header = ({ onNewJourney }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 48 || current < previous - 2) setHidden(false);
      else if (current > previous + 2 && !menuOpen) setHidden(true);
      previous = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const navClass = ({ isActive }) => [styles.navLink, isActive ? styles.active : ""].join(" ");

  return (
    <header className={[styles.header, hidden && !menuOpen ? styles.hidden : ""].join(" ")}>
      <div className={styles.bar}>
        <NavLink className={styles.brand} to="/journeys" onClick={closeMenu} aria-label="Goodbrief journeys">
          <span className={styles.mark}><FiGitBranch aria-hidden="true" /></span><span>goodbrief<span className={styles.period}>.</span></span>
        </NavLink>
        <div className={[styles.navigationWrap, menuOpen ? styles.open : ""].join(" ")}>
          <nav className={styles.navigation} aria-label="Main navigation">
            <NavLink className={navClass} to="/journeys" onClick={closeMenu}>Journeys</NavLink>
            <NavLink className={navClass} to="/campaigns" onClick={closeMenu}>Campaigns</NavLink>
            <NavLink className={navClass} to="/audiences" onClick={closeMenu}>Audiences</NavLink>
          </nav>
          <button className={styles.createButton} type="button" onClick={() => { closeMenu(); onNewJourney(); }}><FiPlus aria-hidden="true" /> New journey</button>
        </div>
        <div className={styles.status}><span className={styles.statusDot} /> Demo workspace</div>
        <button className={styles.menuToggle} type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <FiX /> : <FiMenu />}</button>
      </div>
    </header>
  );
};

export default Header;

