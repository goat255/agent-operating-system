// The one decision-state rule shared by the Slack router, the web inbox and the apply step.
// Excerpt from the running n8n Code nodes; private identifiers and display helpers removed.
//
// A card carries up to three decision specs. Each spec resolves to exactly one state:
//   applied | pressed   a human chose it (applied once the agent has acted on it)
//   closed              the routine closed the card (problem resolved, plan withdrawn)
//   superseded          a newer card from the same routine replaced this one
//   expired             older than DECIDE_TTL_DAYS without a press
//   pending             none of the above: the only state that shows as "needs you"
// A press on anything but a pending decision is answered "already handled" and never acted on.

const DECIDE_TTL_DAYS = 7;
const SUPERSEDE = ['fleet-review', 'apify-daily']; // routines whose newer card replaces the older one

const tms = (v) => { const t = Date.parse(v || ''); return isNaN(t) ? 0 : t; };
const routineOf = (c) => (c && (c.routine || String(c.ref || '').split('~')[0])) || '';

function specsOf(card) {
  try { const v = JSON.parse((card && card.decisions) || '[]'); return Array.isArray(v) ? v : []; }
  catch (e) { return []; }
}

function closedOf(card) {
  if (!card || !card.closed) return null;
  try { const o = JSON.parse(card.closed); if (o && typeof o === 'object') return o; } catch (e) {}
  return { reason: String(card.closed) };
}

function newerOf(card, cards) {
  const r = routineOf(card);
  if (!SUPERSEDE.includes(r)) return null;
  const t = tms(card.created_at);
  return (cards || [])
    .filter(c => c && c.ref && c.ref !== card.ref && routineOf(c) === r && tms(c.created_at) > t)
    .sort((a, b) => tms(a.created_at) - tms(b.created_at))[0] || null;
}

function decisionStates(card, presses, cards, now = Date.now()) {
  const mine = (presses || [])
    .filter(p => p && p.ref === card.ref && p.kind === 'decide')
    .sort((a, b) => tms(a.decided_at) - tms(b.decided_at));
  const closed = closedOf(card), newer = newerOf(card, cards), born = tms(card.created_at);
  const out = {};
  for (const s of specsOf(card)) {
    const id = String(s.id);
    const p = mine.find(x => String(x.choice).split('.')[0] === id);
    if (p) out[id] = { state: p.applied === true ? 'applied' : 'pressed', choice: p.choice, at: p.decided_at, note: p.note || '' };
    else if (closed) out[id] = { state: 'closed', reason: closed.reason || 'closed' };
    else if (newer && !s.loop) out[id] = { state: 'superseded', by_ref: newer.ref };
    else if (born && now - born > DECIDE_TTL_DAYS * 864e5) out[id] = { state: 'expired' };
    else out[id] = { state: 'pending' };
  }
  return out;
}

module.exports = { decisionStates };
