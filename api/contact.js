// Vercel Serverless Function — Contact Form → Odoo RPC
// Creates a res.partner + logs a note with the inquiry details

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, company, phone, service, budget, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' })
  }

  const ODOO_URL = process.env.ODOO_URL
  const ODOO_DB = process.env.ODOO_DB
  const ODOO_USER = process.env.ODOO_USERNAME
  const ODOO_PASS = process.env.ODOO_PASSWORD

  if (!ODOO_URL || !ODOO_DB || !ODOO_USER || !ODOO_PASS) {
    return res.status(500).json({ error: 'Odoo configuration missing' })
  }

  try {
    // 1. Authenticate
    const authRes = await odooRpc(ODOO_URL, {
      service: 'common',
      method: 'authenticate',
      args: [ODOO_DB, ODOO_USER, ODOO_PASS, {}],
    })

    const uid = authRes.result
    if (!uid || typeof uid !== 'number') {
      return res.status(500).json({ error: 'Odoo authentication failed' })
    }

    // 2. Create contact (res.partner) — minimal fields for compatibility
    const partnerValues = {
      name: name,
      email: email,
      is_company: false,
    }

    if (phone) partnerValues.phone = phone
    if (company) partnerValues.company_name = company

    let partnerId
    try {
      const createRes = await odooRpc(ODOO_URL, {
        service: 'object',
        method: 'execute_kw',
        args: [
          ODOO_DB, uid, ODOO_PASS,
          'res.partner', 'create',
          [partnerValues],
        ],
      })
      partnerId = createRes.result
    } catch (createErr) {
      // If company_name fails, retry without it
      console.warn('Partner create failed, retrying without company_name:', createErr.message)
      delete partnerValues.company_name
      const retryRes = await odooRpc(ODOO_URL, {
        service: 'object',
        method: 'execute_kw',
        args: [
          ODOO_DB, uid, ODOO_PASS,
          'res.partner', 'create',
          [partnerValues],
        ],
      })
      partnerId = retryRes.result
    }

    if (!partnerId) {
      return res.status(500).json({ error: 'Failed to create contact in Odoo' })
    }

    // 3. Log a note (mail.message) on the contact
    const noteBody = `
      <p><strong>📧 New inquiry from TechNext.asia</strong></p>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        ${company ? `<li><strong>Company:</strong> ${escapeHtml(company)}</li>` : ''}
        ${phone ? `<li><strong>Phone:</strong> ${escapeHtml(phone)}</li>` : ''}
        <li><strong>Service Interest:</strong> ${escapeHtml(service || 'Not specified')}</li>
        <li><strong>Budget:</strong> ${escapeHtml(budget || 'Not specified')}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message)}</p>
    `

    try {
      await odooRpc(ODOO_URL, {
        service: 'object',
        method: 'execute_kw',
        args: [
          ODOO_DB, uid, ODOO_PASS,
          'mail.message', 'create',
          [{
            body: noteBody,
            message_type: 'comment',
            subtype_xmlid: 'mail.mt_note',
            model: 'res.partner',
            res_id: partnerId,
          }],
        ],
      })
    } catch (noteErr) {
      // Note failed but contact was created — still a success
      console.warn('Note creation failed (contact was created):', noteErr.message)
    }

    return res.status(200).json({ success: true, partnerId })
  } catch (err) {
    console.error('Odoo RPC error:', err)
    return res.status(500).json({ error: 'Failed to submit to Odoo', details: err.message })
  }
}

async function odooRpc(url, params) {
  const response = await fetch(`${url}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: Date.now(),
      params,
    }),
  })
  const data = await response.json()
  if (data.error) {
    const msg = data.error.data?.message || data.error.message || 'Odoo RPC Error'
    throw new Error(msg)
  }
  return data
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
