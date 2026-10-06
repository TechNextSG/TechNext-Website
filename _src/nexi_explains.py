# -*- coding: utf-8 -*-
"""Nexi Explains: the animated series starring Nexi, listed season by season on /nexi-explains.

One entry per post. `yt` is the YouTube video id once the video is uploaded (scheduled premieres count:
the page counts down to `premiere` and switches the card to "Watch" by itself when that time passes).
Posts without an id show as "Coming soon". To publish a new episode: add its `yt` and `premiere`
(UTC, from YouTube Studio), then run `python _src/build.py`.

Thumbnails live in assets/img/nexi-explains/<thumb>.webp (640x360, from the delivered YouTube
thumbnails). Season 2 episodes have no thumbnails yet (they are made when the whole season is done),
so their cards are drawn: `pose` picks the Nexi render shown on the card.

Numbers and titles follow the posting plans in the Marketing drive:
00. TechNext Folder/22. Nexi Solution Videos/00 Posting Plan.md (Season 1 + Quick Tips 01-14),
26. Nexi Explains - Season 2/00 Season 2 Posting Plan.md, 27. Nexi Holiday Specials.
"""

CHANNEL = "https://www.youtube.com/@TechNextAsia"
SUBSCRIBE = CHANNEL + "?sub_confirmation=1"


def ep(code, title, hook, length, *, thumb=None, yt=None, premiere=None, airs=None, page=None, pose=None, psych=None, takeaway=None):
    return {"code": code, "title": title, "hook": hook, "len": length, "thumb": thumb, "yt": yt,
            "premiere": premiere, "airs": airs, "page": page, "pose": pose, "psych": psych, "takeaway": takeaway}


S1 = [
    ("The pilot", [
        ep("EP00", "Meet Nexi", "TechNext’s AI companion saves the day: a comic-book city, a spreadsheet monster and four power-ups.", "3:37",
           thumb="s1-ep00", yt="iz6BNOrpIrg", premiere="2026-10-13T10:00:00Z", page="nexi.html"),
    ]),
    ("Meet Odoo", [
        ep("EP01", "Odoo Walkthrough with Nexi", "What is Odoo? A quick tour of the apps.", "2:13",
           thumb="s1-ep01", yt="hos3sqJOhMY", premiere="2026-10-17T10:00:00Z", page="odoo/apps.html"),
        ep("EP02", "All Odoo Apps", "Every app, one Odoo: all the apps on one database.", "1:03", thumb="s1-ep02", page="odoo/apps.html"),
        ep("EP03", "Before vs After: Order to Invoice", "Same order, typed three times? Before and after Odoo.", "0:40",
           thumb="s1-ep03", yt="TJe8GlN43U0", premiere="2026-10-24T10:00:00Z", page="solutions/odoo-erp.html"),
        ep("EP04", "Myth-busting: ERP Is Only for Big Companies", "Too small for ERP? Myth busted.", "0:31", thumb="s1-ep04", page="solutions/odoo-erp.html"),
        ep("EP05", "Odoo ERP Implementation", "Spreadsheet chaos? How we implement Odoo ERP.", "1:12", thumb="s1-ep05", page="solutions/odoo-erp.html"),
    ]),
    ("The core apps", [
        ep("EP06", "Odoo Accounting", "It’s a match! Bank lines meet their invoices.", "1:05", thumb="s1-ep06", page="odoo/apps/accountant.html"),
        ep("EP07", "Odoo Sales", "Slow quotes? From quote to paid with Odoo Sales.", "1:04", thumb="s1-ep07", page="odoo/apps/sale.html"),
        ep("EP08", "Odoo Inventory", "One box, five steps: Odoo Inventory.", "1:05", thumb="s1-ep08", page="odoo/apps/stock.html"),
        ep("EP09", "Inventory Reordering Rules", "Out of stock again? Let reordering rules buy for you.", "0:58", thumb="s1-ep09", page="odoo/apps/stock.html"),
        ep("EP10", "CRM Development", "Losing leads? Odoo CRM, explained.", "1:00", thumb="s1-ep10", page="odoo/crm-development.html"),
    ]),
    ("Fit Odoo to you", [
        ep("EP11", "Odoo Customization", "Customize Odoo without breaking upgrades.", "1:03", thumb="s1-ep11", page="odoo/erp-system.html"),
        ep("EP12", "Enterprise Solution: Multi-company", "Three companies, one Odoo.", "1:02", thumb="s1-ep12", page="solutions/enterprise.html"),
    ]),
    ("AI", [
        ep("EP13", "Odoo + AI Integrations", "AI inside Odoo: it prepares, you approve.", "1:02", thumb="s1-ep13", page="odoo/ai-integration.html"),
        ep("EP14", "Workflow Automation", "Still doing it by hand? Let the workflow run itself.", "1:02", thumb="s1-ep14", page="solutions/ai-automation.html"),
        ep("EP15", "AI Chatbots", "Who answers at 2 AM? A chatbot for the night shift.", "1:02", thumb="s1-ep15", page="solutions/ai-chatbots.html"),
    ]),
    ("Marketing", [
        ep("EP16", "Web Design and Development", "Visitors leaving your website? How we build yours.", "1:00", thumb="s1-ep16", page="solutions/website.html"),
        ep("EP17", "Social Media Management", "No likes? How we run your social media.", "0:53", thumb="s1-ep17", page="solutions/social-media.html"),
        ep("EP18", "Graphic and Brand Assets", "One brand, five logos? How we build a brand system.", "0:53", thumb="s1-ep18", page="solutions/brand-assets.html"),
    ]),
    ("Technology", [
        ep("EP19", "App Development", "Apps for customers, staff and portals.", "1:02", thumb="s1-ep19", page="solutions/app-development.html"),
        ep("EP20", "IoT Solutions", "Freezer too warm? Sensors that warn you first.", "1:07", thumb="s1-ep20", page="solutions/iot.html"),
        ep("EP21", "Networks", "Who’s on your Wi-Fi? Your office network as a castle.", "1:02", thumb="s1-ep21", page="solutions/networks.html"),
    ]),
    ("The finale", [
        ep("EP22", "Season 1 Finale", "Everything we learned, in a pop-up book, plus a Season 2 sneak peek.", "2:24", thumb="s1-ep22"),
    ]),
]

S1_TIPS = [
    ep("Tip 01", "Save your search to Favorites", "Same filter every day? Save it once.", "0:37", thumb="qt01"),
    ep("Tip 02", "Jump anywhere with Ctrl+K", "Still clicking through menus? Press Ctrl+K.", "0:37", thumb="qt02",
       yt="haDZKW8Fx6k", premiere="2026-10-22T10:00:00Z"),
    ep("Tip 03", "Edit many records at once", "Change twenty records in one go.", "0:36", thumb="qt03"),
    ep("Tip 04", "Schedule an activity", "Forgot to follow up? Let Odoo remind you.", "0:38", thumb="qt04"),
    ep("Tip 05", "Log a note or send a message", "The customer saw it?! Log note vs send message.", "0:49", thumb="qt05"),
    ep("Tip 06", "Group any list in one click", "Messy lists? Group By in one click.", "0:52", thumb="qt06"),
    ep("Tip 07", "Export any list to Excel", "Need it in Excel? Export any list.", "0:55", thumb="qt07"),
    ep("Tip 08", "Import a spreadsheet", "Typing it all in? Import the spreadsheet instead.", "0:54", thumb="qt08"),
    ep("Tip 09", "Archive instead of delete", "Don’t delete it! Archive it.", "0:55", thumb="qt09"),
    ep("Tip 10", "Show hidden columns", "Missing a column? It’s only hidden.", "0:47", thumb="qt10"),
    ep("Tip 11", "Create a customer on the fly", "New customer? Add them without leaving the quote.", "0:54", thumb="qt11"),
    ep("Tip 12", "Drag files into the chatter", "Drag, drop, done: attach files to any record.", "0:54", thumb="qt12"),
    ep("Tip 13", "Switch views in one click", "Same data, four views.", "0:45", thumb="qt13"),
    ep("Tip 14", "Hold Alt for shortcuts", "Secret shortcuts: hold Alt.", "0:52", thumb="qt14"),
]

S2 = [
    ("Season opener", [
        ep("S2 EP00", "Season 2 Introduction", "Training, adapting and improving: the map of the season.", "2:54", pose="hello",
           psych="Status quo bias", takeaway="Installing Odoo is easy. Changing habits is the hard part."),
    ]),
    ("Arc 1 · The Fear", [
        ep("S2 EP01", "Will Odoo Take My Job?", "Maria from Accounts asked first.", "0:57", pose="think",
           psych="Loss aversion", takeaway="Odoo takes tasks, not people."),
        ep("S2 EP02", "Too Old for Odoo?", "Ben, 58, says so. Then we looked at his phone.", "0:59", pose="love",
           psych="Fixed mindset", takeaway="Small lessons, on his own tasks.", page="odoo/training.html"),
        ep("S2 EP03", "Scared to Click the Wrong Button?", "Pilots don’t learn on a real plane either.", "1:01", pose="wow",
           psych="Psychological safety", takeaway="A test database is a safe place to practise.", page="odoo/training.html"),
        ep("S2 EP04", "Is Odoo Watching Me?", "Every change has your name on it. Here’s what the log is really for.", "0:58", pose="point-left",
           psych="Fear of being watched", takeaway="Use the log to fix mistakes, never to blame people."),
    ]),
    ("Arc 2 · The Boss’s Beliefs", [
        ep("S2 EP05", "Will Odoo Fix Our Mess?", "A race car on the wrong road only gets you lost faster.", "2:20", pose="jump",
           psych="Silver-bullet thinking", takeaway="Fix the process first, then automate it.", page="odoo/discovery.html"),
        ep("S2 EP06", "Odoo Is Free, Right?", "Jun found it online. Then we met Biscuit, the free puppy.", "2:17", pose="love",
           psych="Planning fallacy", takeaway="Free to start. Budget to succeed.", page="quotation.html"),
        ep("S2 EP07", "Can Odoo Work Exactly Like Our Old Way?", "Maria’s 14 tabs, and the blue button that does nothing.", "2:28", pose="think",
           psych="Sunk cost", takeaway="Standard first. Customize what earns money.", page="odoo/erp-system.html"),
        ep("S2 EP08", "IT Will Handle It!", "There is no IT department. Here’s who really owns your Odoo project.", "2:18", pose="wow",
           psych="Diffusion of responsibility", takeaway="One owner, plus the people who do the work."),
    ]),
    ("Arc 3 · Winning and Serving Customers", [
        ep("S2 EP09", "Nobody Opens Your Emails", "2,000 contacts, 11 opens. Why your name beats a megaphone.", "2:16", pose="point-left",
           psych="The cocktail party effect", takeaway="Write to one person, not to everyone.", page="odoo/apps/mass_mailing.html"),
        ep("S2 EP10", "Customers Ask “How Much?” in Chat", "49 of 50 chats say “how much?”.", "2:13", pose="celebrate",
           psych="Friction", takeaway="Remove the extra steps, and buyers buy.", page="odoo/apps/website_sale.html"),
        ep("S2 EP11", "Long Queue at the Counter", "The Saturday queue goes out the door. Ben trades his calculator for a tablet.", "2:20", pose="clap",
           psych="The psychology of waiting", takeaway="Every sale updates stock and accounting.", page="odoo/apps/point_of_sale.html"),
        ep("S2 EP12", "Print, Sign, Scan, Email?", "The customer said yes. A week later: “let’s talk next month”.", "2:18", pose="jump",
           psych="Momentum", takeaway="Make the yes easy, right now.", page="odoo/apps/sign.html"),
        ep("S2 EP13", "Customer Asked 3 Times", "Mrs. Tan asked three times. Then she ordered ten more chairs.", "2:20", pose="hello",
           psych="The peak-end rule", takeaway="Fix the worst moment. End with a smile.", page="odoo/apps/helpdesk.html"),
    ]),
]

S2_TIPS = [
    ep("Tip 15", "Duplicate a record", "The same quote again? Duplicate it.", "0:55", thumb="qt15"),
    ep("Tip 16", "Follow the breadcrumbs", "Three screens deep? The breadcrumbs take you back.", "0:54", thumb="qt16"),
    ep("Tip 17", "Build a custom filter", "Filter on any field, not just the presets.", "0:55", thumb="qt17"),
    ep("Tip 18", "Search one field", "Type, then pick the field to search in.", "0:54", thumb="qt18"),
    ep("Tip 19", "Follow a record", "Follow it, and its updates come to you.", "0:55", thumb="qt19"),
    ep("Tip 20", "Drag cards between stages", "Move a deal or a task by dragging its card.", "0:54", thumb="qt20"),
    ep("Tip 21", "Send a quotation by email", "Send the quote, PDF attached, from the record.", "0:58", thumb="qt21"),
    ep("Tip 22", "Jump with smart buttons", "Everything linked to a record, one click away.", "0:54", thumb="qt22"),
    ep("Tip 23", "Reschedule in the calendar", "Drag the meeting to its new time.", "0:54", thumb="qt23"),
    ep("Tip 24", "Odoo saves for you", "Leave the record and your changes are saved.", "0:56", thumb="qt24"),
    ep("Tip 25", "Combine filters with AND and OR", "Mix filters the way you mean them.", "1:41", thumb="qt25"),
    ep("Tip 26", "Compare with last period", "This month against last month, side by side.", "1:36", thumb="qt26"),
    ep("Tip 27", "Pivot like a pro", "Turn any list into a pivot table.", "1:37", thumb="qt27"),
    ep("Tip 28", "Change the chart type", "Bar, line or pie in one click.", "1:40", thumb="qt28"),
    ep("Tip 29", "Sort and resize columns", "Click to sort, drag to resize.", "1:36", thumb="qt29"),
    ep("Tip 30", "Select all records", "Every record, not just the first page.", "1:34", thumb="qt30"),
    ep("Tip 31", "Add a to-do from anywhere", "One shortcut adds a to-do from any screen.", "1:39", thumb="qt31"),
    ep("Tip 32", "React to a message", "Answer a chatter message with an emoji.", "1:39", thumb="qt32"),
    ep("Tip 33", "Quick-add a card", "Add a card without opening a form.", "1:37", thumb="qt33"),
    ep("Tip 34", "Inbox or email notifications", "Choose where your notifications land.", "1:34", thumb="qt34"),
]

SPECIALS = [
    ep("Halloween", "The Haunted Office", "Five Season 1 lessons come back as office monsters.", "2:44", thumb="hs-halloween", airs="31 Oct"),
    ep("Christmas", "The Christmas Rush", "The busiest week of the year, run on Odoo.", "2:38", thumb="hs-christmas", airs="24 Dec"),
    ep("Year-End", "The Countdown", "Ten Season 1 lessons go up as midnight fireworks.", "2:40", thumb="hs-yearend", airs="31 Dec"),
]

SEASONS = [
    {"id": "season-1", "tab": "Season 1", "name": "Odoo, AI and tech, made simple",
     "blurb": "Twenty-three short episodes: what Odoo is, the apps companies start with, and every TechNext service, each told as a small story with Nexi in a new costume.",
     "status": "Now premiering", "arcs": S1, "tips": S1_TIPS, "tips_name": "Quick Tips 01–14"},
    {"id": "season-2", "tab": "Season 2", "name": "The Human Side of Odoo",
     "blurb": "Installing Odoo is easy. Changing habits is the hard part. Each episode takes one real fear about moving a company onto Odoo, names the psychology behind it and shows the fix, with the Bluebay Trading team.",
     "status": "Coming in 2027", "arcs": S2, "tips": S2_TIPS, "tips_name": "Quick Tips 15–34",
     "more": "More episodes are in production: the plan runs to 31, across six arcs."},
]
