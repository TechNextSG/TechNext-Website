/**
 * Vercel Serverless Function — /api/book
 * Receives booking form data, creates a calendar.event in Odoo.
 * Tries technext.odoo.com first, then erp.technext.asia as fallback.
 * Always returns HTTP 200 so the modal can always show a result.
 */

const ODOO_API_KEY          = process.env.ODOO_API_KEY || '';
const APPOINTMENT_SHORT_CODE = 'c82cf8a9';
const ODOO_HOSTS = [
  'https://technext.odoo.com',
  'https://erp.technext.asia',
];

/* ── helpers ───────────────────────────────────────────────── */

async function rpc(host, model, method, args, kwargs = {}) {
  const res = await fetch(`${host}/web/dataset/call_kw`, {
    method : 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${ODOO_API_KEY}`,
    },
    body  : JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: Date.now(),
      params : { model, method, args, kwargs: { context: {}, ...kwargs } },
    }),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data.result;
}

function sgtToUtc(dateStr, time24) {
  /* dateStr = 'YYYY-MM-DD', time24 = 'HH:MM'
     SGT is UTC+8, so UTC = SGT - 8 hours */
  const [y, m, d]   = dateStr.split('-').map(Number);
  const [h, mi]     = time24.split(':').map(Number);
  const sgtMs       = Date.UTC(y, m - 1, d, h, mi, 0);
  const utcStartMs  = sgtMs - 8 * 3600 * 1000;
  const utcStopMs   = utcStartMs + 3600 * 1000; // 1-hour session
  const fmt = ms => new Date(ms).toISOString().slice(0, 19).replace('T', ' ');
  return { start: fmt(utcStartMs), stop: fmt(utcStopMs) };
}

/* ── main handler ──────────────────────────────────────────── */

module.exports = async function handler(req, res) {
  // CORS — allow same-site requests from Vercel preview URLs too
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const {
    name    = '',
    email   = '',
    phone   = '',
    company = '',
    service = '',
    date    = '',   // YYYY-MM-DD  (SGT)
    time12  = '',   // display label e.g. "9:00 AM"
    time24  = '09:00', // HH:MM (SGT)
    message = '',
  } = req.body || {};

  if (!name || !email || !date) {
    return res.status(400).json({ ok: false, error: 'name, email and date are required' });
  }

  const { start, stop } = sgtToUtc(date, time24);
  const description = [
    `Service : ${service  || '—'}`,
    `Name    : ${name}`,
    `Email   : ${email}`,
    `Phone   : ${phone    || '—'}`,
    `Company : ${company  || '—'}`,
    `Slot    : ${date} ${time12} SGT`,
    `Message : ${message  || '—'}`,
  ].join('\n');

  let booked  = false;
  let eventId = null;
  let usedHost = null;

  for (const host of ODOO_HOSTS) {
    try {
      console.log(`[book] trying ${host}`);

      /* 1. Discover appointment type ID */
      const types = await rpc(host, 'appointment.type', 'search_read', [[]], {
        fields: ['id', 'name', 'short_code'],
        limit : 20,
      });

      let typeId = types.length ? types[0].id : null; // fallback: first type
      for (const t of types) {
        if (t.short_code === APPOINTMENT_SHORT_CODE) { typeId = t.id; break; }
      }

      if (!typeId) {
        console.log(`[book] ${host}: no appointment type found`);
        continue;
      }

      console.log(`[book] ${host}: appointment type id=${typeId}`);

      /* 2. Create calendar event */
      eventId = await rpc(host, 'calendar.event', 'create', [{
        name                : `TechNext Demo — ${name}`,
        start,
        stop,
        appointment_type_id : typeId,
        description,
        partner_email       : email,
      }]);

      if (eventId) {
        booked   = true;
        usedHost = host;
        console.log(`[book] ✅ created event id=${eventId} on ${host}`);
        break;
      }
    } catch (err) {
      console.error(`[book] ${host} failed:`, err.message);
    }
  }

  return res.status(200).json({ ok: true, booked, id: eventId, host: usedHost });
}
