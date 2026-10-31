// Authored Shorts: a defined scenario, mechanism, everyday consequence and payoff.
// Each beat has a deliberately selected animated setting. No model/API is used.
const BANK = "https://www.bankofengland.co.uk/explainers/why-do-we-regulate-banks";
const PAYMENTS = "https://www.npci.org.in/what-we-do/upi/faqs";
const GPS = "https://www.gps.gov/gps-and-telling-time";
const rows = [
  {
    title: "What if everyone tried to withdraw their money at once?", subject: "banks", sources: [BANK],
    beats: [
      ["bank-queue", "Everyone wants cash. Right now.", "What if everyone tried to withdraw their bank balance as cash on the same morning? The queue outside would be only the beginning."],
      ["bank-ledger", "A balance is not a pile of notes.", "Your account balance is a claim on the bank. Its assets include loans and investments, not a separate box of notes with your name on it."],
      ["bank-cash", "Timing becomes the problem.", "Some assets cannot quickly become cash without losses. A sudden rush of withdrawals can create a liquidity problem, even before we know whether the bank is insolvent."],
      ["shop-payment", "Businesses feel the pressure too.", "Businesses could face payment disruption, while banks sought cash or other funding to meet demand. Confidence could matter as much as the queue itself."],
      ["bank-support", "The response changes the outcome.", "Liquidity support and deposit protection can help, but arrangements differ between countries. A bank run does not automatically mean every bank fails."],
      ["bank-ledger", "The lesson: liquidity and trust.", "The real question is not just how much money exists. It is how quickly banks can meet withdrawals, and whether people trust them to do it."],
    ],
  },
  {
    title: "What if all AI systems stopped working tomorrow?", subject: "AI", sources: [],
    beats: [
      ["ai-core", "AI goes offline. The world stays on.", "What if every AI model stopped producing usable results tomorrow, but electricity, the internet, and ordinary software kept working? Your day could still change."],
      ["ai-services", "More than a missing chatbot.", "Chatbots and image generators would be obvious losses. AI-powered translation, recommendations, and document tools could also stop providing their usual results."],
      ["human-work", "Who can take over?", "Businesses relying on those tools might need people or simpler software to take over. The difficult part would be rebuilding capacity, not merely finding an off switch."],
      ["shop-payment", "Backups make the difference.", "A service with a tested manual fallback might continue with delays. Another that built its whole workflow around AI could face a much bigger interruption."],
      ["ai-services", "Different systems, different effects.", "Not every hospital, bank, vehicle, or website uses the same technology. There is no honest single countdown to worldwide collapse from this premise."],
      ["human-work", "Could we still do the work?", "The revealing question would be which skills and backup processes we kept. Losing AI would test how well people understand the work they delegated."],
    ],
  },
  {
    title: "What if UPI and card payments stopped for seven days?", subject: "payments", sources: [PAYMENTS],
    beats: [
      ["shop-payment", "Your shopping is ready. Payment is not.", "What if UPI and card payment services stopped for seven days, while bank records and cash remained intact? Start with a shop full of waiting customers."],
      ["payment-phone", "A QR code cannot finish the payment.", "Scanning a QR code would not complete a payment through a failed service. A balance on a screen would not automatically provide another way to pay."],
      ["bank-cash", "Cash demand could rise.", "People and businesses could turn to cash or other functioning methods, but enough notes, change, and accessible banking services would not be guaranteed everywhere."],
      ["delivery", "The delay travels beyond checkout.", "Some deliveries and purchases could be postponed as sellers changed how they collected payment. Small businesses would face the practical problem of keeping trade moving."],
      ["bank-ledger", "An outage is not a deleted balance.", "This scenario does not erase anyone's account. A payment outage, a failed transaction, and a missing bank record are different problems that need different explanations."],
      ["shop-payment", "One backup is rarely enough.", "The lesson would be about access and alternatives. A payment system can be convenient every day, yet disruption exposes how many routines depend on it."],
    ],
  },
  {
    title: "What if the internet disappeared for a month?", subject: "internet", sources: [],
    beats: [
      ["network-outage", "Online stops. Everything else does not.", "What if internet connectivity vanished worldwide for a month, while electricity and stored computer files survived? The first surprise would be how much still worked offline."],
      ["payment-phone", "Your files or someone else's server?", "Locally saved documents could remain available. Cloud files, online messages, and websites would be unreachable unless a service had a separate, functioning way to connect."],
      ["human-work", "Workflows need a new route.", "Workplaces could shift toward paper records, local software, and whatever independent communication systems remained. The ability to coordinate would become a major constraint."],
      ["delivery", "Moving goods needs information too.", "Orders and deliveries could be disrupted as organizations lost tools for communicating demand and tracking shipments. Physical roads and warehouses would still be there."],
      ["shop-payment", "The impact would be uneven.", "Not every payment or telephone service uses the public internet in the same way. A worldwide connectivity loss does not mean every electronic system instantly dies."],
      ["network-recovery", "Could we operate offline?", "Recovery would involve reconnecting people and reconciling what happened offline. The biggest question is how long our backup routines could remain useful at scale."],
    ],
  },
  {
    title: "What if every digital bank record disappeared?", subject: "records", sources: [],
    beats: [
      ["records-loss", "The records are gone. What proves a balance?", "What if every digital bank record vanished, including backups, while people, buildings, and paper documents remained? This is a fictional deletion far beyond an ordinary outage."],
      ["bank-ledger", "A blank screen is only the surface.", "Banks would lose information used to establish balances, transfers, and obligations. Restarting a computer would not recreate data that the scenario says no longer exists."],
      ["paper-records", "Paper becomes evidence.", "Printed statements, receipts, contracts, and records held outside the deleted systems could help reconstruction. They would not necessarily form a complete or consistent account."],
      ["human-work", "Reconstruction takes agreement.", "Institutions would need ways to reconcile competing claims and decide what evidence to accept. Transactions might be restricted while reliable records were rebuilt."],
      ["bank-support", "Claims do not magically disappear.", "Deleting a record would not by itself settle who legally owed what. The legal response would depend on the country and the circumstances."],
      ["records-recovery", "Trust needs a memory.", "The deeper story is how economic trust depends on shared, recoverable information. Backups protect against real failures; this thought experiment deliberately removes them too."],
    ],
  },
  {
    title: "What if GPS stopped working worldwide?", subject: "GPS", sources: [GPS],
    beats: [
      ["gps-satellite", "Your location is only part of the story.", "What if GPS signals became unusable worldwide? Your navigation app could be affected, but the less obvious problem would be systems that use GPS to tell time."],
      ["gps-map", "A map and a location are different.", "A saved map could still exist on your phone. Placing you accurately on that map would depend on which other positioning methods remained available."],
      ["gps-clock", "A hidden clock stops helping.", "GPS also supplies precise timing used by some communications, power, and financial infrastructure. Losing that source could affect synchronization, not just directions."],
      ["delivery", "Operators would need alternatives.", "Drivers, ships, and other operators could turn to alternative navigation and established procedures. Their options would depend on their equipment, training, and environment."],
      ["gps-satellite", "GPS is not every navigation system.", "Other satellite constellations and ground-based techniques would not automatically disappear in a GPS-only outage. Backup clocks could also preserve timing for a while."],
      ["gps-clock", "The best backup is already prepared.", "The revealing question would be where alternatives were genuinely ready. A system that can survive an outage is different from one that merely has a backup plan."],
    ],
  },
  {
    title: "What if everyone stopped buying nonessential things?", subject: "spending", sources: [],
    beats: [
      ["shop-payment", "The shops open. The customers stop buying.", "What if people everywhere suddenly bought only what they considered essential? This scenario is about a change in spending, not the disappearance of money."],
      ["shop-demand", "One person's saving is another's sale.", "Businesses selling optional purchases could lose customers. The impact would depend on what people classified as essential, and whether they redirected spending elsewhere."],
      ["human-work", "Businesses would adjust.", "Some firms might reduce production, staffing, or orders to suppliers. Others serving newly prioritized needs could experience a different pattern of demand."],
      ["delivery", "The change moves through suppliers.", "A cancelled purchase can affect transport, materials, and services behind the product. Those links explain why changes in demand can reach beyond the original shop."],
      ["bank-ledger", "Lower spending is not a single forecast.", "Savings, debt repayments, business responses, and public policy could all change the outcome. There is no guaranteed universal path from this one assumption."],
      ["shop-demand", "Our purchases connect people's livelihoods.", "The interesting twist is that an individual budget decision becomes a different problem when everyone makes it together. Scale changes the story."],
    ],
  },
  {
    title: "What if automated machines needed human operators again?", subject: "automation", sources: [],
    beats: [
      ["factory", "The machines remain. Autonomy does not.", "What if automated machines could no longer operate independently, but their physical parts and ordinary controls still worked? A factory would need more than extra people at the door."],
      ["human-work", "A human fallback needs trained humans.", "Some tasks could move to manual operation. Others might lack a usable manual mode, or require specialized skills that were no longer readily available."],
      ["factory", "Capacity could become the bottleneck.", "Organizations could need more operators, revised schedules, and new safety procedures. Hiring alone would not instantly recreate the previous volume of work."],
      ["delivery", "Delays would travel downstream.", "If a factory slowed, its customers and suppliers might need to adjust. The effects would depend on inventories and how easily another process could take over."],
      ["human-work", "Not all automation works the same way.", "A simple timer, a remotely operated machine, and an autonomous robot are different technologies. We would need to define exactly which ability stopped working."],
      ["factory", "Could someone still run the process?", "The strongest backup is a process people can actually operate. This scenario tests whether human oversight includes practical skills, rather than merely a person watching a screen."],
    ],
  },
  {
    title: "What if cash disappeared overnight?", subject: "cash", sources: [],
    beats: [
      ["bank-cash", "The notes vanish. Account balances remain.", "What if physical notes and coins vanished overnight, while digital bank balances remained? Paying for the same purchase could become much harder for some people than others."],
      ["shop-payment", "The checkout becomes a test of access.", "A connected buyer with a working payment method might continue shopping. Someone relying on cash could face an immediate barrier to ordinary purchases."],
      ["payment-phone", "Digital access is not universal.", "Devices, connectivity, accessible interfaces, and bank accounts would matter more. Owning a phone alone would not guarantee that a person could make every payment."],
      ["network-outage", "What happens when the connection fails?", "Businesses would need arrangements for outages and customers without access. Replacing cash would require reliable alternatives, not just removing the notes from circulation."],
      ["bank-ledger", "A lost banknote is not a lost bank balance.", "The scenario does not erase account balances or settle whether vanished cash would be replaced. Those are separate assumptions with very different consequences."],
      ["shop-payment", "Convenience and access are different goals.", "The real question is who could still participate in everyday trade. A payment system needs to work for people at its edges, as well as its most connected users."],
    ],
  },
  {
    title: "What if every smartphone stopped working tomorrow?", subject: "smartphones", sources: [],
    beats: [
      ["payment-phone", "One device. An entire daily routine.", "What if every smartphone stopped working tomorrow, while computers and the internet remained? Think beyond calling someone: your tickets, contacts, and login tools might also be on that device."],
      ["phone-access", "Can you still reach your accounts?", "Services using phone-based authentication could become harder to access. Recovery would depend on the alternatives each person and provider had already set up."],
      ["shop-payment", "Ordinary tasks need another route.", "People could shift some work to computers, paper tickets, physical payment cards, and other surviving tools. Not every smartphone task would have an equally convenient substitute."],
      ["delivery", "Businesses share the same dependency.", "Workers using phone apps for orders, deliveries, and customer communication might need new procedures. Reorganizing the work could take longer than finding another screen."],
      ["network-recovery", "The internet itself is still there.", "A broken smartphone does not automatically delete cloud records or stop every bank and website. Losing access to information is different from losing the information itself."],
      ["human-work", "How much did we put in one place?", "The surprising issue is concentration: many independent needs now share one device. This thought experiment asks which routines could survive when that common access point disappeared."],
    ],
  },
];
const catalog = [...rows, ...require("./moreSystemShorts")].map((entry, index) => ({
  ...entry, id: index + 1, family: "systems", format: "short",
  first: entry.beats[1][2], ripple: entry.beats[3][2], caveat: entry.beats[4][2],
}));
module.exports = { catalog, CATALOG_VERSION: "system-shorts-v1" };
