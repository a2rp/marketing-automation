import { useMemo, useState } from "react";
import { FiDownload, FiFilter, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import ConfirmationDialog from "../../components/confirmationDialog";
import Modal from "../../components/modal";
import { segmentSize } from "../../data/seedData";
import styles from "./styles.module.css";

const fields = { status: "Subscription", region: "Region", orders: "Order count", engagement: "Engagement" };
const options = { status: ["Subscribed", "Unsubscribed"], region: ["Brooklyn", "Austin", "Portland", "Boston"], engagement: ["Warm", "Quiet", "High intent"] };
const colors = ["violet", "lime", "coral", "blue"];

const Audiences = ({ contacts, segments, onCreateSegment, onDeleteSegment, onNotify }) => {
  const [selectedId, setSelectedId] = useState(segments[0]?.id || "");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", field: "status", operator: "equals", value: "Subscribed" });
  const [formError, setFormError] = useState("");
  const selected = segments.find((segment) => segment.id === selectedId) || segments[0];
  const deleteTarget = segments.find((segment) => segment.id === deleteId);
  const matchedContacts = useMemo(() => selected ? contacts.filter((contact) => {
    const actual = contact[selected.field];
    if (selected.operator === "greater-than") return Number(actual) > Number(selected.value);
    if (selected.operator === "less-than") return Number(actual) < Number(selected.value);
    if (selected.operator === "contains") return String(actual).toLowerCase().includes(selected.value.toLowerCase());
    return String(actual).toLowerCase() === String(selected.value).toLowerCase();
  }).filter((contact) => `${contact.name} ${contact.email} ${contact.region} ${contact.engagement}`.toLowerCase().includes(search.toLowerCase())) : [], [contacts, selected, search]);
  const subscribedCount = contacts.filter((contact) => contact.status === "Subscribed").length;

  const changeField = (field) => setForm((current) => ({ ...current, field, operator: field === "orders" ? "greater-than" : "equals", value: field === "status" ? "Subscribed" : field === "region" ? "Brooklyn" : field === "orders" ? "1" : "Warm" }));
  const saveSegment = (event) => {
    event.preventDefault();
    if (!form.name.trim()) { setFormError("Name this audience segment before saving."); return; }
    const segment = { ...form, name: form.name.trim(), description: form.description.trim() || `Contacts matching ${fields[form.field].toLowerCase()} rule.`, color: colors[segments.length % colors.length] };
    const id = onCreateSegment(segment);
    setSelectedId(id);
    setForm({ name: "", description: "", field: "status", operator: "equals", value: "Subscribed" });
    setFormError(""); setCreateOpen(false);
  };

  const exportCsv = () => {
    if (!selected || !matchedContacts.length) { onNotify("There are no contacts in this segment to export.", "info"); return; }
    const rows = [["Name", "Email", "Status", "Region", "Orders", "Engagement"], ...matchedContacts.map((contact) => [contact.name, contact.email, contact.status, contact.region, contact.orders, contact.engagement])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${selected.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-contacts.csv`; link.click(); URL.revokeObjectURL(url);
    onNotify(`${matchedContacts.length} sample contacts exported as CSV.`);
  };

  return <div className={styles.page}>
    <div className={styles.heading}><div><p className={styles.label}>PEOPLE, IN CONTEXT</p><h1>Know who you’re talking to.</h1><p>Shape simple segments from the sample contact list and see the audience update as you go.</p></div><button className={styles.createButton} type="button" onClick={() => setCreateOpen(true)}><FiPlus /> Build a segment</button></div>
    <div className={styles.stats}><div><FiUsers /><span>Sample contacts</span><strong>{contacts.length}</strong></div><div><span className={styles.greenDot} /><span>Subscribed contacts</span><strong>{subscribedCount}</strong></div><div><FiFilter /><span>Saved segments</span><strong>{segments.length}</strong></div><p>All records are fictional and stay in this session.</p></div>
    <div className={styles.layout}>
      <aside className={styles.segmentPanel}><div className={styles.panelTitle}><div><h2>Saved audiences</h2><p>Select a rule to preview its members.</p></div><span>{segments.length}</span></div><div className={styles.segmentList}>{segments.map((segment) => { const count = segmentSize(contacts, segment); return <article key={segment.id} className={[styles.segmentCard, selected?.id === segment.id ? styles.segmentSelected : ""].join(" ")}>
        <button type="button" className={styles.segmentSelect} onClick={() => setSelectedId(segment.id)} aria-pressed={selected?.id === segment.id}><span className={[styles.segmentIcon, styles[segment.color] || styles.violet].join(" ")}><FiUsers /></span><span className={styles.segmentCopy}><strong>{segment.name}</strong><small>{segment.description}</small></span><span className={styles.count}>{count}</span></button>
        <div className={styles.segmentRule}><span>{fields[segment.field]}</span><strong>{segment.operator.replaceAll("-", " ")} {segment.value}</strong>{segment.id !== "all-subscribers" && <button type="button" onClick={() => setDeleteId(segment.id)} aria-label={`Delete ${segment.name}`} title="Delete segment"><FiTrash2 /></button>}</div>
      </article>; })}</div><div className={styles.consentNote}><strong>Keep it considerate.</strong><span>Unsubscribed sample contacts are visibly marked. This demo does not send messages.</span></div></aside>
      <section className={styles.contactsPanel}><div className={styles.contactsHeading}><div><p className={styles.label}>LIVE SEGMENT PREVIEW</p><h2>{selected?.name || "No saved segments"}</h2><p>{selected?.description || "Create an audience rule to begin."}</p></div><div className={styles.contactCount}><strong>{matchedContacts.length}</strong><span>contacts</span></div></div>
        <div className={styles.tableTools}><label><span className={styles.visuallyHidden}>Search sample contacts</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people in this segment" /></label><button type="button" onClick={exportCsv} disabled={!matchedContacts.length}><FiDownload /> Export CSV</button></div>
        {matchedContacts.length ? <div className={styles.tableScroll}><table><thead><tr><th>Contact</th><th>Status</th><th>Region</th><th>Orders</th><th>Engagement</th></tr></thead><tbody>{matchedContacts.map((contact) => <tr key={contact.id}><td><div className={styles.person}><span>{contact.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{contact.name}</strong><small>{contact.email}</small></div></div></td><td><span className={[styles.contactStatus, contact.status === "Subscribed" ? styles.subscribed : styles.unsubscribed].join(" ")}>{contact.status}</span></td><td>{contact.region}</td><td>{contact.orders}</td><td><span className={[styles.engagement, contact.engagement === "High intent" ? styles.high : ""].join(" ")}>{contact.engagement}</span></td></tr>)}</tbody></table></div> : <div className={styles.empty}><h3>No contacts match this view.</h3><p>Adjust the contact search to see more of this segment.</p><button type="button" onClick={() => setSearch("")}>Clear search</button></div>}
        <div className={styles.tableFoot}><span>Showing {matchedContacts.length} of {selected ? segmentSize(contacts, selected) : 0} sample records</span><span>Updated just now</span></div>
      </section>
    </div>
    <Modal isOpen={createOpen} title="Build an audience segment" description="Choose one clear rule. The contact preview updates from this session’s sample data." onClose={() => { setCreateOpen(false); setFormError(""); }}>
      <form className={styles.createForm} onSubmit={saveSegment}><label htmlFor="segment-name">Segment name</label><input id="segment-name" autoFocus maxLength="54" value={form.name} onChange={(event) => { setForm((current) => ({ ...current, name: event.target.value })); setFormError(""); }} placeholder="e.g. Recently engaged" /><label htmlFor="segment-description">Description</label><input id="segment-description" maxLength="120" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What makes this group useful?" /><label htmlFor="segment-field">Match contacts where</label><select id="segment-field" value={form.field} onChange={(event) => changeField(event.target.value)}>{Object.entries(fields).map(([key, value]) => <option value={key} key={key}>{value}</option>)}</select><div className={styles.ruleInputs}><label htmlFor="segment-operator">Rule<select id="segment-operator" value={form.operator} onChange={(event) => setForm((current) => ({ ...current, operator: event.target.value }))}>{form.field === "orders" ? <><option value="greater-than">Greater than</option><option value="less-than">Less than</option><option value="equals">Equals</option></> : <><option value="equals">Is</option><option value="contains">Contains</option></>}</select></label><label htmlFor="segment-value">Value{options[form.field] ? <select id="segment-value" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}>{options[form.field].map((value) => <option key={value}>{value}</option>)}</select> : <input id="segment-value" type="number" min="0" max="99" value={form.value} onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))} />}</label></div>{formError && <p className={styles.error} role="alert">{formError}</p>}<div className={styles.modalActions}><button type="button" onClick={() => setCreateOpen(false)}>Cancel</button><button type="submit">Save segment</button></div></form>
    </Modal>
    <ConfirmationDialog isOpen={Boolean(deleteTarget)} title="Delete this segment?" itemName={deleteTarget?.name} description="The saved rule will be removed from the current session. Contact records remain unchanged." confirmLabel="Delete segment" cancelLabel="Keep segment" onConfirm={() => { onDeleteSegment(deleteId); if (selectedId === deleteId) setSelectedId(segments[0]?.id === deleteId ? segments[1]?.id : segments[0]?.id); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
  </div>;
};

export default Audiences;
