/* =============================================================
   TechNext — Booking Modal (shared across all pages)
   ============================================================= */
(function () {
  const _alreadyHasModal = !!document.getElementById('bookingModal');

  if (!_alreadyHasModal) {
  /* ── CSS ─────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
.booking-modal {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(10,12,28,0.72); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
  opacity: 0; pointer-events: none; transition: opacity 0.28s ease;
}
.booking-modal.open { opacity: 1; pointer-events: all; }
.booking-box {
  background: #fff; border-radius: 28px; max-width: 500px; width: 100%;
  max-height: 90vh; overflow-y: auto; position: relative;
  box-shadow: 0 32px 80px rgba(0,0,0,0.28);
  transform: translateY(28px) scale(0.97);
  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  font-family: 'DM Sans', sans-serif;
}
.booking-modal.open .booking-box { transform: translateY(0) scale(1); }
.booking-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.4rem 1.6rem 0;
}
.booking-brand { font-family: 'Montserrat', sans-serif; font-size: 0.95rem; font-weight: 800; color: #6d2d7a; letter-spacing: -0.02em; }
.booking-close {
  width: 30px; height: 30px; border-radius: 50%;
  background: #f1f5f9; border: none; cursor: pointer;
  font-size: 1rem; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s; line-height: 1;
}
.booking-close:hover { background: #e2e8f0; color: #1a1a2e; transform: rotate(90deg); }
.booking-progress { display: flex; align-items: center; padding: 1.1rem 1.6rem 0; }
.bp-step {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700;
  background: #f1f5f9; color: #64748b; transition: all 0.3s;
}
.bp-step.active { background: #6d2d7a; color: #fff; }
.bp-step.done { background: #dcfce7; color: #16a34a; }
.bp-line { flex: 1; height: 2px; background: #e2e8f0; margin: 0 4px; transition: background 0.3s; }
.bp-line.done { background: #86efac; }
.booking-step { padding: 1.4rem 1.6rem 1.6rem; display: none; }
.booking-step.active { display: block; }
.bk-h { font-family: 'Caveat', cursive; font-size: 1.75rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
.bk-sub { font-size: 0.85rem; color: #64748b; margin-bottom: 1.3rem; }
.service-opts { display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 1.3rem; }
.service-opt {
  display: flex; align-items: center; gap: 0.9rem;
  background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 14px;
  padding: 0.9rem 1.1rem; cursor: pointer; text-align: left; width: 100%;
  transition: all 0.18s; font-family: 'DM Sans', sans-serif;
}
.service-opt:hover { border-color: #6d2d7a; background: #faf5ff; }
.service-opt.selected { border-color: #6d2d7a; background: #faf5ff; box-shadow: 0 0 0 3px rgba(109,45,122,0.08); }
.service-opt-icon { width: 28px; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #6d2d7a; }
.service-opt-icon svg { width: 22px; height: 22px; }
.service-opt-name { font-size: 0.9rem; font-weight: 700; color: #1a1a2e; }
.service-opt-desc { font-size: 0.75rem; color: #64748b; margin-top: 1px; }
.booking-fields { display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.3rem; }
.booking-input {
  width: 100%; padding: 11px 14px; border: 1.5px solid #e2e8f0;
  border-radius: 11px; font-size: 0.88rem; font-family: 'DM Sans', sans-serif;
  color: #1a1a2e; background: #fff; transition: border-color 0.2s; outline: none;
}
.booking-input:focus { border-color: #6d2d7a; }
.booking-input.err { border-color: #ef4444; }
textarea.booking-input { resize: none; height: 76px; }
.bk-nav { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-top: 1.2rem; }
.bk-back {
  background: none; border: 1.5px solid #e2e8f0; border-radius: 100px;
  padding: 9px 20px; font-size: 0.83rem; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer; color: #64748b; transition: all 0.18s;
}
.bk-back:hover { border-color: #94a3b8; color: #1a1a2e; }
.bk-btn {
  background: #6d2d7a; color: #fff; border: none; border-radius: 100px;
  padding: 11px 26px; font-size: 0.88rem; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.22s;
  box-shadow: 0 4px 14px rgba(109,45,122,0.25);
}
.bk-btn:hover { background: #5a2568; transform: translateY(-1px); }
.bk-btn:disabled { opacity: 0.42; cursor: not-allowed; transform: none; box-shadow: none; }
/* Step 3 — calendar redirect */
.bk-cal-card {
  background: linear-gradient(135deg, #faf5ff 0%, #f0e6ff 100%);
  border: 1.5px solid #e9d5ff; border-radius: 18px;
  padding: 1.6rem 1.4rem; text-align: center; margin-bottom: 1.2rem;
}
.bk-cal-icon {
  width: 64px; height: 64px; background: #6d2d7a; border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem; box-shadow: 0 8px 24px rgba(109,45,122,0.3);
}
.bk-cal-icon svg { width: 32px; height: 32px; color: #fff; }
.bk-cal-title { font-family: 'Caveat', cursive; font-size: 1.5rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.3rem; }
.bk-cal-desc { font-size: 0.83rem; color: #64748b; line-height: 1.6; margin-bottom: 1.2rem; }
.bk-open-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 14px 24px; background: #6d2d7a; color: #fff;
  border: none; border-radius: 100px; font-size: 0.92rem; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer; text-decoration: none;
  transition: all 0.22s; box-shadow: 0 4px 16px rgba(109,45,122,0.28);
}
.bk-open-btn:hover { background: #5a2568; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(109,45,122,0.36); }
.bk-open-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
.bk-slots-hint {
  display: flex; align-items: center; gap: 6px; justify-content: center;
  font-size: 0.75rem; color: #6d2d7a; margin-top: 0.8rem; font-weight: 600;
}
.bk-slots-hint::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
/* Step 4 — success */
.bk-success { text-align: center; padding: 1.5rem 0 0.5rem; }
.bk-check { width: 60px; height: 60px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.1rem; }
.wa-btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px;
  background: #22c55e; color: #fff; border-radius: 100px;
  font-size: 0.85rem; font-weight: 700; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  text-decoration: none;
}
.wa-btn:hover { background: #16a34a; transform: translateY(-1px); }
`;
  document.head.appendChild(style);

  /* ── HTML ─────────────────────────────────────────────────── */
  const modal = document.createElement('div');
  modal.className = 'booking-modal';
  modal.id = 'bookingModal';
  modal.innerHTML = `
  <div class="booking-box" id="bookingBox">
    <div class="booking-header">
      <div class="booking-brand">✦ TechNext</div>
      <button class="booking-close" onclick="closeBooking()" aria-label="Close">✕</button>
    </div>
    <div class="booking-progress">
      <div class="bp-step active" id="bp1">1</div>
      <div class="bp-line" id="bl1"></div>
      <div class="bp-step" id="bp2">2</div>
      <div class="bp-line" id="bl2"></div>
      <div class="bp-step" id="bp3">3</div>
    </div>

    <!-- Step 1: Service -->
    <div class="booking-step active" id="bStep1">
      <div class="bk-h">What can we help with?</div>
      <div class="bk-sub">Choose the service you're interested in</div>
      <div class="service-opts">
        <button class="service-opt" onclick="selectService(this,'AI Automations & Agents')">
          <span class="service-opt-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="4" x2="9" y2="2"/><line x1="15" y1="4" x2="15" y2="2"/><line x1="9" y1="22" x2="9" y2="20"/><line x1="15" y1="22" x2="15" y2="20"/><line x1="4" y1="9" x2="2" y2="9"/><line x1="4" y1="15" x2="2" y2="15"/><line x1="22" y1="9" x2="20" y2="9"/><line x1="22" y1="15" x2="20" y2="15"/></svg></span>
          <div><div class="service-opt-name">AI Automations &amp; Agents</div><div class="service-opt-desc">AI agents, chatbots, RAG systems &amp; local LLMs</div></div>
        </button>
        <button class="service-opt" onclick="selectService(this,'Odoo ERP Implementation')">
          <span class="service-opt-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
          <div><div class="service-opt-name">Odoo ERP Implementation</div><div class="service-opt-desc">End-to-end ERP for your business operations</div></div>
        </button>
        <button class="service-opt" onclick="selectService(this,'Both — Full Package')">
          <span class="service-opt-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></span>
          <div><div class="service-opt-name">Both — Full Package</div><div class="service-opt-desc">Complete digital transformation: AI + ERP</div></div>
        </button>
      </div>
      <div style="display:flex;justify-content:flex-end">
        <button class="bk-btn" id="s1Next" onclick="goStep(2)" disabled>Continue →</button>
      </div>
    </div>

    <!-- Step 2: Details -->
    <div class="booking-step" id="bStep2">
      <div class="bk-h">Your details</div>
      <div class="bk-sub">Quick intro — then we'll open the booking calendar</div>
      <div class="booking-fields">
        <input class="booking-input" type="text" id="bName" placeholder="Full Name *">
        <input class="booking-input" type="email" id="bEmail" placeholder="Email Address *">
        <input class="booking-input" type="tel" id="bPhone" placeholder="Phone / WhatsApp">
        <input class="booking-input" type="text" id="bCompany" placeholder="Company Name">
        <textarea class="booking-input" id="bChallenge" placeholder="What's your biggest challenge right now? (optional)"></textarea>
      </div>
      <div class="bk-nav">
        <button class="bk-back" onclick="goStep(1)">← Back</button>
        <button class="bk-btn" onclick="validateStep2()">Pick a Time →</button>
      </div>
    </div>

    <!-- Step 3: Open Odoo calendar -->
    <div class="booking-step" id="bStep3">
      <div class="bk-cal-card">
        <div class="bk-cal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="bk-cal-title">Choose your slot</div>
        <div class="bk-cal-desc">Our live calendar shows real availability.<br>Pick a time and you're confirmed instantly.</div>
        <a id="bkOdooLink" href="https://technext.odoo.com/book/c82cf8a9" target="_blank" rel="noopener" class="bk-open-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Open Booking Calendar →
        </a>
        <div class="bk-slots-hint">Slots available this week</div>
      </div>
      <div class="bk-nav">
        <button class="bk-back" onclick="goStep(2)">← Back</button>
      </div>
    </div>

  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', function (e) { if (e.target === this) closeBooking(); });
  } // end !_alreadyHasModal

  /* ── WhatsApp Floating Button + Chat Widget (always injected) ── */
  if (!document.getElementById('waFloat')) {
    const waStyle = document.createElement('style');
    waStyle.textContent = `
#waFloat {
  position: fixed; bottom: 28px; right: 28px; z-index: 1900;
  width: 56px; height: 56px; border-radius: 50%;
  background: #25d366; color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.45);
  border: none; cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
#waFloat:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.6); }
#waFloat svg { width: 30px; height: 30px; }
@keyframes waPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.45); }
  50%       { box-shadow: 0 4px 32px rgba(37,211,102,0.75), 0 0 0 8px rgba(37,211,102,0.12); }
}
#waFloat { animation: waPulse 2.8s ease-in-out infinite; }
#waFloat:hover, #waFloat.wa-active { animation: none; }
#waChatWidget {
  position: fixed; bottom: 96px; right: 28px; z-index: 1901;
  width: 320px; border-radius: 18px; overflow: hidden;
  box-shadow: 0 12px 48px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.1);
  font-family: 'DM Sans', -apple-system, sans-serif;
  opacity: 0; pointer-events: none;
  transform: translateY(16px) scale(0.96);
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
#waChatWidget.wa-open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }
.wa-wgt-header {
  background: #128C7E; padding: 14px 16px;
  display: flex; align-items: center; gap: 10px;
}
.wa-wgt-avatar {
  width: 40px; height: 40px; border-radius: 50%; background: #075E54;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem; font-weight: 800; color: #fff; flex-shrink: 0;
  letter-spacing: -0.01em;
}
.wa-wgt-info { flex: 1; min-width: 0; }
.wa-wgt-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
.wa-wgt-status { font-size: 0.71rem; color: rgba(255,255,255,0.82); margin-top: 2px; }
.wa-wgt-close {
  width: 28px; height: 28px; background: rgba(255,255,255,0.15);
  border: none; border-radius: 50%; cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; transition: background 0.18s; flex-shrink: 0;
}
.wa-wgt-close:hover { background: rgba(255,255,255,0.3); }
.wa-wgt-body { background: #ece5dd; padding: 16px 14px 14px; }
.wa-chat-time {
  font-size: 0.68rem; color: #667781;
  background: rgba(255,255,255,0.7); border-radius: 100px;
  padding: 3px 10px; display: table; margin: 0 auto 12px;
}
.wa-chat-bubble {
  background: #fff; border-radius: 0 10px 10px 10px;
  padding: 10px 13px 8px; max-width: 88%; position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.13);
  font-size: 0.83rem; line-height: 1.5; color: #111;
}
.wa-chat-bubble::before {
  content: ''; position: absolute; top: 0; left: -6px;
  width: 0; height: 0;
  border-right: 6px solid #fff; border-bottom: 6px solid transparent;
}
.wa-chat-bubble p { margin: 0 0 4px; }
.wa-chat-bubble p:last-child { margin-bottom: 0; }
.wa-chat-meta { font-size: 0.65rem; color: #667781; text-align: right; margin-top: 5px; }
.wa-wgt-footer {
  background: #f0f0f0; padding: 8px 10px;
  display: flex; align-items: center; gap: 8px;
}
#waMsg {
  flex: 1; border: none; border-radius: 22px;
  padding: 9px 14px; font-size: 0.82rem;
  font-family: 'DM Sans', -apple-system, sans-serif;
  resize: none; height: 38px; outline: none; color: #111;
  background: #fff; line-height: 1.4; overflow: hidden;
}
#waSendBtn {
  width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%;
  background: #25d366; border: none; cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.18s, transform 0.15s;
}
#waSendBtn:hover { background: #20b858; transform: scale(1.06); }
#waSendBtn svg { width: 20px; height: 20px; margin-left: 2px; }
@media (max-width: 380px) {
  #waChatWidget { width: calc(100vw - 20px); right: 10px; bottom: 84px; }
  #waFloat { right: 10px; bottom: 16px; }
}
`;
    document.head.appendChild(waStyle);

    const widget = document.createElement('div');
    widget.id = 'waChatWidget';
    const _waNow = new Date();
    const _waTime = _waNow.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    widget.innerHTML = '<div class="wa-wgt-header">'
      + '<div class="wa-wgt-avatar">TN</div>'
      + '<div class="wa-wgt-info">'
      + '<div class="wa-wgt-name">TechNext Asia</div>'
      + '<div class="wa-wgt-status">&#9679; Typically replies instantly</div>'
      + '</div>'
      + '<button class="wa-wgt-close" id="waChatClose" aria-label="Close">&#x2715;</button>'
      + '</div>'
      + '<div class="wa-wgt-body">'
      + '<div class="wa-chat-time">Today, ' + _waTime + '</div>'
      + '<div class="wa-chat-bubble">'
      + '<p>&#128075; Hi there!</p>'
      + '<p>How can we help you? Drop us a message and we\'ll get back to you right away.</p>'
      + '<div class="wa-chat-meta">' + _waTime + ' ✓✓</div>'
      + '</div></div>'
      + '<div class="wa-wgt-footer">'
      + '<textarea id="waMsg" placeholder="Type a message...">Hi TechNext! I\'d like to know more about your services.</textarea>'
      + '<button id="waSendBtn" aria-label="Send on WhatsApp">'
      + '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>'
      + '</button></div>';
    document.body.appendChild(widget);

    const wa = document.createElement('button');
    wa.id = 'waFloat';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor">'
      + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>'
      + '<path d="M11.997 0C5.373 0 0 5.373 0 12c0 2.121.554 4.11 1.523 5.837L.057 23.885l6.225-1.634A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.624 0 11.997 0zm.003 21.818a9.818 9.818 0 0 1-5.007-1.369l-.359-.213-3.697.97.988-3.606-.234-.371A9.818 9.818 0 0 1 2.182 12c0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818 0 5.414-4.404 9.818-9.818 9.818z"/>'
      + '</svg>';
    document.body.appendChild(wa);

    wa.addEventListener('click', function () {
      const open = widget.classList.toggle('wa-open');
      wa.classList.toggle('wa-active', open);
    });

    document.getElementById('waChatClose').addEventListener('click', function (e) {
      e.stopPropagation();
      widget.classList.remove('wa-open');
      wa.classList.remove('wa-active');
    });

    document.getElementById('waSendBtn').addEventListener('click', function () {
      const msg = (document.getElementById('waMsg').value || '').trim()
        || 'Hi TechNext! I\'d like to know more about your services.';
      window.open('https://wa.me/6588396998?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
    });

    document.getElementById('waMsg').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('waSendBtn').click();
      }
    });
  }

  /* ── JS (always registered) ──────────────────────────────── */
  if (_alreadyHasModal) {
    const m = document.getElementById('bookingModal');
    if (m) m.addEventListener('click', function(e) { if (e.target === this) closeBooking(); });
  }

  const ODOO_BOOKING_URL = 'https://technext.odoo.com/book/c82cf8a9';
  let _bkService = '';

  window.openBooking = function () {
    window.open('https://technext.odoo.com/book/c82cf8a9', '_blank', 'noopener,noreferrer');
  };

  window.closeBooking = function () {
    document.getElementById('bookingModal').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.goStep = function (n) {
    [1,2,3].forEach(function(i) {
      document.getElementById('bStep'+i).classList.toggle('active', i===n);
      const bp = document.getElementById('bp'+i);
      if (bp) {
        bp.classList.remove('active','done');
        if (i < n) { bp.classList.add('done'); bp.textContent = '✓'; }
        else if (i === n) { bp.classList.add('active'); bp.textContent = i; }
        else bp.textContent = i;
      }
      if (i <= 2) {
        const bl = document.getElementById('bl'+i);
        if (bl) bl.classList.toggle('done', i < n);
      }
    });
  };

  window.selectService = function (el, svc) {
    _bkService = svc;
    document.querySelectorAll('.service-opt').forEach(function(o) { o.classList.remove('selected'); });
    el.classList.add('selected');
    document.getElementById('s1Next').disabled = false;
  };

  window.validateStep2 = function () {
    const name  = document.getElementById('bName').value.trim();
    const email = document.getElementById('bEmail').value.trim();
    document.getElementById('bName').classList.toggle('err', !name);
    document.getElementById('bEmail').classList.toggle('err', !email);
    if (name && email) goStep(3);
  };

})();

/* =============================================================
   TechNext — Exit-Intent Notification
   ============================================================= */
(function () {
  const EI_KEY = 'tn_exit_shown';
  if (sessionStorage.getItem(EI_KEY)) return;

  const s = document.createElement('style');
  s.textContent = `
#eiOverlay {
  position: fixed; inset: 0; z-index: 3000;
  background: rgba(10,12,28,0.68); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  opacity: 0; pointer-events: none;
  transition: opacity 0.32s ease;
}
#eiOverlay.ei-open { opacity: 1; pointer-events: all; }
#eiBox {
  background: #fff; border-radius: 28px; max-width: 460px; width: 100%;
  padding: 2.2rem 2rem 1.8rem; position: relative; text-align: center;
  box-shadow: 0 32px 80px rgba(0,0,0,0.26);
  transform: translateY(32px) scale(0.96);
  transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1);
  font-family: 'DM Sans', sans-serif;
}
#eiOverlay.ei-open #eiBox { transform: translateY(0) scale(1); }
#eiClose {
  position: absolute; top: 14px; right: 14px;
  width: 30px; height: 30px; border-radius: 50%;
  background: #f1f5f9; border: none; cursor: pointer;
  font-size: 1rem; color: #64748b; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
}
#eiClose:hover { background: #e2e8f0; color: #1a1a2e; transform: rotate(90deg); }
.ei-badge {
  display: inline-block; background: #fef9c3; color: #854d0e;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; padding: 4px 12px; border-radius: 100px;
  margin-bottom: 1rem;
}
.ei-headline {
  font-family: 'Caveat', cursive; font-size: 2.4rem; font-weight: 700;
  color: #1a1a2e; line-height: 1.1; margin-bottom: 0.6rem;
}
.ei-headline span { color: #6d2d7a; }
.ei-sub {
  font-size: 0.9rem; color: #64748b; line-height: 1.7;
  margin-bottom: 1.6rem; max-width: 340px; margin-left: auto; margin-right: auto;
}
.ei-perks {
  display: flex; justify-content: center; gap: 1.4rem;
  margin-bottom: 1.6rem; flex-wrap: wrap;
}
.ei-perk {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8rem; font-weight: 600; color: #475569;
}
.ei-perk-dot { width: 8px; height: 8px; border-radius: 50%; background: #6d2d7a; flex-shrink: 0; }
.ei-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 36px; background: #6d2d7a; color: #fff;
  border-radius: 100px; font-size: 0.95rem; font-weight: 700;
  font-family: 'DM Sans', sans-serif; border: none; cursor: pointer;
  transition: all 0.22s; box-shadow: 0 4px 18px rgba(109,45,122,0.28);
  width: 100%; justify-content: center;
}
.ei-cta:hover { background: #5a2568; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(109,45,122,0.32); }
.ei-dismiss {
  display: block; margin-top: 0.9rem; font-size: 0.8rem;
  color: #94a3b8; cursor: pointer; background: none; border: none;
  font-family: 'DM Sans', sans-serif; transition: color 0.18s;
}
.ei-dismiss:hover { color: #64748b; }
@media (max-width: 480px) {
  #eiBox { padding: 1.8rem 1.4rem 1.5rem; border-radius: 22px; }
  .ei-headline { font-size: 2rem; }
  .ei-perks { gap: 0.8rem; }
}
`;
  document.head.appendChild(s);

  const el = document.createElement('div');
  el.id = 'eiOverlay';
  el.innerHTML = `
<div id="eiBox">
  <button id="eiClose" onclick="eiClose()" aria-label="Close">✕</button>
  <div class="ei-badge">🎁 Free Offer</div>
  <div class="ei-headline">Wait — before<br>you <span>leave!</span></div>
  <p class="ei-sub">Get a free 1-hour AI strategy session. We’ll map out exactly how AI automation can save your team 10+ hours a week.</p>
  <div class="ei-perks">
    <div class="ei-perk"><div class="ei-perk-dot"></div>No commitment</div>
    <div class="ei-perk"><div class="ei-perk-dot"></div>1 hour · Free</div>
    <div class="ei-perk"><div class="ei-perk-dot"></div>Real actionable plan</div>
  </div>
  <button class="ei-cta" onclick="eiBook()">Book My Free Session →</button>
  <button class="ei-dismiss" onclick="eiClose()">No thanks, I don’t need this</button>
</div>`;
  document.body.appendChild(el);
  el.addEventListener('click', function (e) { if (e.target === this) eiClose(); });

  function eiShow() {
    if (sessionStorage.getItem(EI_KEY)) return;
    const bm = document.getElementById('bookingModal');
    if (bm && bm.classList.contains('open')) return;
    sessionStorage.setItem(EI_KEY, '1');
    el.classList.add('ei-open');
  }

  window.eiClose = function () { el.classList.remove('ei-open'); };
  window.eiBook  = function () {
    el.classList.remove('ei-open');
    window.open('https://technext.odoo.com/book/c82cf8a9', '_blank', 'noopener,noreferrer');
  };

  let _eiMouseReady = false;
  setTimeout(function () { _eiMouseReady = true; }, 3000);
  document.addEventListener('mouseleave', function (e) {
    if (!_eiMouseReady) return;
    if (e.clientY <= 0) eiShow();
  }, { passive: true });

  (function () {
    var lastY = 0, maxY = 0, _fired = false;
    window.addEventListener('scroll', function () {
      if (_fired) return;
      var y = window.scrollY || window.pageYOffset;
      if (y > maxY) maxY = y;
      if (maxY > window.innerHeight * 0.4 && lastY - y > 200) {
        _fired = true;
        setTimeout(eiShow, 300);
      }
      lastY = y;
    }, { passive: true });
  })();

  var _eiTimer = setTimeout(function () { eiShow(); }, 60000);
  document.addEventListener('click',     function () { clearTimeout(_eiTimer); }, { once: true, passive: true });
  document.addEventListener('keydown',   function () { clearTimeout(_eiTimer); }, { once: true, passive: true });
  document.addEventListener('touchstart',function () { clearTimeout(_eiTimer); }, { once: true, passive: true });
})();
