import { FaCodepen, FaGithub } from "react-icons/fa";
import { FiArrowUpRight, FiGlobe } from "react-icons/fi";
import styles from "./styles.module.css";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <div><a className={styles.brand} href={`${import.meta.env.BASE_URL}journeys`}><span className={styles.mark}>g.</span> goodbrief<span className={styles.period}>.</span></a><p>Thoughtful customer journeys start with a clear brief.</p></div>
      <div className={styles.links} aria-label="Goodbrief project links">
        <a href="https://github.com/a2rp" target="_blank" rel="noreferrer" aria-label="GitHub profile" title="GitHub"><FaGithub /></a>
        <a href="https://codepen.io/ash1198" target="_blank" rel="noreferrer" aria-label="CodePen profile" title="CodePen"><FaCodepen /></a>
        <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer" aria-label="Portfolio website" title="Portfolio"><FiGlobe /></a>
      </div>
    </div>
    <div className={styles.bottom}><span>Frontend-only workspace demo · Data resets on refresh</span><a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="" /> Made by Ashish Ranjan <FiArrowUpRight aria-hidden="true" /></a></div>
  </footer>
);

export default Footer;
