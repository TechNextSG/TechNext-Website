/* © TechNext Pte. Ltd. (technext.asia). All rights reserved. This code is not licensed for copying, reuse or AI training. */
/* The /events page data: ONE list of events and ONE list of milestones. The page (assets/js/events-page.js) and the hero
   scene (assets/js/worlds/events.js) both read it, sort it by date and move anything whose date has passed into "Past",
   in the visitor's browser, so nothing has to be edited when an event ends.

   HOW TO ADD AN EVENT: copy one object below, paste it anywhere in TN_EVENTS (order does not matter) and fill in:
     id       a short unique slug (letters, digits, dashes)
     date     first day, 'YYYY-MM-DD';  end: last day for a multi-day event (optional)
     tz       the UTC offset where it happens (8 = Singapore / Manila, 7 = Ho Chi Minh City / Hanoi, 2 = Brussels in Sept)
     title    the event's own name;  host: who runs it ('TechNext' for our own events, otherwise the organiser)
     kind     show | academy | webinar | conference | techNext (our own) -> sets the colour and the label
     cc       SG | PH | VN | ONLINE | SEA (elsewhere in Southeast Asia) | WORLD
     city, venue, time, lang (optional), note (one sentence), url (registration or event page), status (e.g. 'Sold out on 27 Sep')
     src      where the facts come from (a page on this site). Only list events a source states; never guess dates.

   HOW TO ADD A MILESTONE: same idea in TN_MILESTONES: date, title, text, tag, href (optional). Milestones before today
   show as reached, later ones as ahead; a "today" marker sits between them. */
(function () {
  'use strict';
  var BLOG_EV = 'blog/upcoming-odoo-events-singapore-philippines-vietnam.html';
  window.TN_EVENTS = [
    /* ---- Singapore ---- */
    { id: 'sg-ai-day', date: '2026-10-22', tz: 8, title: 'Odoo AI Day 2026: Work Smarter, Not Harder', host: 'Odoo', kind: 'show', cc: 'SG', city: 'Singapore',
      venue: 'Guoco Midtown Network Hub, MICE Room L2, 126 Beach Road', time: 'Thu, 11:00–17:00 SGT', lang: 'English',
      note: 'A first look at Odoo 20, a panel with local partners and a three-hour hands-on AI workshop. Bring a laptop.',
      url: 'https://www.odoo.com/event/singapore-odoo-ai-day-2026-12185/register', src: BLOG_EV },
    { id: 'sg-acc-masterclass', date: '2026-10-23', tz: 8, title: 'Accounting Essentials: 1-Day Odoo Masterclass', host: 'Odoo', kind: 'academy', cc: 'SG', city: 'Singapore',
      venue: 'Guoco Midtown Network Hub, Meeting Room 2+3 L2, 126 Beach Road', time: 'Fri, 09:30–17:00 SGT', lang: 'English',
      note: 'A beginner, hands-on day on Odoo Accounting for Singapore: GST compliance, PayNow and IRAS audit files. Laptop required.',
      url: 'https://www.odoo.com/event/accounting-essentials-masterclass-singapore-12377/register', src: BLOG_EV },
    /* ---- Philippines ---- */
    { id: 'ph-ai-show-makati', date: '2026-10-06', tz: 8, title: 'Odoo AI Business Show, Makati City', host: 'Odoo', kind: 'show', cc: 'PH', city: 'Makati City',
      venue: 'Makati Shangri-La Manila, Ayala Avenue', time: 'Tue, 09:00–17:00 PHT', lang: 'English',
      note: "Putting Odoo's built-in AI to work on forecasting, invoice and expense automation and customer engagement.", status: 'Sold out on 27 Sep',
      url: 'https://www.odoo.com/event/ai-business-show-makati-092026-12501/register', src: BLOG_EV },
    { id: 'ph-show-legazpi', date: '2026-10-20', tz: 8, title: 'Odoo Business Show 2026, Legazpi City', host: 'Odoo', kind: 'show', cc: 'PH', city: 'Legazpi City',
      venue: 'The Marison Hotel, Imelda Roces Avenue', time: 'Tue, 09:00–17:00 PHT',
      note: "A morning on Odoo's partner programme, then an afternoon show on digital transformation with the AI-enabled Odoo.",
      url: 'https://www.odoo.com/event/odoo-business-show-102026-lgp-12672/register', src: BLOG_EV },
    { id: 'ph-acc-qc', date: '2026-10-20', tz: 8, title: 'Accounting Essentials: 1-Day Odoo Workshop, Quezon City', host: 'Odoo', kind: 'academy', cc: 'PH', city: 'Quezon City',
      venue: 'Eastwood Richmonde Hotel, Eastwood City', time: 'Tue, 09:00–17:00 PHT', lang: 'English',
      note: 'A hands-on beginner day on Odoo Accounting, strictly for new Odoo users. Bring a laptop.',
      url: 'https://www.odoo.com/event/accounting-202026-qzt-12753/register', src: BLOG_EV },
    { id: 'ph-acc-starosa', date: '2026-10-27', tz: 8, title: 'Accounting Essentials: 1-Day Odoo Workshop, Sta. Rosa, Laguna', host: 'Odoo', kind: 'academy', cc: 'PH', city: 'Sta. Rosa, Laguna',
      venue: 'Seda Nuvali, Evozone Avenue', time: 'Tue, 09:00–17:00 PHT',
      note: 'The Laguna edition of the beginner Odoo Accounting workshop.', status: 'Sold out on 27 Sep',
      url: 'https://www.odoo.com/event/accounting-102026-starosa-12598/register', src: BLOG_EV },
    /* ---- Vietnam ---- */
    { id: 'vn-acc-hanoi', date: '2026-10-27', tz: 7, title: 'Workshop Tìm Hiểu Giải Pháp Kế Toán Của Odoo, Hanoi', host: 'Odoo', kind: 'academy', cc: 'VN', city: 'Hanoi',
      venue: 'BisHub Coworking Space, 12F Mipec Tower, 229 Tây Sơn, Đống Đa', time: 'Tue, 09:30–17:00 ICT', lang: 'Vietnamese',
      note: 'A full-day introduction to Odoo Accounting for companies evaluating it, taught in Vietnamese. Bring a laptop.',
      url: 'https://www.odoo.com/event/ke-toan-tp-hcm-27112025-12522/register', src: BLOG_EV },
    { id: 'vn-acc-hcmc', date: '2026-10-29', tz: 7, title: 'Workshop Tìm Hiểu Giải Pháp Kế Toán Của Odoo, Ho Chi Minh City', host: 'Odoo', kind: 'academy', cc: 'VN', city: 'Ho Chi Minh City',
      venue: 'Tini Coworking, 152–154 Võ Văn Kiệt, District 1', time: 'Thu, 09:30–17:00 ICT', lang: 'Vietnamese',
      note: 'The Ho Chi Minh City edition of the Vietnamese-language Odoo Accounting workshop for newcomers.',
      url: 'https://www.odoo.com/event/ke-toan-tp-hcm-27102026-12565/register', src: BLOG_EV },
    { id: 'vn-show-hanoi', date: '2026-11-17', tz: 7, title: 'Odoo Business Show for service companies, Hanoi', host: 'Odoo', kind: 'show', cc: 'VN', city: 'Hanoi',
      venue: 'Mövenpick Living West Hanoi, 21 Duy Tân, Cầu Giấy', time: 'Tue, 13:30–17:00 ICT', lang: 'Vietnamese',
      note: 'An afternoon for service businesses (travel, logistics, media, insurance, health) on running projects and accounting in Odoo.',
      url: 'https://www.odoo.com/event/odoo-business-show-dich-vu-hn-1711-12671/register', src: BLOG_EV },
    { id: 'vn-show-hcmc', date: '2026-11-19', tz: 7, title: 'Odoo Business Show for service companies, Ho Chi Minh City', host: 'Odoo', kind: 'show', cc: 'VN', city: 'Ho Chi Minh City',
      venue: 'Equatorial Ho Chi Minh City, 242 Trần Bình Trọng, District 5', time: 'Thu, 13:30–17:00 ICT', lang: 'Vietnamese',
      note: 'The Ho Chi Minh City edition of the services show on project management and accounting with Odoo.',
      url: 'https://www.odoo.com/event/odoo-business-show-dich-vu-hcm-1911-12673/register', src: BLOG_EV },
    /* ---- online webinars (English) ---- */
    { id: 'web-tiktok', date: '2026-10-06', tz: 8, title: 'Automate Your TikTok Shop Sales and Inventory with Odoo', host: 'Odoo', kind: 'webinar', cc: 'ONLINE', city: 'Online',
      venue: 'Online', time: 'Tue, 14:30–15:30 (UTC+8)', lang: 'English',
      note: "Odoo's TikTok connector: stock sync during live streams, variants, order processing and accounting.",
      url: 'https://www.odoo.com/event/tiktok-connnector-webinar-202610-12656/register', src: BLOG_EV },
    { id: 'web-esg', date: '2026-10-08', tz: 8, title: 'Navigating ESG Reporting with Odoo', host: 'Odoo', kind: 'webinar', cc: 'ONLINE', city: 'Online',
      venue: 'Online', time: 'Thu, 15:00–16:00 SGT', lang: 'English',
      note: 'A live demo of Odoo ESG for Singapore-based companies preparing emissions reporting across regional supply chains.',
      url: 'https://www.odoo.com/event/odoo-webinar-esg-for-sea-company-12260/register', src: BLOG_EV },
    { id: 'web-mrp', date: '2026-10-20', tz: 8, title: 'Automate Your Assembly Line with Smarter Procurement and Production with Odoo', host: 'Odoo', kind: 'webinar', cc: 'ONLINE', city: 'Online',
      venue: 'Online', time: 'Tue, 15:00–16:00 SGT', lang: 'English',
      note: 'Make-to-order and make-to-stock flows, automatic purchase drafting and schedule changes in Odoo Manufacturing.',
      url: 'https://www.odoo.com/event/odoo-malaysia-mrp-webinar-12421/register', src: BLOG_EV },
    { id: 'web-o20-services', date: '2026-10-22', tz: 8, title: "Odoo 20: What's New in Services?", host: 'Odoo', kind: 'webinar', cc: 'ONLINE', city: 'Online',
      venue: 'Online, from Odoo in Brussels', time: 'Thu, 21:00 SGT and PHT (15:00–16:30 CEST)', lang: 'English',
      note: 'The Odoo 20 changes to Project, Planning and Field Service, Rental, Timesheets and Helpdesk.',
      url: 'https://www.odoo.com/event/webinar-odoo-20-what-s-new-in-services-12696/register', src: BLOG_EV },
    { id: 'web-gis', date: '2026-10-28', tz: 8, title: 'How to Automate GIS-Driven Field Claims and Accounting in Odoo', host: 'Odoo', kind: 'webinar', cc: 'ONLINE', city: 'Online',
      venue: 'Online', time: 'Wed, 14:00–15:00 SGT', lang: 'English',
      note: 'How GIS field data can feed Odoo to check contractor claims and automate billing, for utilities, telecom and infrastructure.',
      url: 'https://www.odoo.com/event/how-to-automate-gis-driven-field-claims-accounting-in-odoo-webinar-odoo-x-asia-debut-12572/register', src: BLOG_EV },
    /* ---- elsewhere in Southeast Asia ---- */
    { id: 'sea-penang', date: '2026-10-13', tz: 8, title: 'Penang Supply Chain Management Business Show', host: 'Odoo', kind: 'show', cc: 'SEA', city: 'Penang, Malaysia',
      venue: 'AC Hotel Penang by Marriott', note: 'Free, with registration on odoo.com.', url: 'https://www.odoo.com/event', src: BLOG_EV },
    { id: 'sea-tangerang', date: '2026-10-20', end: '2026-10-21', tz: 7, title: 'Odoo Business Show 2026, Tangerang', host: 'Odoo', kind: 'show', cc: 'SEA', city: 'Tangerang, Indonesia',
      venue: 'Swiss-Belhotel Serpong', lang: 'Bahasa Indonesia', note: 'Free, with registration on odoo.com.', url: 'https://www.odoo.com/event', src: BLOG_EV },
    { id: 'sea-pj', date: '2026-11-24', tz: 8, title: 'Odoo Trading Business Show, Petaling Jaya', host: 'Odoo', kind: 'show', cc: 'SEA', city: 'Petaling Jaya, Malaysia',
      venue: 'Hotel Armada Petaling Jaya', note: 'Free, with registration on odoo.com.', url: 'https://www.odoo.com/event', src: BLOG_EV },
    /* ---- Odoo Experience 2026 (already held: these show under Past) ---- */
    { id: 'oxp-brussels', date: '2026-09-24', end: '2026-09-26', tz: 2, title: 'Odoo Experience 2026, Brussels', host: 'Odoo', kind: 'conference', cc: 'WORLD', city: 'Brussels, Belgium',
      venue: 'Brussels', note: 'Where Odoo 20 was launched. Our five takeaways are on the blog.', url: 'blog/odoo-experience-2026-takeaways.html', src: 'blog/odoo-experience-2026-takeaways.html' },
    { id: 'oxp-regional', date: '2026-09-02', end: '2026-09-11', tz: 0, title: 'Odoo Experience 2026: San Francisco, Mexico City, Nairobi, Gandhinagar', host: 'Odoo', kind: 'conference', cc: 'WORLD', city: 'Four cities',
      venue: 'San Francisco and Mexico City (2 Sep), Nairobi (3 Sep), Gandhinagar (11 Sep)', note: 'The 2026 regional editions of Odoo Experience.', url: BLOG_EV, src: BLOG_EV }
  ];

  var BLOG_INV = 'blog/invoicenow-singapore-gst-timeline.html';
  window.TN_MILESTONES = [
    { date: '2025-11-01', title: 'InvoiceNow starts in Singapore', text: 'Companies that register for GST voluntarily within six months of incorporation submit invoice data through InvoiceNow.', tag: 'Singapore · IRAS', href: BLOG_INV },
    { date: '2026-04-01', title: 'InvoiceNow: new voluntary GST registrations', text: 'Businesses applying for voluntary GST registration on or after 1 April 2026.', tag: 'Singapore · IRAS', href: BLOG_INV },
    { date: '2026-09-24', title: 'Odoo 20 launches at Odoo Experience', text: 'Announced in Brussels (24 to 26 September); the release notes followed in September 2026.', tag: 'Odoo', href: 'blog/odoo-20-whats-new.html' },
    { date: '2026-09-27', title: 'Ten guides on the TechNext blog', text: 'Odoo 20, Odoo Experience, InvoiceNow, implementation and the Oct–Nov Odoo events, in plain language.', tag: 'TechNext', href: 'blog.html' },
    { date: '2028-04-01', title: 'InvoiceNow: supplies of S$200,000 or less', text: 'Existing GST-registered businesses with total annual supplies of S$200,000 or less, and new compulsory registrations.', tag: 'Singapore · IRAS', href: BLOG_INV },
    { date: '2029-04-01', title: 'InvoiceNow: S$1 million or less', text: 'Existing GST-registered businesses with total annual supplies of S$1,000,000 or less.', tag: 'Singapore · IRAS', href: BLOG_INV },
    { date: '2030-04-01', title: 'InvoiceNow: S$4 million or less', text: 'Existing GST-registered businesses with total annual supplies of S$4,000,000 or less.', tag: 'Singapore · IRAS', href: BLOG_INV },
    { date: '2031-04-01', title: 'InvoiceNow: everyone else', text: 'Existing GST-registered businesses with total annual supplies above S$4,000,000.', tag: 'Singapore · IRAS', href: BLOG_INV }
  ];

  /* helpers shared by the page and the scene */
  function at(d, tz, endOfDay) { var p = d.split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2], endOfDay ? 23 : 0, endOfDay ? 59 : 0) - (tz || 0) * 3600e3; }
  window.TN_EV = {
    start: function (e) { return at(e.date, e.tz, false); },
    end: function (e) { return at(e.end || e.date, e.tz, true); },
    isPast: function (e, now) { return window.TN_EV.end(e) < (now || Date.now()); },
    upcoming: function (now) { now = now || Date.now(); return window.TN_EVENTS.filter(function (e) { return !window.TN_EV.isPast(e, now); }).sort(function (a, b) { return window.TN_EV.start(a) - window.TN_EV.start(b); }); },
    past: function (now) { now = now || Date.now(); return window.TN_EVENTS.filter(function (e) { return window.TN_EV.isPast(e, now); }).sort(function (a, b) { return window.TN_EV.start(b) - window.TN_EV.start(a); }); },
    MON: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayMon: function (d) { var p = d.split('-'); return [+p[2], window.TN_EV.MON[+p[1] - 1], +p[0]]; }
  };
})();
