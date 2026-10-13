import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Toast from "./components/toast";
import Modal from "./components/modal";
import AppRoutes from "./AppRoutes";
import { seedCampaigns, seedContacts, seedJourneys, seedSegments } from "./data/seedData";
import styles from "./App.module.css";

const App = () => {
  const [journeys, setJourneys] = useState(seedJourneys);
  const [campaigns, setCampaigns] = useState(seedCampaigns);
  const [contacts] = useState(seedContacts);
  const [segments, setSegments] = useState(seedSegments);
  const [toast, setToast] = useState(null);
  const [createJourneyOpen, setCreateJourneyOpen] = useState(false);
  const [journeyForm, setJourneyForm] = useState({ name: "", goal: "", trigger: "Joins the newsletter" });
  const [journeyError, setJourneyError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const notify = useCallback((message, type = "success") => setToast({ message, type, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [location.pathname]);

  const createJourney = (data) => {
    const id = `journey-${Date.now()}`;
    const journey = {
      id, name: data.name.trim(), goal: data.goal.trim() || "A new customer lifecycle journey.", trigger: data.trigger,
      status: "Draft", audience: "Choose an audience", updated: "Just now",
      steps: [{ id: `${id}-trigger`, type: "trigger", title: data.trigger, detail: "Entry event for this journey.", enabled: true }],
    };
    setJourneys((current) => [journey, ...current]);
    setJourneyForm({ name: "", goal: "", trigger: "Joins the newsletter" });
    setJourneyError("");
    setCreateJourneyOpen(false);
    notify(`${journey.name} created as a draft.`);
    navigate(`/journeys/${id}`);
    return id;
  };

  const updateJourney = (id, changes) => setJourneys((current) => current.map((journey) => journey.id === id ? { ...journey, ...changes, updated: "Just now" } : journey));
  const duplicateJourney = (id) => {
    const source = journeys.find((journey) => journey.id === id);
    if (!source) return;
    const copyId = `journey-${Date.now()}`;
    const copy = { ...source, id: copyId, name: `${source.name} copy`, status: "Draft", updated: "Just now", steps: source.steps.map((step) => ({ ...step, id: `${copyId}-${step.type}-${Math.random().toString(36).slice(2, 7)}` })) };
    setJourneys((current) => [copy, ...current]);
    notify(`${copy.name} is ready to edit.`);
  };
  const addJourneyStep = (id, type) => {
    const labels = { email: ["Send an email", "Draft a focused message for this moment."], wait: ["Wait 2 days", "Set a thoughtful pause before the next action."], branch: ["If they opened", "Choose a path based on customer activity."] };
    const [title, detail] = labels[type] || labels.email;
    const step = { id: `step-${Date.now()}`, type, title, detail, enabled: true };
    updateJourney(id, { steps: [...(journeys.find((item) => item.id === id)?.steps || []), step] });
    notify(`${title} added to the journey.`);
    return step.id;
  };
  const updateJourneyStep = (journeyId, stepId, changes) => updateJourney(journeyId, { steps: journeys.find((item) => item.id === journeyId)?.steps.map((step) => step.id === stepId ? { ...step, ...changes } : step) || [] });
  const removeJourneyStep = (journeyId, stepId) => updateJourney(journeyId, { steps: journeys.find((item) => item.id === journeyId)?.steps.filter((step) => step.id !== stepId) || [] });
  const deleteJourney = (id) => { const name = journeys.find((item) => item.id === id)?.name; setJourneys((current) => current.filter((item) => item.id !== id)); notify(`${name || "Journey"} deleted.`, "info"); };

  const createCampaign = (data) => {
    const campaign = { id: `campaign-${Date.now()}`, name: data.name.trim(), subject: data.subject.trim(), preheader: data.preheader.trim(), body: data.body.trim(), status: "Draft", channel: "Email", audience: data.audience, updated: "Just now", sent: 0, openRate: null, clickRate: null };
    setCampaigns((current) => [campaign, ...current]);
    notify(`${campaign.name} saved as a draft.`);
    return campaign;
  };
  const updateCampaign = (id, changes) => setCampaigns((current) => current.map((item) => item.id === id ? { ...item, updated: "Just now", ...changes } : item));
  const duplicateCampaign = (id) => {
    const source = campaigns.find((item) => item.id === id);
    if (!source) return;
    const copy = { ...source, id: `campaign-${Date.now()}`, name: `${source.name} copy`, status: "Draft", updated: "Just now", sent: 0, openRate: null, clickRate: null };
    setCampaigns((current) => [copy, ...current]);
    notify(`${copy.name} created.`);
  };
  const deleteCampaign = (id) => { const name = campaigns.find((item) => item.id === id)?.name; setCampaigns((current) => current.filter((item) => item.id !== id)); notify(`${name || "Campaign"} deleted.`, "info"); };
  const scheduleCampaign = (id) => { const item = campaigns.find((campaign) => campaign.id === id); if (!item) return; updateCampaign(id, { status: "Scheduled", updated: "Tomorrow, 9:00 AM" }); notify(`${item.name} is scheduled in this demo. No email was sent.`, "info"); };
  const createSegment = (segment) => { const item = { ...segment, id: `segment-${Date.now()}` }; setSegments((current) => [item, ...current]); notify(`${segment.name} saved.`); return item.id; };
  const deleteSegment = (id) => { const name = segments.find((item) => item.id === id)?.name; setSegments((current) => current.filter((item) => item.id !== id)); notify(`${name || "Audience segment"} deleted.`, "info"); };

  const saveJourneyForm = (event) => {
    event.preventDefault();
    if (!journeyForm.name.trim()) { setJourneyError("Give this journey a name to continue."); return; }
    createJourney(journeyForm);
  };

  return (
    <div className={styles.app}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <Header onNewJourney={() => setCreateJourneyOpen(true)} />
      <main id="main-content" className={styles.main}>
        <AppRoutes journeys={journeys} campaigns={campaigns} contacts={contacts} segments={segments} onNotify={notify} onCreateJourney={createJourney} onUpdateJourney={updateJourney} onDuplicateJourney={duplicateJourney} onDeleteJourney={deleteJourney} onAddJourneyStep={addJourneyStep} onUpdateJourneyStep={updateJourneyStep} onRemoveJourneyStep={removeJourneyStep} onCreateCampaign={createCampaign} onUpdateCampaign={updateCampaign} onDuplicateCampaign={duplicateCampaign} onDeleteCampaign={deleteCampaign} onScheduleCampaign={scheduleCampaign} onCreateSegment={createSegment} onDeleteSegment={deleteSegment} />
      </main>
      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Modal isOpen={createJourneyOpen} title="Start a journey" description="Give this customer path a clear purpose. You can shape its steps next." onClose={() => { setCreateJourneyOpen(false); setJourneyError(""); }}>
        <form className={styles.createForm} onSubmit={saveJourneyForm}>
          <label htmlFor="journey-name">Journey name</label><input id="journey-name" autoFocus maxLength="64" value={journeyForm.name} onChange={(event) => { setJourneyForm((current) => ({ ...current, name: event.target.value })); setJourneyError(""); }} placeholder="e.g. New subscriber welcome" aria-invalid={Boolean(journeyError)} />{journeyError && <span className={styles.errorText}>{journeyError}</span>}
          <label htmlFor="journey-trigger">Entry trigger</label><select id="journey-trigger" value={journeyForm.trigger} onChange={(event) => setJourneyForm((current) => ({ ...current, trigger: event.target.value }))}><option>Joins the newsletter</option><option>Places an order</option><option>Views a product</option><option>Becomes inactive</option></select>
          <label htmlFor="journey-goal">What should it help with?</label><textarea id="journey-goal" rows="3" maxLength="180" value={journeyForm.goal} onChange={(event) => setJourneyForm((current) => ({ ...current, goal: event.target.value }))} placeholder="A short goal for this customer journey" />
          <div className={styles.formActions}><button type="button" onClick={() => setCreateJourneyOpen(false)}>Cancel</button><button type="submit">Create journey</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default App;
