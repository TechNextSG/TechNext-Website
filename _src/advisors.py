# -*- coding: utf-8 -*-
"""TechNext advisors on /advisors (client-facing, indexed).

ADVISORS: one entry per named advisor, in display order. Leave it EMPTY until the owner sends real details: nothing is
invented. While it is empty the "Meet the advisors" section is not rendered at all. Fields:
  name, role (e.g. "Lead Odoo consultant · Finance"), office ("sg" | "ph" | "vn"), photo (file in assets/img/team/,
  square, ideally 600x600 WebP; without one the card shows initials), years (int or None), focus (list of expertise
  keys from EXPERTISE below), creds (list of short credentials, e.g. "Odoo 18 Functional certification"), bio (one or
  two sentences), linkedin (URL or None).

EXPERTISE: the advisory practices, shown as role cards whether or not named advisors are listed yet.
"""

ADVISORS = []

OFFICES = {"sg": "Singapore HQ", "ph": "Taguig City hub", "vn": "Ho Chi Minh City hub"}

EXPERTISE = [
    {"key": "finance", "role": "Finance & accounting adviser", "odoo": ["accountant", "account"],
     "lead": "For the people who close the month. How the books, banks and tax should run once everything is in one database.",
     "advise": ["Chart of accounts and journals that fit how you report", "Bank feeds, reconciliation and a shorter month-end",
                "Government compliance: BIR in the Philippines, GST and InvoiceNow in Singapore", "Multi-currency, multi-company and what to migrate"],
     "ask": "Which reports does your accountant or auditor ask for every month, and how long do they take today?",
     "href": "odoo/apps/accountant.html", "link": "Odoo Accounting"},
    {"key": "sales", "role": "Sales, CRM & service adviser", "odoo": ["crm", "sale", "helpdesk"],
     "lead": "For the path from first enquiry to paid invoice, and the support that follows.",
     "advise": ["Pipeline stages that match how your team really sells", "Pricelists, discounts and approval rules on quotations",
                "Invoicing on order, on delivery or by milestone", "Helpdesk and after-sales on the same customer record"],
     "ask": "Where does a quotation wait the longest before the customer says yes?",
     "href": "odoo/crm-development.html", "link": "CRM development"},
    {"key": "supply", "role": "Supply chain & inventory adviser", "odoo": ["stock", "purchase"],
     "lead": "For stock you can trust: what you hold, where it is, and when to buy more.",
     "advise": ["Warehouses, locations and routes for receipts and picking", "Reordering rules that raise purchase orders on time",
                "Lots, serial numbers and expiry dates where you need them", "Barcode scanning on the warehouse floor"],
     "ask": "How do you find out a product has run out: from the system, or from a customer?",
     "href": "odoo/apps/stock.html", "link": "Odoo Inventory"},
    {"key": "operations", "role": "Manufacturing & projects adviser", "odoo": ["mrp", "project"],
     "lead": "For businesses that make things or deliver jobs, where cost per unit or per project decides the margin.",
     "advise": ["Bills of materials, work orders and real unit cost", "Job costing per project, timesheets and subcontractors",
                "Progress billing, retention and milestone invoices", "Planning people and machines without a whiteboard"],
     "ask": "Do you know the real margin on your last finished job, and how long did it take to work out?",
     "href": "solutions/enterprise.html", "link": "Enterprise solution"},
    {"key": "ai", "role": "AI & automation adviser", "odoo": ["ai_app"],
     "lead": "For deciding where AI genuinely saves hours, and where a plain Odoo rule does the job better.",
     "advise": ["Which repetitive tasks to automate first", "Knowledge assistants that answer from your own documents",
                "Agents and chatbots that hand off to a person", "Running AI on your data with your access rules"],
     "ask": "Which question does your team answer by hand more than ten times a day?",
     "href": "odoo/ai-integration.html", "link": "AI integration"},
    {"key": "digital", "role": "Website & brand adviser", "odoo": ["website"],
     "lead": "For the face of the business: a website and brand that run on the same system as your sales.",
     "advise": ["Website structure built around what customers ask", "Forms that land straight in your CRM pipeline",
                "Brand assets your team can reuse without a designer", "Online store tied to real stock and prices"],
     "ask": "What do customers ask you most before they buy, and is the answer on your website?",
     "href": "solutions/website.html", "link": "Web design"},
]
