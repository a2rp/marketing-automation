import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowDown, FiArrowLeft, FiArrowRight, FiArrowUp, FiCheck, FiClock, FiGitBranch, FiMail, FiSettings, FiTrash2, FiZap } from "react-icons/fi";
import ConfirmationDialog from "../../components/confirmationDialog";
import styles from "./styles.module.css";

const icons = { trigger: FiZap, email: FiMail, wait: FiClock, branch: FiGitBranch };
const typeNames = { trigger: "Trigger", email: "Email", wait: "Wait", branch: "Condition" };
const stepTypes = ["email", "wait", "branch"];

const StepInspector = ({ journey, selected, onNotify, onUpdateJourney, onUpdateJourneyStep, onRemoveJourneyStep, onSelectStep }) => {
  const [title, setTitle] = useState(selected.title);
  const [detail, setDetail] = useState(selected.detail);
  const [removeOpen, setRemoveOpen] = useState(false);
  const currentIndex = journey.steps.findIndex((step) => step.id === selected.id);

  const saveStep = (event) => {
    event.preventDefault();
    if (!title.trim()) { onNotify("Add a title to this step before saving.", "error"); return; }
    onUpdateJourneyStep(journey.id, selected.id, { title: title.trim(), detail: detail.trim() });
    onNotify("Step details updated.");
  };

  const moveStep = (direction) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex < 1 || nextIndex >= journey.steps.length) return;
    const reordered = [...journey.steps];
    [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
    onUpdateJourney(journey.id, { steps: reordered });
    onNotify(`Moved “${selected.title}” ${direction < 0 ? "earlier" : "later"}.`);
  };

  const removeStep = () => {
    onRemoveJourneyStep(journey.id, selected.id);
    onSelectStep(journey.steps.find((step) => step.type === "trigger")?.id || "");
    setRemoveOpen(false);
    onNotify(`${selected.title} removed from the journey.`, "info");
  };

  return <>
    <div className={styles.inspectorHeading}><span className={styles.inspectorIcon}><FiSettings /></span><div><p>STEP SETTINGS</p><h2>{typeNames[selected.type]}</h2></div></div>
    <form className={styles.editForm} onSubmit={saveStep}><label htmlFor="step-title">Step title</label><input id="step-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength="64" /><label htmlFor="step-detail">Description</label><textarea id="step-detail" rows="4" value={detail} onChange={(event) => setDetail(event.target.value)} maxLength="200" /><button className={styles.save} type="submit">Save step changes</button></form>
    <div className={styles.stepControls}><span>Step order</span><div><button type="button" onClick={() => moveStep(-1)} disabled={currentIndex <= 1} aria-label="Move step earlier"><FiArrowUp /></button><button type="button" onClick={() => moveStep(1)} disabled={currentIndex >= journey.steps.length - 1} aria-label="Move step later"><FiArrowDown /></button></div></div>
    {selected.type !== "trigger" && <><div className={styles.toggleRow}><div><strong>Step enabled</strong><span>{selected.enabled ? "Included in this journey" : "Skipped while disabled"}</span></div><button type="button" className={[styles.toggle, selected.enabled ? styles.toggleOn : ""].join(" ")} onClick={() => { onUpdateJourneyStep(journey.id, selected.id, { enabled: !selected.enabled }); onNotify(`${selected.title} ${selected.enabled ? "paused" : "enabled"}.`); }} role="switch" aria-checked={selected.enabled} aria-label={`Toggle ${selected.title}`}><i /></button></div><button className={styles.removeStep} type="button" onClick={() => setRemoveOpen(true)}><FiTrash2 aria-hidden="true" /> Remove this step</button></>}
    <div className={styles.demoNote}>Demo mode. No email is sent and no contact data is changed.</div>
    <ConfirmationDialog isOpen={removeOpen} title="Remove this step?" itemName={selected.title} description="This step will be removed from the journey in the current session." confirmLabel="Remove step" cancelLabel="Keep step" onConfirm={removeStep} onCancel={() => setRemoveOpen(false)} />
  </>;
};

const JourneyBuilder = ({ journeys, onNotify, onUpdateJourney, onAddJourneyStep, onUpdateJourneyStep, onRemoveJourneyStep }) => {
  const { journeyId } = useParams();
  const journey = journeys.find((item) => item.id === journeyId);
  const [selectedId, setSelectedId] = useState(journey?.steps[0]?.id || "");
  const selected = journey?.steps.find((step) => step.id === selectedId);

  if (!journey) return <section className={styles.missing}><h1>Journey not found.</h1><p>It may have been removed from this session.</p><Link to="/journeys"><FiArrowLeft /> Back to journeys</Link></section>;

  const activate = () => {
    if (journey.status !== "Active" && !journey.steps.some((step) => step.type === "email" && step.enabled)) {
      onNotify("Add an enabled email step before activating this journey.", "error");
      return;
    }
    const status = journey.status === "Active" ? "Paused" : "Active";
    onUpdateJourney(journey.id, { status });
    onNotify(`${journey.name} ${status === "Active" ? "is active" : "is paused"}.`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.topline}><Link to="/journeys"><FiArrowLeft aria-hidden="true" /> Journey library</Link><span>/</span><span>{journey.name}</span></div>
      <div className={styles.pageHeading}><div><p className={styles.label}>JOURNEY BUILDER</p><h1>{journey.name}</h1><p>{journey.goal}</p></div><div className={styles.headerActions}><span className={[styles.status, styles[journey.status.toLowerCase()]].join(" ")}><i />{journey.status}</span><button className={styles.activate} type="button" onClick={activate}>{journey.status === "Active" ? "Pause journey" : "Activate journey"}<FiArrowRight aria-hidden="true" /></button></div></div>
      <div className={styles.builder}>
        <section className={styles.canvas} aria-label="Journey flow canvas">
          <div className={styles.canvasTop}><div><FiGitBranch aria-hidden="true" /><span>FLOW CANVAS</span></div><span>{journey.steps.length} steps · Changes stay in this session</span></div>
          <div className={styles.flow}>
            {journey.steps.map((step, index) => {
              const Icon = icons[step.type] || FiSettings;
              return <div className={styles.nodeRow} key={step.id}>
                {index > 0 && <div className={styles.connector}><span /></div>}
                <button className={[styles.node, selectedId === step.id ? styles.nodeSelected : "", !step.enabled ? styles.nodeDisabled : ""].join(" ")} type="button" onClick={() => setSelectedId(step.id)} aria-pressed={selectedId === step.id}>
                  <span className={[styles.nodeIcon, styles[`${step.type}Icon`]].join(" ")}><Icon aria-hidden="true" /></span><span className={styles.nodeCopy}><small>STEP {String(index + 1).padStart(2, "0")} · {typeNames[step.type]}</small><strong>{step.title}</strong><span>{step.detail}</span></span><FiArrowRight className={styles.nodeArrow} aria-hidden="true" />
                </button>
                {index < journey.steps.length - 1 && <div className={styles.connector}><span /></div>}
              </div>;
            })}
            <div className={styles.endNode}><FiCheck aria-hidden="true" /> End of this path</div>
          </div>
          <div className={styles.addSteps}><span>Add a next step</span>{stepTypes.map((type) => { const Icon = icons[type]; return <button type="button" key={type} onClick={() => { const addedId = onAddJourneyStep(journey.id, type); if (addedId) setSelectedId(addedId); }}><Icon aria-hidden="true" /> {typeNames[type]}</button>; })}</div>
        </section>
        <aside className={styles.inspector}>
          {selected ? <StepInspector key={selected.id} journey={journey} selected={selected} onNotify={onNotify} onUpdateJourney={onUpdateJourney} onUpdateJourneyStep={onUpdateJourneyStep} onRemoveJourneyStep={onRemoveJourneyStep} onSelectStep={setSelectedId} /> : <><div className={styles.inspectorHeading}><span className={styles.inspectorIcon}><FiSettings /></span><div><p>STEP SETTINGS</p><h2>Select a step</h2></div></div><p className={styles.hint}>Choose a step in the canvas to review or edit its details.</p></>}
        </aside>
      </div>
    </div>
  );
};

export default JourneyBuilder;
