# -*- coding: utf-8 -*-
"""Hero lead for each of the 50 Odoo app pages, in TechNext's adviser voice (22 Oct 2026).

build.py app_page() shows LEADS[module] in the hero in place of the line scraped from odoo.com
(apps_content.json "headline" and "lead"), and drops the scraped slogan above it. The body sections
still quote Odoo's own feature descriptions as feature facts; only the hero is ours.

Rules: 1-2 sentences, plain British English, what the app does for a growing company and what we set
up (configure, migrate, train, support). No prices, Odoo is never "free", no accreditation claims.
BIR clauses (Accounting, Invoicing, Sales, Point of Sale, Payroll) use only: Odoo PH localisation
produces 2307 per payee, SLSP/SAWT/QAP as DAT files and the 2550Q; Odoo 20 PH payroll covers 1601-C,
2316 and 1604-C; EOPT invoice rules; e-invoicing by 31 Dec 2026 for covered taxpayers (the EIS link is
project work). HTML-safe: write & as &amp;.
"""

LEADS = {
    # Finance
    "accountant": "Odoo Accounting keeps books, bank reconciliation, tax reports and month-end close in one database. We configure it, migrate your opening balances and train your team, and for Philippine companies we set it up for BIR requirements: 2307 per payee, SLSP, SAWT and QAP as DAT files, and the 2550Q.",
    "account": "Odoo Invoicing sends invoices from your own templates, takes payment online and reminds customers about overdue ones. We set it up, and for Philippine companies the invoices follow the EOPT rules; for covered taxpayers we plan e-invoicing ahead of 31 December 2026, including the link to the BIR's EIS.",
    "hr_expense": "Receipts arrive from a phone or an email, managers approve the claim, and approved expenses move on to your accounts. We set up your expense categories and approval rules, train your staff and support you after go-live.",
    "spreadsheet_dashboard": "Pivots, charts and dashboards read live from your Odoo data, so reports no longer depend on exports to a spreadsheet. We build the first dashboards with your managers, then train your team to edit them.",
    "documents": "Odoo Documents gives company files one home, with workspaces, access rules and OCR, instead of inboxes and shared drives. We set up the workspaces, move your existing files in and train your team.",
    "sign": "Contracts and forms go out for electronic signature from the record they belong to, and you can see who has signed. We prepare your templates and signing steps, train your team and support you after go-live.",

    # Sales
    "crm": "Every lead and deal sits in one pipeline, with follow-ups scheduled and a quotation created from each won opportunity. We shape the stages to how your team sells, bring in your contacts and open deals, and train your sales team.",
    "sale": "Odoo Sales takes an order from quotation to delivery and invoice, with templates, pricelists and a customer portal. We configure the flow and train your sales team, and for Philippine companies the invoices that follow are set up for the EOPT rules, and for covered taxpayers we plan e-invoicing ahead of 31 December 2026.",
    "point_of_sale": "Odoo Point of Sale runs your shop checkout, keeps selling when the connection drops and posts the day's takings to your accounts. We set up products, payment methods and cashier training; for Philippine companies the invoices are set up for the EOPT rules, we check your POS registration with your accountant, and for covered taxpayers we plan e-invoicing ahead of 31 December 2026.",
    "pos_restaurant": "Tables, orders, kitchen screens and bills run from one system, with dine-in, kiosk and online orders in the same view. We set up your floor plan, menu and kitchen display, then train your front-of-house and kitchen staff.",
    "sale_subscription": "Customers are billed on a schedule, renewals and upsells are tracked, and recurring revenue is reported by plan. We set up your plans and invoicing rules, migrate active contracts and train your team.",
    "sale_renting": "Assets are booked by the hour, day or week, availability is checked as you quote, and pick-ups and returns are tracked. We set up your rental products and prices, load current bookings and train your team.",

    # Websites
    "website": "Your team edits pages by drag and drop, with SEO tools built in, and form enquiries land in your CRM. We build or migrate the site on a staging copy, train the people who edit it and support it after go-live.",
    "website_sale": "The online store runs on the same database as your stock and accounting, so orders, inventory and invoices stay in step. We set up the catalogue, delivery and payment options, migrate your products and train your team.",
    "website_blog": "Your team publishes and schedules articles from the same site as the rest of your website, with SEO tools alongside. We set up the layouts, migrate existing posts and train your editors.",
    "website_forum": "Customers and staff ask and answer questions on your own site, and karma points reward the most helpful members. We agree the moderation rules with you, set the forum up and train your team.",
    "im_livechat": "Visitors ask a question from your website and the conversation reaches the right person in Discuss, with leads and tickets created from the chat. We set up your channels, rules and chatbot and train your agents.",
    "website_slides": "Courses, quizzes and certifications are hosted on your website, and each learner's progress is tracked. We set up the course structure and access rules, load your existing training content and train your team.",

    # Supply chain
    "stock": "Odoo Inventory tracks stock across warehouses with barcodes, lots and serial numbers, and raises purchase orders when stock runs low. We model your sites and routes, count opening stock in, train your warehouse team and support you after go-live.",
    "mrp": "Production orders are planned from your bills of materials, work orders are tracked on the shop floor and component availability is checked in advance. We set up your bills of materials and work centres, migrate item data and train planners and operators.",
    "mrp_plm": "Engineering changes and product versions are controlled, so production works from the approved bill of materials. We set up your change-order process, migrate current revisions and train engineering and production.",
    "purchase": "Odoo Purchase turns reorder rules and requests for quotation into purchase orders, receipts and supplier bills that match. We load supplier prices and lead times, set approval thresholds and train your buyers.",
    "maintenance": "Preventive work is scheduled and breakdown requests are logged against each machine, so servicing is planned in advance. We load your equipment list, set up maintenance teams and schedules and train your technicians.",
    "quality_control": "Control points sit on receipts and production, a failed check raises a quality alert, and the cause is recorded. We define your checks and worksheets with your quality team and train your inspectors.",

    # Human resources
    "hr": "Staff records, contracts, skills and the org chart live in one place, with private details visible only to the people who should see them. We set up your departments, migrate employee data and train HR.",
    "hr_recruitment": "Every job post and applicant moves through your own hiring stages, and candidates can book interviews online. We set up your pipeline and emails, bring in current applicants and train your recruiters.",
    "hr_holidays": "Leave requests follow your approval rules and every employee's balance stays current. We set up your leave types and allocations, load opening balances and train managers and staff.",
    "hr_appraisal": "Reviews are scheduled, feedback is collected through your own survey templates and goals are tracked. We build your review cycles and templates and train managers and HR.",
    "hr_referral": "Staff share open jobs and follow their referrals through hiring, earning points as candidates progress. We set up the job board and rewards with you and train HR.",
    "fleet": "Each vehicle is recorded with its drivers, contracts, services and running costs, and you are warned before a contract expires. We load your vehicle list, set up cost and contract types and train whoever looks after the fleet.",
    "hr_payroll": "Odoo Payroll turns attendance, time off and expenses into payslips and pay runs. We configure your salary rules, migrate employee pay records and train your payroll team, and for Philippine companies Odoo 20 covers the BIR payroll forms 1601-C, 2316 and 1604-C.",

    # Marketing
    "social": "One team plans, publishes and tracks posts for several social accounts from a single screen. We connect your accounts, set up scheduling and tracking and train your marketers.",
    "mass_mailing": "Campaigns are built from templates, sent to segments of your contact database and reported by what each send produced. We set up your templates and mailing lists, configure sending and train your marketers.",
    "mass_mailing_sms": "Text campaigns go to the contact lists you choose, links are shortened and tracked, and sends can be scheduled ahead. We set up your lists, templates and sending and train your team.",
    "event": "Registration, ticket sales, agendas and badges are handled for events you run on site or online. We set up your event types, ticket and registration forms and train your events team.",
    "marketing_automation": "Multi-step campaigns send messages and move leads along when a contact does something or a date arrives. We design your first campaign workflows with you and train your marketers.",
    "survey": "Forms, quizzes and feedback questionnaires are built in Odoo, and the answers are collected and summarised for you. We build your first surveys and train your team to design the rest.",

    # Services
    "project": "Work is organised as tasks in stages, with milestones, customer access to what you choose to share and time billed to the right client. We set up your stages and task rules and train your project managers.",
    "hr_timesheet": "Time is recorded against projects and tasks with a timer and team views, and billable hours flow into invoices. We set up your projects, billing rules and approvals and train your staff.",
    "industry_fsm": "Odoo Field Service covers on-site jobs, technician schedules and billing time and products from the job. In Odoo 20 these features run in Planning, so we set up your field team there and train your technicians.",
    "helpdesk": "Emails, web forms and chats become tickets, tracked against service targets, with answers kept in a knowledge base. We set up your teams, stages and SLAs and train your agents.",
    "planning": "Shifts and resources, from staff to equipment, are scheduled on one board, and from Odoo 20 Planning also runs field service with a live map. We set up your roles and shift templates and train your schedulers.",
    "appointment": "Customers book a time online against the availability of your staff or resources, synced with Outlook or Google Calendar. We set up your booking pages and reminders and train your team.",

    # Productivity
    "mail": "Discuss gives your team channels, messages and calls that stay linked to the records they are about, with notifications gathered in one inbox. We set up your channels and train your people.",
    "approvals": "Requests for travel, office supplies and payments reach the right approvers, and each decision stays on record. We define your request types and approver rules and train your team.",
    "iot": "Scales, printers and measuring devices connect to your database through an IoT Box, so readings and print jobs land in the right records. We connect the box and devices to your processes and train your team.",
    "voip": "Odoo Phone makes and logs calls from inside Odoo, so each call opens the customer's record, with a call flow designer for menus and queues. We set up your numbers and call flows and train your team.",
    "knowledge": "Process documents, onboarding guides and instructions live in a wiki with access rights per page and links to your Odoo records. We structure the first spaces with your team, move existing documents in and train your staff.",
    "whatsapp": "Your team messages customers on WhatsApp from Odoo, with templates for invoices, tickets and reminders and every conversation kept on the record. We connect your WhatsApp Business account, set up the templates and train your team.",
    "ai_app": "Odoo AI puts assistants and agents inside your apps: they answer questions about your data, create and update records and sort documents. We choose the first use cases with you, configure the agents' instructions and tools and train your team.",
}
