/**
 * Vercel Serverless Function — /api/book
 * Receives booking form data, creates a calendar.event in Odoo.
 *
 * Uses the Odoo 17+ REST API (/api/{model}) with Bearer token auth.
 * Tries technext.odoo.com first, then erp.technext.asia as fallback.
 * Always returns HTTP 200 so the modal can always show a result.
 */

const ODOO_API_KEY           = process.env.ODOO_API_KEY || '';
const APPOINTMENT_SHORT_CODE = 'c82cf8a9';
const ODOO_HOSTS = [
  'https://technext.odoo.com',
  'https://erp.technext.asia',
];

/* ── helpers ───────────────────────────────────────────────── */

function odooHeaders() {
  return {
    'Authorization': `Bearer ${ODOO_API_KEY}`,
    'Content-Type' : 'application/json',
  };
}

/** GET /api/{model}?{params} */
async function odooGet(host, model, params = '') {
  const url = `${host}/api/${model}${params ? '?' + params : ''}`;
  const res = await fetch(url, {
    headers: odooHeaders(),
    signal : AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GET ${url} → ${res.status}: ${body.slice(0, 400)}`);
  }
  return res.json();
}

/** POST /api/{model} */
async function odooCreate(host, model, data) {
  const url = `${host}/api/${model}`;
  const res = await fetch(url, {
    method : 'POST',
    headers: odooHeaders(),
    body   : JSON.stringify(data),
    signal : AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`POST ${url} → ${res.status}: ${body.slice(0, 400)}`);
  }
  return res.json();
}

function sgtToUtc(dateStr, time24) {
  /* dateStr = 'YYYY-MM-DD', time24 = 'HH:MM'
     SGT is UTC+8, so UTC = SGT - 8 hours */
  const [y, m, d]  = dateStr.split('-').map(Number);
  const [h, mi]    = time24.split(':').map(Number);
  const sgtMs      = Date.UTC(y, m - 1, d, h, mi, 0);
  const utcStartMs = sgtMs - 8 * 3600 * 1000;
  const utcStopMs  = utcStartMs + 3600 * 1000; // 1-hour session
  const fmt = ms => new Date(ms).toISOString().slice(0, 19).replace('T', ' ');
  return { start: fmt(utcStartMs), stop: fmt(utcStopMs) };
}

/* ── main handler ──────────────────────────────────────────── */

module.exports = async function handler(req, res) {
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
    date    = '',      // YYYY-MM-DD  (SGT)
    time12  = '',      // display label e.g. "9:00 AM"
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

  let booked   = false;
  let eventId  = null;
  let usedHost = null;

  for (const host of ODOO_HOSTS) {
    try {
      console.log(`[book] trying ${host}`);

      /* 1. Find appointment type ID via REST API */
      const typesResp = await odooGet(
        host,
        'appointment.type',
        'fields=["id","name","short_code"]&limit=20'
      );

      // REST API returns an array directly or { records: [...] }
      const typeList = Array.isArray(typesResp)
        ? typesResp
        : (typesResp.records || typesResp.data || []);

      let typeId = typeList.length ? typeList[0].id : null;
      for (const t of typeList) {
        if (t.short_code === APPOINTMENT_SHORT_CODE) { typeId = t.id; break; }
      }

      if (!typeId) {
        console.log(`[book] ${host}: no appointment type found`);
        continue;
      }

      console.log(`[book] ${host}: appointment type id=${typeId}`);

      /* 2. Create calendar event via REST API */
      const created = await odooCreate(host, 'calendar.event', {
        name                : `TechNext Demo — ${name}`,
        start,
        stop,
        appointment_type_id : typeId,
        description,
        partner_email       : email,
      });

      // REST API returns the created record or { id: N }
      eventId = created.id || (Array.isArray(created) ? created[0] : null);

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
};
