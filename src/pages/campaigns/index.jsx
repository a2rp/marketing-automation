import { useMemo, useState } from "react";
import { FiArrowRight, FiCalendar, FiCopy, FiEdit3, FiMail, FiPlus, FiSearch, FiSend, FiTrash2 } from "react-icons/fi";
import ConfirmationDialog from "../../components/confirmationDialog";
import Modal from "../../components/modal";
import { seedSegments } from "../../data/seedData";
import styles from "./styles.module.css";

const CampaignEditor = ({ campaign, onClose, onSave, onSchedule, onNotify }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ subject: campaign.subject, preheader: campaign.preheader, body: campaign.body });
  const patch = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = (event) => { event.preventDefault(); if (!form.subject.trim() || !form.body.trim()) { onNotify("Add a subject and message before saving.", "error"); return; } onSave(campaign.id, form); setEditing(false); };
  return <Modal isOpen title={editing ? "Edit campaign content" : campaign.name} description={editing ? "Shape a clear message before scheduling the sample." : "Preview how this email could look in a customer inbox."} onClose={onClose} size="large">
    {editing ? <form className={styles.editorForm} onSubmit={save}><label htmlFor="campaign-subject">Subject line</label><input id="campaign-subject" name="subject" value={form.subject} onChange={patch} maxLength="90" required /><label htmlFor="campaign-preheader">Inbox preview text</label><input id="campaign-preheader" name="preheader" value={form.preheader} onChange={patch} maxLength="120" /><label htmlFor="campaign-body">Message</label><textarea id="campaign-body" name="body" value={form.body} onChange={patch} rows="8" maxLength="1200" required /><div className={styles.modalActions}><button type="button" onClick={() => setEditing(false)}>Cancel edits</button><button type="submit">Save content</button></div></form> : <div className={styles.emailPreview}><div className={styles.emailChrome}><span>To: {campaign.audience.toLowerCase()} · Preview only</span><span>•••</span></div><div className={styles.emailBody}><p className={styles.emailBrand}>goodbrief<span>.</span></p><p className={styles.emailPreviewText}>{campaign.preheader}</p><h3>{campaign.subject}</h3><p>{campaign.body}</p><div className={styles.emailCta}>Explore the collection <FiArrowRight /></div><small>Sent to {campaign.audience} · No message is sent from this preview.</small></div><div className={styles.modalActions}><button type="button" onClick={() => setEditing(true)}><FiEdit3 /> Edit content</button>{campaign.status === "Draft" && <button type="button" onClick={() => { onSchedule(campaign.id); onClose(); }}>Schedule demo</button>}</div></div>}
  </Modal>;
};

const Campaigns = ({ campaigns, onNotify, onCreateCampaign, onUpdateCampaign, onDuplicateCampaign, onDeleteCampaign, onScheduleCampaign }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(campaigns[0]?.id || "");
  const [previewId, setPreviewId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", preheader: "", body: "", audience: "All subscribers" });
  const [formError, setFormError] = useState("");
  const selected = campaigns.find((campaign) => campaign.id === selectedId) || campaigns[0];
  const previewCampaign = campaigns.find((campaign) => campaign.id === previewId);
  const deleteTarget = campaigns.find((campaign) => campaign.id === deleteId);
  const filters = ["All", "Draft", "Scheduled", "Sent"];
  const visible = useMemo(() => campaigns.filter((campaign) => (filter === "All" || campaign.status === filter) && `${campaign.name} ${campaign.subject} ${campaign.audience}`.toLowerCase().includes(query.toLowerCase())), [campaigns, filter, query]);
  const counts = { All: campaigns.length, Draft: campaigns.filter((item) => item.status === "Draft").length, Scheduled: campaigns.filter((item) => item.status === "Scheduled").length, Sent: campaigns.filter((item) => item.status === "Sent").length };

  const create = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) { setFormError("Add a name, subject, and message to save this campaign."); return; }
    const campaign = onCreateCampaign(form);
    setSelectedId(campaign.id);
    setForm({ name: "", subject: "", preheader: "", body: "", audience: "All subscribers" });
    setFormError(""); setCreateOpen(false);
  };

  return <div className={styles.page}>
    <div className={styles.heading}><div><p className={styles.label}>CAMPAIGN STUDIO</p><h1>One good message at a time.</h1><p>Draft, review, and shape the message before it reaches an audience.</p></div><button className={styles.createButton} type="button" onClick={() => setCreateOpen(true)}><FiPlus /> New campaign</button></div>
    <div className={styles.tabs} aria-label="Filter campaigns by status">{filters.map((item) => <button key={item} type="button" className={filter === item ? styles.tabActive : ""} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}<span>{counts[item]}</span></button>)}</div>
    <div className={styles.workspace}>
      <section className={styles.campaignColumn}>
        <div className={styles.listTools}><label><FiSearch /><span className={styles.visuallyHidden}>Search campaigns</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns" /></label><span>{visible.length} messages</span></div>
        {visible.length ? <div className={styles.campaignList}>{visible.map((campaign) => <article className={[styles.campaignCard, selected?.id === campaign.id ? styles.campaignSelected : ""].join(" ")} key={campaign.id}>
          <button className={styles.selectCard} type="button" onClick={() => setSelectedId(campaign.id)} aria-pressed={selected?.id === campaign.id}><span className={styles.campaignIcon}><FiMail /></span><span className={styles.campaignName}><strong>{campaign.name}</strong><small>{campaign.subject}</small></span><span className={[styles.status, styles[campaign.status.toLowerCase()]].join(" ")}>{campaign.status}</span></button>
          <div className={styles.campaignFoot}><span>{campaign.audience}</span><span>{campaign.updated}</span><div><button type="button" onClick={() => onDuplicateCampaign(campaign.id)} aria-label={`Duplicate ${campaign.name}`} title="Duplicate"><FiCopy /></button><button type="button" onClick={() => setDeleteId(campaign.id)} aria-label={`Delete ${campaign.name}`} title="Delete"><FiTrash2 /></button></div></div>
        </article>)}</div> : <div className={styles.empty}><h2>No messages here.</h2><p>Try another filter or create a campaign draft.</p><button type="button" onClick={() => { setFilter("All"); setQuery(""); }}>Show all campaigns</button></div>}
      </section>
      <aside className={styles.previewPanel}>
        {selected ? <>
          <div className={styles.previewHeading}><div><p>MESSAGE PREVIEW</p><h2>{selected.name}</h2></div><span className={[styles.status, styles[selected.status.toLowerCase()]].join(" ")}>{selected.status}</span></div>
          <div className={styles.previewCard}><div className={styles.previewHeader}><span>GOODBRIEF MAIL</span><span>{selected.channel}</span></div><div className={styles.previewContent}><p className={styles.previewSubject}>{selected.subject}</p><p className={styles.previewPreheader}>{selected.preheader}</p><div className={styles.previewRule} /><p>{selected.body}</p><span className={styles.previewLink}>A helpful next step <FiArrowRight /></span></div><div className={styles.previewFooter}>Message preview · {selected.audience}</div></div>
          {selected.status === "Sent" ? <div className={styles.performance}><div><span>Delivered</span><strong>{selected.sent.toLocaleString()}</strong></div><div><span>Open rate</span><strong>{selected.openRate}%</strong></div><div><span>Click rate</span><strong>{selected.clickRate}%</strong></div></div> : <div className={styles.previewNote}><FiCalendar /><span>Scheduling only updates this local demo. No email is sent.</span></div>}
          <div className={styles.previewActions}><button type="button" onClick={() => setPreviewId(selected.id)}><FiEdit3 /> Open preview & editor</button>{selected.status === "Draft" && <button className={styles.schedule} type="button" onClick={() => onScheduleCampaign(selected.id)}><FiSend /> Schedule demo</button>}</div>
        </> : <div className={styles.empty}><h2>Select a campaign</h2><p>Choose a draft on the left to preview it.</p></div>}
      </aside>
    </div>
    <Modal isOpen={createOpen} title="Create a campaign" description="Start with a clear message. You can edit and preview it before scheduling." onClose={() => { setCreateOpen(false); setFormError(""); }} size="large"><form className={styles.editorForm} onSubmit={create}><label htmlFor="campaign-name">Campaign name</label><input id="campaign-name" autoFocus value={form.name} onChange={(event) => { setForm((current) => ({ ...current, name: event.target.value })); setFormError(""); }} placeholder="e.g. A note from the studio" maxLength="64" /><label htmlFor="campaign-audience">Audience</label><select id="campaign-audience" value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}>{seedSegments.map((segment) => <option key={segment.id}>{segment.name}</option>)}<option>Returning customers</option></select><label htmlFor="new-subject">Subject line</label><input id="new-subject" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} placeholder="The note customers will see" maxLength="90" /><label htmlFor="new-preheader">Inbox preview text</label><input id="new-preheader" value={form.preheader} onChange={(event) => setForm((current) => ({ ...current, preheader: event.target.value }))} placeholder="A little more context" maxLength="120" /><label htmlFor="new-body">Message</label><textarea id="new-body" rows="5" value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} placeholder="Write a useful, focused message." maxLength="1200" />{formError && <p className={styles.formError} role="alert">{formError}</p>}<div className={styles.modalActions}><button type="button" onClick={() => setCreateOpen(false)}>Cancel</button><button type="submit">Save campaign draft</button></div></form></Modal>
    {previewCampaign && <CampaignEditor key={previewCampaign.id} campaign={previewCampaign} onClose={() => setPreviewId(null)} onSave={onUpdateCampaign} onSchedule={onScheduleCampaign} onNotify={onNotify} />}
    <ConfirmationDialog isOpen={Boolean(deleteTarget)} title="Delete this campaign?" itemName={deleteTarget?.name} description="The campaign draft and its local performance details will be removed from this session." confirmLabel="Delete campaign" cancelLabel="Keep campaign" onConfirm={() => { onDeleteCampaign(deleteId); if (selectedId === deleteId) setSelectedId(""); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
  </div>;
};

export default Campaigns;
