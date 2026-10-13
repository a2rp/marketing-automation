import { Link, useLocation } from "react-router-dom";
import { FiArrowLeft, FiCompass } from "react-icons/fi";
import styles from "./styles.module.css";

const NotFound = () => {
  const location = useLocation();
  return <section className={styles.page}><div className={styles.art}><span>4</span><FiCompass aria-hidden="true" /><span>4</span></div><p className={styles.label}>THIS PATH ISN’T IN THE PLAN</p><h1>We lost the thread.</h1><p className={styles.description}>There isn’t a workspace page at <code>{location.pathname}</code>. Head back to a journey, campaign, or audience.</p><div className={styles.actions}><Link to="/journeys">Open journeys</Link><Link className={styles.secondary} to="/campaigns"><FiArrowLeft aria-hidden="true" /> Campaigns</Link></div></section>;
};

export default NotFound;
