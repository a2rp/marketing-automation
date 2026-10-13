export const seedJourneys = [
  {
    id: "welcome-series",
    name: "A warm welcome",
    goal: "Turn new subscribers into curious first-time customers.",
    trigger: "Joins the newsletter",
    status: "Active",
    audience: "New subscribers",
    updated: "Today, 10:42 AM",
    steps: [
      { id: "welcome-trigger", type: "trigger", title: "Joins newsletter", detail: "Starts when a contact subscribes.", enabled: true },
      { id: "welcome-email-one", type: "email", title: "A note from the studio", detail: "Introduce the point of view and the people behind it.", enabled: true },
      { id: "welcome-wait", type: "wait", title: "Wait 2 days", detail: "Give the first note room to land.", enabled: true },
      { id: "welcome-email-two", type: "email", title: "A few things to love", detail: "Share three useful ways to explore the collection.", enabled: true },
    ],
  },
  {
    id: "first-purchase",
    name: "After the first order",
    goal: "Make the first delivery feel considered and easy.",
    trigger: "First order placed",
    status: "Active",
    audience: "First-time customers",
    updated: "Yesterday",
    steps: [
      { id: "purchase-trigger", type: "trigger", title: "First order placed", detail: "Starts after the first completed order.", enabled: true },
      { id: "purchase-email", type: "email", title: "Order care and thanks", detail: "A practical note with a personal tone.", enabled: true },
      { id: "purchase-wait", type: "wait", title: "Wait 7 days", detail: "Allow delivery and first use.", enabled: true },
      { id: "purchase-branch", type: "branch", title: "Review requested?", detail: "Separate customers who have shared a review.", enabled: true },
    ],
  },
  {
    id: "quiet-lapse",
    name: "A gentle return",
    goal: "Reconnect with customers who have not visited in a while.",
    trigger: "No visit in 60 days",
    status: "Draft",
    audience: "Quiet customers",
    updated: "Oct 10, 2026",
    steps: [
      { id: "lapse-trigger", type: "trigger", title: "No visit in 60 days", detail: "Starts after a contact becomes inactive.", enabled: true },
      { id: "lapse-email", type: "email", title: "Something new, when you’re ready", detail: "A calm invitation to see what is new.", enabled: true },
    ],
  },
  {
    id: "browse-follow-up",
    name: "A second look",
    goal: "Offer help after a product browse without a purchase.",
    trigger: "Product viewed twice",
    status: "Paused",
    audience: "Returning browsers",
    updated: "Oct 08, 2026",
    steps: [
      { id: "browse-trigger", type: "trigger", title: "Product viewed twice", detail: "Starts after a second product view.", enabled: true },
      { id: "browse-wait", type: "wait", title: "Wait 1 day", detail: "Avoid an immediate follow-up.", enabled: true },
      { id: "browse-email", type: "email", title: "Need a hand choosing?", detail: "Offer helpful product details.", enabled: true },
    ],
  },
];

export const seedCampaigns = [
  { id: "october-edit", name: "The October edit", subject: "A quieter kind of autumn", preheader: "Objects for the changing light.", body: "The light is shifting. We gathered a few familiar forms and warm finishes for the moments that make a home feel like yours.", status: "Draft", channel: "Email", audience: "All subscribers", updated: "Today, 9:15 AM", sent: 0, openRate: null, clickRate: null },
  { id: "new-studio", name: "A note from the studio", subject: "A little behind the scenes", preheader: "Meet the hands behind this month’s pieces.", body: "A short note about the making process, the small decisions, and the people who shape each piece.", status: "Scheduled", channel: "Email", audience: "New subscribers", updated: "Oct 16, 2026", sent: 0, openRate: null, clickRate: null },
  { id: "summer-table", name: "Set the summer table", subject: "Long lunches, simple things", preheader: "A few pieces made for gathering.", body: "Long lunches are better when the table feels easy. Here are a few pieces that work hard and ask for very little.", status: "Sent", channel: "Email", audience: "Returning customers", updated: "Oct 04, 2026", sent: 4820, openRate: 46.2, clickRate: 8.4 },
  { id: "care-note", name: "How to care for stoneware", subject: "Keep the pieces you love", preheader: "Simple care for everyday ceramics.", body: "Stoneware is made for regular use. A few small habits will keep the glaze and shape looking good for years.", status: "Sent", channel: "Email", audience: "Recent customers", updated: "Sep 28, 2026", sent: 2130, openRate: 51.8, clickRate: 12.1 },
];

export const seedContacts = [
  { id: "c1", name: "Leah Morgan", email: "leah.morgan@example.com", status: "Subscribed", region: "Brooklyn", orders: 0, engagement: "Warm", lastSeen: "Today" },
  { id: "c2", name: "Theo James", email: "theo.james@example.com", status: "Subscribed", region: "Austin", orders: 3, engagement: "High intent", lastSeen: "Today" },
  { id: "c3", name: "Mina Park", email: "mina.park@example.com", status: "Subscribed", region: "Brooklyn", orders: 1, engagement: "Warm", lastSeen: "Yesterday" },
  { id: "c4", name: "Rafael Costa", email: "rafael.costa@example.com", status: "Subscribed", region: "Portland", orders: 4, engagement: "High intent", lastSeen: "Yesterday" },
  { id: "c5", name: "Nora Ellis", email: "nora.ellis@example.com", status: "Unsubscribed", region: "Boston", orders: 1, engagement: "Quiet", lastSeen: "Oct 08" },
  { id: "c6", name: "Ari Patel", email: "ari.patel@example.com", status: "Subscribed", region: "Brooklyn", orders: 2, engagement: "Warm", lastSeen: "Oct 12" },
  { id: "c7", name: "Camille Reed", email: "camille.reed@example.com", status: "Subscribed", region: "Austin", orders: 0, engagement: "Quiet", lastSeen: "Oct 02" },
  { id: "c8", name: "Jules Martin", email: "jules.martin@example.com", status: "Subscribed", region: "Portland", orders: 5, engagement: "High intent", lastSeen: "Today" },
  { id: "c9", name: "Sam Rivera", email: "sam.rivera@example.com", status: "Subscribed", region: "Boston", orders: 1, engagement: "Warm", lastSeen: "Oct 11" },
  { id: "c10", name: "Priya Shah", email: "priya.shah@example.com", status: "Subscribed", region: "Austin", orders: 0, engagement: "Warm", lastSeen: "Oct 13" },
  { id: "c11", name: "Jordan Lee", email: "jordan.lee@example.com", status: "Unsubscribed", region: "Portland", orders: 2, engagement: "Quiet", lastSeen: "Sep 25" },
  { id: "c12", name: "Elsie Grant", email: "elsie.grant@example.com", status: "Subscribed", region: "Brooklyn", orders: 3, engagement: "High intent", lastSeen: "Today" },
];

export const seedSegments = [
  { id: "all-subscribers", name: "All subscribers", description: "Contacts who can receive marketing email.", field: "status", operator: "equals", value: "Subscribed", color: "violet" },
  { id: "high-intent", name: "High intent customers", description: "Customers with repeat orders.", field: "orders", operator: "greater-than", value: "1", color: "lime" },
  { id: "brooklyn-list", name: "Brooklyn community", description: "Subscribed contacts in Brooklyn.", field: "region", operator: "equals", value: "Brooklyn", color: "coral" },
];

export const matchesSegment = (contact, segment) => {
  const actual = contact[segment.field];
  if (segment.operator === "greater-than") return Number(actual) > Number(segment.value);
  if (segment.operator === "less-than") return Number(actual) < Number(segment.value);
  if (segment.operator === "contains") return String(actual).toLowerCase().includes(segment.value.toLowerCase());
  return String(actual).toLowerCase() === String(segment.value).toLowerCase();
};

export const segmentSize = (contacts, segment) => contacts.filter((contact) => matchesSegment(contact, segment)).length;
