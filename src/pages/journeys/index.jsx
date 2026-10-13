import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiCopy, FiGitBranch, FiMoreHorizontal, FiPause, FiPlay, FiTrash2, FiUsers } from "react-icons/fi";
import ConfirmationDialog from "../../components/confirmationDialog";
import styles from "./styles.module.css";

const Journeys = ({ journeys, onNotify, onUpdateJourney, onDuplicateJourney, onDeleteJourney }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All journeys");
  const [deleteId, setDeleteId] = useState(null);
  const selected = journeys.find((journey) => journey.id === deleteId);
  const filters = ["All journeys", "Active", "Draft", "Paused"];
  const visibleJourneys = useMemo(() => journeys.filter((journey) => (filter === "All journeys" || journey.status === filter) && `${journey.name} ${journey.goal} ${journey.trigger}`.toLowerCase().includes(query.toLowerCase())), [journeys, filter, query]);
  const activeCount = journeys.filter((journey) => journey.status === "Active").length;
  const stepCount = journeys.reduce((sum, journey) => sum + journey.steps.length, 0);

  const toggleStatus = (journey) => {
    const status = journey.status === "Active" ? "Paused" : "Active";
    onUpdateJourney(journey.id, { status });
    onNotify(`${journey.name} ${status === "Active" ? "is now active" : "is paused"}.`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.heading}><div><p className={styles.label}>YOUR CUSTOMER PATHS</p><h1>Journeys, with intention.</h1><p>Build helpful moments around the way customers discover, buy, and return.</p></div><Link className={styles.createLink} to="/journeys/welcome-series"><FiGitBranch aria-hidden="true" /> Open a journey <FiArrowRight aria-hidden="true" /></Link></div>
      <section className={styles.snapshot} aria-label="Journey overview">
        <article className={styles.snapshotCard}><span className={styles.snapshotIcon}><FiGitBranch /></span><div><p>Journeys</p><strong>{journeys.length}</strong></div><span className={styles.snapshotNote}>Across your workspace</span></article>
        <article className={styles.snapshotCard}><span className={[styles.snapshotIcon, styles.lime].join(" ")}><FiPlay /></span><div><p>Running now</p><strong>{activeCount}</strong></div><span className={styles.snapshotNote}>Active customer paths</span></article>
        <article className={styles.snapshotCard}><span className={[styles.snapshotIcon, styles.coral].join(" ")}><FiUsers /></span><div><p>Steps to shape</p><strong>{stepCount}</strong></div><span className={styles.snapshotNote}>Across every journey</span></article>
      </section>
      <div className={styles.workbench}>
        <section className={styles.listPanel}>
          <div className={styles.listHeading}><div><h2>Journey library</h2><p>One clear next step at a time.</p></div><span>{visibleJourneys.length} shown</span></div>
          <div className={styles.tools}><label className={styles.search}><span className={styles.searchIcon}>⌕</span><span className={styles.visuallyHidden}>Search journeys</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a journey" /></label><div className={styles.filters} aria-label="Filter journeys by status">{filters.map((item) => <button key={item} type="button" className={filter === item ? styles.selected : ""} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}</div></div>
          {visibleJourneys.length ? <div className={styles.journeyList}>{visibleJourneys.map((journey) => <article className={styles.journeyCard} key={journey.id}>
            <div className={styles.cardTop}><span className={[styles.status, styles[journey.status.toLowerCase()]].join(" ")}><span />{journey.status}</span><div className={styles.cardActions}><button type="button" onClick={() => onDuplicateJourney(journey.id)} aria-label={`Duplicate ${journey.name}`} title="Duplicate journey"><FiCopy /></button><button type="button" onClick={() => setDeleteId(journey.id)} aria-label={`Delete ${journey.name}`} title="Delete journey"><FiTrash2 /></button></div></div>
            <Link className={styles.cardTitle} to={`/journeys/${journey.id}`}>{journey.name}<FiArrowRight aria-hidden="true" /></Link>
            <p className={styles.goal}>{journey.goal}</p>
            <div className={styles.trigger}><span>ENTRY</span><strong>{journey.trigger}</strong></div>
            <div className={styles.cardFoot}><span><FiGitBranch aria-hidden="true" /> {journey.steps.length} steps</span><span><FiClock aria-hidden="true" /> {journey.updated}</span><button type="button" aria-label={`${journey.status === "Active" ? "Pause" : journey.status === "Paused" ? "Resume" : "Activate"} ${journey.name}`} onClick={() => toggleStatus(journey)}>{journey.status === "Active" ? <><FiPause /> Pause</> : <><FiPlay /> {journey.status === "Paused" ? "Resume" : "Activate"}</>}</button></div>
          </article>)}</div> : <div className={styles.empty}><FiMoreHorizontal aria-hidden="true" /><h3>No journeys match.</h3><p>Adjust your search or status filter to see more.</p><button type="button" onClick={() => { setQuery(""); setFilter("All journeys"); }}>Clear filters</button></div>}
        </section>
        <aside className={styles.sidePanel}><div className={styles.sideTop}><span className={styles.sideIcon}><FiClock /></span><span>WORKSPACE NOTE</span></div><h2>Good timing is a kind of care.</h2><p>Start with one useful moment, give it room, then let the next step follow naturally.</p><div className={styles.flowPreview}><div><span className={styles.flowDot} /><strong>Customer event</strong><small>A clear reason to begin</small></div><i /><div><span className={[styles.flowDot, styles.emailDot].join(" ")} /><strong>Helpful message</strong><small>One focused action</small></div><i /><div><span className={[styles.flowDot, styles.goalDot].join(" ")} /><strong>Meaningful next step</strong><small>Built around their needs</small></div></div><div className={styles.sideFoot}><span>{activeCount} live paths</span><span>Demo data only</span></div></aside>
      </div>
      <ConfirmationDialog isOpen={Boolean(selected)} title="Delete this journey?" itemName={selected?.name} description="This removes the journey and its steps from this browser session." confirmLabel="Delete journey" cancelLabel="Keep journey" onConfirm={() => { onDeleteJourney(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
};

export default Journeys;
