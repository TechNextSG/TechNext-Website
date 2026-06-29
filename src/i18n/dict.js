// 4-language dictionary: English · Tiếng Việt · Filipino (Tagalog) · Deutsch
// EN is the source of truth; missing keys in other languages fall back to EN.

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'vn', label: 'VN', name: 'Tiếng Việt' },
  { code: 'ph', label: 'PH', name: 'Filipino' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
]

export const DICT = {
  // ─────────── NAV / HEADER ───────────
  'nav.about':     { en: 'About',     vn: 'Về chúng tôi', ph: 'Tungkol sa Amin', de: 'Über uns' },
  'nav.services':  { en: 'Services',  vn: 'Dịch vụ',  ph: 'Mga Serbisyo', de: 'Leistungen' },
  'nav.careers':   { en: 'Careers',   vn: 'Tuyển dụng', ph: 'Mga Trabaho', de: 'Karriere' },
  'nav.gallery':   { en: 'Gallery',   vn: 'Thư viện', ph: 'Galerya',     de: 'Galerie' },
  'nav.blog':      { en: 'Blog',      vn: 'Blog',     ph: 'Blog',        de: 'Blog' },
  'nav.contact':   { en: 'Contact',   vn: 'Liên hệ',  ph: 'Kontak',      de: 'Kontakt' },
  'nav.book':      { en: 'Book Now',  vn: 'Đặt lịch', ph: 'Mag-book Ngayon', de: 'Jetzt buchen' },
  'nav.openMenu':  { en: 'Open menu', vn: 'Mở menu',  ph: 'Buksan ang menu', de: 'Menü öffnen' },

  // ─────────── HERO ───────────
  'hero.badge.ai':    { en: 'AI-Native Company', vn: 'Công ty AI-Native', ph: 'AI-Native na Kumpanya', de: 'AI-Native Unternehmen' },
  'hero.badge.trust': { en: 'Vietnam Dev Hub — Hiring', vn: 'Dev Hub Việt Nam — Đang tuyển', ph: 'Vietnam Dev Hub — Nagtatanggap', de: 'Vietnam Dev Hub — Stellen frei' },
  'hero.title.l1':    { en: 'Build the Future', vn: 'Kiến tạo tương lai', ph: 'Buuin ang Kinabukasan', de: 'Die Zukunft gestalten' },
  'hero.title.l2.a':  { en: 'with', vn: 'cùng', ph: 'gamit ang', de: 'mit' },
  'hero.title.l2.b':  { en: 'AI', vn: 'AI', ph: 'AI', de: 'KI' },
  'hero.title.l3.a':  { en: 'Join', vn: 'Gia nhập', ph: 'Sumali sa', de: 'Werde Teil von' },
  'hero.title.l3.b':  { en: 'TechNext.', vn: 'TechNext.', ph: 'TechNext.', de: 'TechNext.' },
  'hero.sub':         {
    en: "We're an AI-native company building enterprise intelligence for global clients across 10 countries. From AI agents and RAG systems to Odoo ERP — we ship production-grade AI for ambitious teams.",
    vn: "Chúng tôi là công ty AI-native xây dựng hệ thống doanh nghiệp thông minh cho khách hàng toàn cầu trên 10 quốc gia. Từ AI agents, RAG đến Odoo ERP — chúng tôi ship AI cấp production cho các đội ngũ tham vọng.",
    ph: "Kami ay isang AI-native na kumpanya na bumubuo ng enterprise intelligence para sa mga kliyenteng global sa 10 bansa. Mula AI agents at RAG hanggang Odoo ERP — naghahatid kami ng production-grade AI para sa mga ambisyosong koponan.",
    de: "Wir sind ein AI-natives Unternehmen und entwickeln Enterprise-Intelligence für globale Kunden in 10 Ländern. Von AI-Agenten und RAG-Systemen bis Odoo ERP — wir liefern produktionsreife KI für ambitionierte Teams.",
  },
  'hero.cta.primary':   { en: 'See Open Roles', vn: 'Xem vị trí đang tuyển', ph: 'Tingnan ang Mga Bakanteng Posisyon', de: 'Offene Stellen ansehen' },
  'hero.cta.secondary': { en: 'Learn More', vn: 'Tìm hiểu thêm', ph: 'Alamin pa', de: 'Mehr erfahren' },

  // ─────────── TRUST BAR ───────────
  'trust.odoo':    { en: 'Certified Odoo Partner', vn: 'Đối tác Odoo được chứng nhận', ph: 'Sertipikadong Odoo Partner', de: 'Zertifizierter Odoo-Partner' },
  'trust.claude':  { en: 'Claude Partner',         vn: 'Đối tác Claude',                ph: 'Claude Partner',               de: 'Claude-Partner' },
  'trust.countries': { en: 'Worldwide',  vn: 'Toàn cầu',           ph: 'Worldwide', de: 'Weltweit' },
  'trust.sg':      { en: 'Singapore PTE LTD',      vn: 'Singapore PTE LTD',             ph: 'Singapore PTE LTD',            de: 'Singapore PTE LTD' },

  // ─────────── STATS ───────────
  'stats.clients.label': { en: 'Enterprise Clients', vn: 'Khách hàng doanh nghiệp', ph: 'Mga Kliyenteng Enterprise', de: 'Enterprise-Kunden' },
  'stats.clients.sub':   { en: 'across 4 continents', vn: 'trên 4 châu lục', ph: 'sa 4 na kontinente', de: 'auf 4 Kontinenten' },
  'stats.countries.label': { en: 'Countries Served', vn: 'Quốc gia phục vụ', ph: 'Mga Bansa', de: 'Länder' },
  'stats.countries.sub': { en: 'SG · VN · AU · EU · US', vn: 'SG · VN · AU · EU · US', ph: 'SG · VN · AU · EU · US', de: 'SG · VN · AU · EU · US' },
  'stats.disc.label':  { en: 'Core AI Disciplines', vn: 'Mảng AI cốt lõi', ph: 'Pangunahing AI Disciplines', de: 'AI-Kerndisziplinen' },
  'stats.disc.sub':    { en: 'agents, RAG, chatbots, ERP', vn: 'agents, RAG, chatbots, ERP', ph: 'agents, RAG, chatbots, ERP', de: 'Agents, RAG, Chatbots, ERP' },

  // ─────────── ABOUT ───────────
  'about.label': { en: 'Life at TechNext', vn: 'Cuộc sống tại TechNext', ph: 'Buhay sa TechNext', de: 'Leben bei TechNext' },
  'about.h2.l1': { en: 'The team building AI', vn: 'Đội ngũ xây dựng AI', ph: 'Ang koponan na bumubuo ng AI', de: 'Das Team, das KI baut' },
  'about.h2.l2': { en: 'for real enterprise',  vn: 'cho doanh nghiệp thực sự', ph: 'para sa tunay na enterprise', de: 'für echte Unternehmen' },
  'about.sub':   {
    en: "We're engineers, AI researchers, and builders shipping enterprise-grade AI for global clients. Multilingual, multicultural, and ridiculously fast on delivery.",
    vn: "Chúng tôi là kỹ sư, nhà nghiên cứu AI, và builder ship AI cấp doanh nghiệp cho khách hàng toàn cầu. Đa ngôn ngữ, đa văn hóa, và cực nhanh trong delivery.",
    ph: "Kami ay mga inhinyero, AI researcher, at builder na naghahatid ng enterprise-grade AI sa mga global na kliyente. Multilingual, multicultural, at sobrang bilis sa delivery.",
    de: "Wir sind Ingenieure, AI-Forscher und Macher, die Enterprise-grade KI für globale Kunden liefern. Mehrsprachig, multikulturell und unfassbar schnell in der Auslieferung.",
  },
  'about.cult1.h': { en: 'Global from Day One', vn: 'Toàn cầu từ ngày đầu', ph: 'Global mula Day One', de: 'Global vom ersten Tag an' },
  'about.cult1.p': { en: 'English-first delivery. Work directly with clients across Singapore, Australia, Europe, and the US.', vn: 'Delivery bằng tiếng Anh. Làm việc trực tiếp với khách ở Singapore, Úc, châu Âu, và Mỹ.', ph: 'English-first na delivery. Direktang trabaho sa mga kliyente sa Singapore, Australia, Europe, at US.', de: 'Englischsprachige Auslieferung. Direkte Zusammenarbeit mit Kunden in Singapur, Australien, Europa und den USA.' },
  'about.cult2.h': { en: 'Ship to Production Fast', vn: 'Ship lên production nhanh', ph: 'Mag-ship sa Production nang Mabilis', de: 'Schnell in Produktion liefern' },
  'about.cult2.p': { en: 'No sandbox projects. Real production AI and ERP systems delivered to enterprise clients within weeks.', vn: 'Không dự án sandbox. AI và ERP cấp production thực sự, giao cho khách doanh nghiệp trong vài tuần.', ph: 'Walang sandbox projects. Tunay na production AI at ERP systems na inihahatid sa mga enterprise client sa loob ng ilang linggo.', de: 'Keine Sandbox-Projekte. Echte produktionsreife KI- und ERP-Systeme — in Wochen ausgeliefert.' },
  'about.cult3.h': { en: 'Enterprise-Grade by Default', vn: 'Chuẩn doanh nghiệp mặc định', ph: 'Enterprise-Grade by Default', de: 'Enterprise-Grade als Standard' },
  'about.cult3.p': { en: 'Security, scalability, and compliance baked in. We build for procurement teams, not just dev teams.', vn: 'Bảo mật, scale, và compliance sẵn từ đầu. Chúng tôi xây cho procurement, không chỉ cho dev.', ph: 'Built-in ang security, scalability, at compliance. Itinatayo namin para sa procurement teams, hindi lamang dev teams.', de: 'Sicherheit, Skalierbarkeit und Compliance von Anfang an. Wir bauen für Procurement-Teams, nicht nur für Entwickler.' },
  'about.activeIn': { en: 'Active in', vn: 'Hoạt động tại', ph: 'Aktibo sa', de: 'Aktiv in' },
  'about.cta':     { en: 'See Our Work →', vn: 'Xem dự án của chúng tôi →', ph: 'Tingnan ang Aming Trabaho →', de: 'Unsere Arbeit ansehen →' },

  // ─────────── IMPACT ───────────
  'impact.label': { en: 'Our Impact', vn: 'Tác động của chúng tôi', ph: 'Ang Aming Epekto', de: 'Unsere Wirkung' },
  'impact.h2.l1': { en: "Companies we've", vn: 'Những công ty chúng tôi đã', ph: 'Mga kumpanyang aming', de: 'Unternehmen, die wir' },
  'impact.h2.l2': { en: 'transformed',     vn: 'chuyển đổi',             ph: 'nai-transform',     de: 'transformiert haben' },
  'impact.sub':   {
    en: 'From logistics platforms to dental aligner manufacturers — our AI and ERP systems run in production at organisations across Southeast Asia, Europe, and beyond.',
    vn: 'Từ nền tảng logistics đến nhà sản xuất khay niềng răng — hệ thống AI và ERP của chúng tôi đang chạy production tại các tổ chức khắp Đông Nam Á, châu Âu và xa hơn.',
    ph: 'Mula sa logistics platforms hanggang sa dental aligner manufacturers — ang aming AI at ERP systems ay tumatakbo sa production sa mga organisasyon sa Southeast Asia, Europe, at higit pa.',
    de: 'Von Logistik-Plattformen bis zu Herstellern von Zahnschienen — unsere KI- und ERP-Systeme laufen in Produktion bei Organisationen in Südostasien, Europa und darüber hinaus.',
  },
  'impact.cta': { en: 'Work With Us →', vn: 'Hợp tác với chúng tôi →', ph: 'Makipagtulungan sa Amin →', de: 'Mit uns arbeiten →' },

  // ─────────── SERVICES (homepage section) ───────────
  'svc.label': { en: 'Our Services', vn: 'Dịch vụ', ph: 'Mga Serbisyo', de: 'Leistungen' },
  'svc.h2.l1': { en: 'The AI & ERP stack we', vn: 'Stack AI & ERP chúng tôi', ph: 'Ang AI & ERP stack na', de: 'Der KI- & ERP-Stack, den wir' },
  'svc.h2.l2': { en: 'actually ship', vn: 'thực sự ship', ph: 'aktwal na ginagamit', de: 'wirklich ausliefern' },
  'svc.sub':   {
    en: "TechNext engineers work at the frontier of enterprise AI — building systems that most agencies only read about. Here's what we build for clients in production.",
    vn: "Kỹ sư TechNext làm việc ở tuyến đầu của AI doanh nghiệp — xây dựng hệ thống mà hầu hết agency chỉ đọc về nó. Đây là những gì chúng tôi xây cho khách hàng trong production.",
    ph: "Ang mga inhinyero ng TechNext ay nagtatrabaho sa frontier ng enterprise AI — bumubuo ng mga sistema na karamihan sa mga agency ay nababasa lamang. Heto ang ginagawa namin para sa mga kliyente sa production.",
    de: "TechNext-Ingenieure arbeiten an der Spitze der Enterprise-KI — bauen Systeme, über die andere Agenturen nur lesen. Hier ist, was wir für Kunden in Produktion liefern.",
  },
  'svc.cta': { en: 'Start Your Project →', vn: 'Khởi động dự án →', ph: 'Simulan ang Proyekto →', de: 'Projekt starten →' },

  'svc.ai.name': { en: 'AI Agents & Automation', vn: 'AI Agents & Tự động hóa', ph: 'AI Agents & Automation', de: 'KI-Agenten & Automatisierung' },
  'svc.ai.desc': { en: 'Multi-agent systems using LangChain, CrewAI, and Claude — autonomous workflows deployed to real enterprise clients.', vn: 'Hệ thống multi-agent dùng LangChain, CrewAI, và Claude — workflow tự động deploy cho khách doanh nghiệp thực sự.', ph: 'Multi-agent systems gamit ang LangChain, CrewAI, at Claude — autonomous workflows na ipinakalat sa tunay na enterprise clients.', de: 'Multi-Agenten-Systeme mit LangChain, CrewAI und Claude — autonome Workflows, ausgeliefert an echte Enterprise-Kunden.' },

  'svc.rag.name': { en: 'RAG & Knowledge Systems', vn: 'RAG & Hệ thống tri thức', ph: 'RAG & Knowledge Systems', de: 'RAG- & Wissenssysteme' },
  'svc.rag.desc': { en: 'Vector databases, embedding pipelines, and semantic search layers for enterprise knowledge retrieval at scale.', vn: 'Vector database, embedding pipeline, và semantic search cho việc truy xuất tri thức doanh nghiệp ở quy mô lớn.', ph: 'Vector databases, embedding pipelines, at semantic search layers para sa enterprise knowledge retrieval sa scale.', de: 'Vektordatenbanken, Embedding-Pipelines und semantische Suchschichten für Unternehmenswissen im großen Maßstab.' },

  'svc.conv.name': { en: 'Conversational AI', vn: 'Conversational AI', ph: 'Conversational AI', de: 'Konversations-KI' },
  'svc.conv.desc': { en: 'Multilingual AI chatbots for enterprise portals, WhatsApp, and web apps — NLP and real-time response tuning included.', vn: 'Chatbot AI đa ngôn ngữ cho portal doanh nghiệp, WhatsApp, web app — bao gồm NLP và tuning phản hồi real-time.', ph: 'Multilingual AI chatbots para sa enterprise portals, WhatsApp, at web apps — kasama ang NLP at real-time response tuning.', de: 'Mehrsprachige KI-Chatbots für Enterprise-Portale, WhatsApp und Web-Apps — inklusive NLP und Echtzeit-Tuning.' },

  'svc.odoo.name': { en: 'Odoo ERP + AI', vn: 'Odoo ERP + AI', ph: 'Odoo ERP + AI', de: 'Odoo ERP + KI' },
  'svc.odoo.desc': { en: 'AI workflows wired directly into enterprise ERP — bridging business automation and intelligent decisioning in one stack.', vn: 'Workflow AI tích hợp trực tiếp vào ERP doanh nghiệp — kết nối automation và ra quyết định thông minh trong một stack.', ph: 'AI workflows na direktang naka-wire sa enterprise ERP — bumabati sa business automation at intelligent decisioning sa isang stack.', de: 'KI-Workflows direkt ins Unternehmens-ERP integriert — Brücke zwischen Geschäftsautomatisierung und intelligenter Entscheidungsfindung.' },

  'svc.web.name': { en: 'Web & Mobile Apps', vn: 'Web & Mobile App', ph: 'Web & Mobile Apps', de: 'Web- & Mobile-Apps' },
  'svc.web.desc': { en: 'Modern web and mobile applications with scalable architecture — React, Next.js, Kotlin Multiplatform, SwiftUI.', vn: 'Ứng dụng web và mobile hiện đại với kiến trúc scale tốt — React, Next.js, Kotlin Multiplatform, SwiftUI.', ph: 'Modernong web at mobile applications na may scalable architecture — React, Next.js, Kotlin Multiplatform, SwiftUI.', de: 'Moderne Web- und Mobile-Anwendungen mit skalierbarer Architektur — React, Next.js, Kotlin Multiplatform, SwiftUI.' },

  'svc.cyber.name': { en: 'Cybersecurity & Cloud', vn: 'Bảo mật & Cloud', ph: 'Cybersecurity & Cloud', de: 'Cybersicherheit & Cloud' },
  'svc.cyber.desc': { en: 'ISO-aligned security baseline, cloud-native deployments, and infrastructure-as-code for production workloads.', vn: 'Nền tảng bảo mật theo chuẩn ISO, deployment cloud-native, và infrastructure-as-code cho workload production.', ph: 'ISO-aligned security baseline, cloud-native deployments, at infrastructure-as-code para sa production workloads.', de: 'ISO-konforme Sicherheits-Baseline, Cloud-Native-Deployments und Infrastructure-as-Code für produktive Workloads.' },

  // ─────────── WHY TECHNEXT ───────────
  'why.label': { en: 'Why TechNext', vn: 'Vì sao TechNext', ph: 'Bakit TechNext', de: 'Warum TechNext' },
  'why.h2.l1': { en: 'Where ambitious teams', vn: 'Nơi đội ngũ tham vọng', ph: 'Kung saan ang mga ambisyosong koponan', de: 'Wo ambitionierte Teams' },
  'why.h2.l2': { en: 'ship real AI',           vn: 'ship AI thực sự',      ph: 'naghahatid ng tunay na AI',         de: 'echte KI ausliefern' },
  'why.sub':   {
    en: 'Not a job where you maintain legacy systems. Not an agency that prototypes forever. TechNext is where production-grade AI gets built — for companies that need it now.',
    vn: 'Không phải nơi bạn bảo trì legacy. Không phải agency làm prototype mãi. TechNext là nơi AI cấp production được xây — cho các công ty cần nó ngay bây giờ.',
    ph: 'Hindi trabaho kung saan kayo nagmementena ng legacy systems. Hindi ahensiyang puro prototype lamang. Ang TechNext ay kung saan itinatayo ang production-grade AI — para sa mga kumpanyang kailangan ito ngayon.',
    de: 'Kein Job, in dem du Legacy-Systeme pflegst. Keine Agentur, die ewig prototypisiert. TechNext ist der Ort, an dem produktionsreife KI gebaut wird — für Unternehmen, die sie jetzt brauchen.',
  },

  'why.acc.speed.t':  { en: 'Ship in weeks, not quarters', vn: 'Ship trong vài tuần, không phải vài quý', ph: 'Mag-ship sa mga linggo, hindi quarters', de: 'In Wochen liefern, nicht in Quartalen' },
  'why.acc.speed.d':  { en: 'Our delivery cadence is calibrated for production: weekly demos, two-week sprints, and clear KPIs. Most engagements move from kickoff to production in 4–8 weeks.', vn: 'Nhịp delivery của chúng tôi được hiệu chỉnh cho production: demo hàng tuần, sprint 2 tuần, KPI rõ ràng. Hầu hết engagement từ kickoff đến production trong 4–8 tuần.', ph: 'Naka-calibrate para sa production ang aming delivery cadence: weekly demos, two-week sprints, at malinaw na KPI. Karamihan ng engagements ay umiilag sa production sa loob ng 4–8 linggo.', de: 'Unsere Liefer-Kadenz ist für Produktion kalibriert: wöchentliche Demos, Zwei-Wochen-Sprints, klare KPIs. Die meisten Engagements gehen in 4–8 Wochen von Kickoff in Produktion.' },
  'why.acc.ai.t':     { en: 'AI-native by default', vn: 'AI-native mặc định', ph: 'AI-native by default', de: 'Standardmäßig AI-native' },
  'why.acc.ai.d':     { en: 'Every engagement starts with the question "where does AI move the needle?". Claude, LangChain, RAG, vector DBs, and local LLMs are first-class tools, not bolted-on features.', vn: 'Mọi engagement bắt đầu với câu hỏi "AI tạo ra giá trị ở đâu?". Claude, LangChain, RAG, vector DB, và local LLM là công cụ first-class, không phải feature gắn thêm.', ph: 'Bawat engagement ay nagsisimula sa tanong na "saan magdadala ng pagbabago ang AI?". Ang Claude, LangChain, RAG, vector DBs, at local LLMs ay first-class tools, hindi bolted-on features.', de: 'Jedes Engagement beginnt mit der Frage „Wo bewegt KI die Nadel?". Claude, LangChain, RAG, Vektor-DBs und lokale LLMs sind First-Class-Tools, keine nachträglichen Features.' },
  'why.acc.erp.t':    { en: 'ERP that actually fits the business', vn: 'ERP thực sự phù hợp với doanh nghiệp', ph: 'ERP na talagang akma sa negosyo', de: 'ERP, das wirklich zum Geschäft passt' },
  'why.acc.erp.d':    { en: 'As a certified Odoo Ready Partner, we deliver implementations sized for the team that will use them. No 18-month transformations — we ship the v1 in 90 days.', vn: 'Là Odoo Ready Partner được chứng nhận, chúng tôi giao implementation vừa với đội ngũ sẽ dùng. Không có transformation 18 tháng — chúng tôi ship v1 trong 90 ngày.', ph: 'Bilang isang certified Odoo Ready Partner, nag-iimplement kami ayon sa laki ng team na gagamit. Walang 18-buwang transformations — nag-ship kami ng v1 sa loob ng 90 araw.', de: 'Als zertifizierter Odoo Ready Partner liefern wir Implementierungen, die zur Teamgröße passen. Keine 18-Monats-Transformationen — wir liefern v1 in 90 Tagen.' },
  'why.acc.global.t': { en: 'Global delivery from Southeast Asia', vn: 'Delivery toàn cầu từ Đông Nam Á', ph: 'Global delivery mula Southeast Asia', de: 'Globale Auslieferung aus Südostasien' },
  'why.acc.global.d': { en: 'We work with clients in Singapore, Australia, Europe, and the US in English. Time-zone coverage and async-first practices keep delivery moving while clients sleep.', vn: 'Chúng tôi làm việc với khách ở Singapore, Úc, châu Âu, Mỹ bằng tiếng Anh. Coverage múi giờ và practice async-first giúp delivery tiến hành kể cả khi khách ngủ.', ph: 'Nakikipagtulungan kami sa mga kliyente sa Singapore, Australia, Europe, at US sa Ingles. Sinusunod namin ang time-zone coverage at async-first na practices upang patuloy ang delivery kahit natutulog ang kliyente.', de: 'Wir arbeiten mit Kunden in Singapur, Australien, Europa und den USA auf Englisch. Zeitzonenabdeckung und Async-first-Praktiken halten die Auslieferung am Laufen, während Kunden schlafen.' },
  'why.acc.people.t': { en: 'Senior engineers on every project', vn: 'Kỹ sư senior trên mọi dự án', ph: 'Senior engineers sa bawat proyekto', de: 'Senior-Ingenieure in jedem Projekt' },
  'why.acc.people.d': { en: 'No "junior pyramid" staffing. The engineer in your kickoff is the engineer in your demo. Owners code; managers ship; founders show up.', vn: 'Không "kim tự tháp junior". Kỹ sư ở kickoff là kỹ sư ở demo. Chủ code; manager ship; founder có mặt.', ph: 'Walang "junior pyramid" na staffing. Ang inhinyero sa inyong kickoff ay siya ring nasa demo. Mga may-ari ang nag-co-code; mga manager ang nagde-deliver; mga founder ang nagpapakita.', de: 'Keine „Junior-Pyramide". Der Ingenieur in deinem Kickoff ist der Ingenieur in deiner Demo. Eigentümer programmieren; Manager liefern aus; Gründer sind dabei.' },

  'why.panel.title': { en: "What you'll get", vn: 'Bạn sẽ nhận được', ph: 'Ano ang makukuha mo', de: 'Was du bekommst' },
  'why.panel.sub':   { en: 'Real production AI systems for enterprise. No sandbox projects.', vn: 'Hệ thống AI production thực sự cho doanh nghiệp. Không sandbox.', ph: 'Tunay na production AI systems para sa enterprise. Walang sandbox projects.', de: 'Echte produktionsreife KI-Systeme für Unternehmen. Keine Sandbox-Projekte.' },
  'why.feat1.t': { en: 'AI Agents & Orchestration', vn: 'AI Agents & Orchestration', ph: 'AI Agents & Orchestration', de: 'KI-Agenten & Orchestrierung' },
  'why.feat1.d': { en: 'Multi-agent systems on LangChain, CrewAI, and the Claude API — production-deployed.', vn: 'Hệ thống multi-agent trên LangChain, CrewAI, Claude API — deploy production.', ph: 'Multi-agent systems sa LangChain, CrewAI, at Claude API — production-deployed.', de: 'Multi-Agenten-Systeme auf LangChain, CrewAI und der Claude-API — in Produktion.' },
  'why.feat2.t': { en: 'Local LLM Infrastructure', vn: 'Hạ tầng LLM nội bộ', ph: 'Local LLM Infrastructure', de: 'Lokale LLM-Infrastruktur' },
  'why.feat2.d': { en: 'Llama, Mistral, and custom fine-tunes running on enterprise GPU clusters.', vn: 'Llama, Mistral, và fine-tune custom chạy trên GPU cluster doanh nghiệp.', ph: 'Llama, Mistral, at custom fine-tunes na tumatakbo sa enterprise GPU clusters.', de: 'Llama, Mistral und individuelle Fine-Tunes auf Unternehmens-GPU-Clustern.' },
  'why.feat3.t': { en: 'RAG & Knowledge Systems', vn: 'RAG & Hệ thống tri thức', ph: 'RAG & Knowledge Systems', de: 'RAG- & Wissenssysteme' },
  'why.feat3.d': { en: 'Vector databases, semantic search, and enterprise knowledge retrieval at scale.', vn: 'Vector database, semantic search, truy xuất tri thức doanh nghiệp ở scale.', ph: 'Vector databases, semantic search, at enterprise knowledge retrieval sa scale.', de: 'Vektordatenbanken, semantische Suche und Wissensabruf im großen Maßstab.' },
  'why.feat4.t': { en: 'Odoo ERP + AI Integration', vn: 'Tích hợp Odoo ERP + AI', ph: 'Odoo ERP + AI Integration', de: 'Odoo-ERP + KI-Integration' },
  'why.feat4.d': { en: 'AI workflows wired into full ERP deployments for global enterprise clients.', vn: 'Workflow AI tích hợp vào triển khai ERP đầy đủ cho khách doanh nghiệp toàn cầu.', ph: 'AI workflows na naka-wire sa full ERP deployments para sa global enterprise clients.', de: 'KI-Workflows integriert in komplette ERP-Deployments für globale Enterprise-Kunden.' },
  'why.cta': { en: 'Talk to an engineer →', vn: 'Nói chuyện với kỹ sư →', ph: 'Makausap ang isang engineer →', de: 'Mit einem Ingenieur sprechen →' },

  // ─────────── FAQ ───────────
  'faq.label': { en: 'FAQ', vn: 'FAQ', ph: 'FAQ', de: 'FAQ' },
  'faq.h2.l1': { en: 'Questions, briefly', vn: 'Câu hỏi, ngắn gọn', ph: 'Mga Tanong, maikli', de: 'Fragen, kurz' },
  'faq.h2.l2': { en: 'answered',           vn: 'trả lời',           ph: 'sinagot',         de: 'beantwortet' },
  'faq.sub':   { en: "The most common things prospective clients ask. Don't see yours? Send a note via the contact page — we usually reply within one business day.", vn: 'Những điều khách hàng tiềm năng thường hỏi nhất. Không thấy câu của bạn? Gửi note qua trang liên hệ — chúng tôi thường phản hồi trong 1 ngày làm việc.', ph: 'Ang mga pinakakaraniwang itinatanong ng mga prospective client. Hindi nakikita ang sa iyo? Mag-iwan ng mensahe sa contact page — kadalasan ay sumasagot kami sa loob ng isang araw ng negosyo.', de: 'Die häufigsten Fragen potenzieller Kunden. Deine ist nicht dabei? Schreib uns über die Kontaktseite — wir antworten meist innerhalb eines Werktages.' },

  'faq.q1':  { en: 'How fast can you ship a production system?', vn: 'Bao lâu thì bạn ship được hệ thống production?', ph: 'Gaano kabilis kayo makakapag-ship ng production system?', de: 'Wie schnell könnt ihr ein Produktionssystem ausliefern?' },
  'faq.a1':  { en: 'Most engagements move from kickoff to a working v1 in 4–8 weeks. We work in two-week sprints with weekly demos, so you see progress every week, not just at the end.', vn: 'Hầu hết engagement đi từ kickoff đến v1 hoạt động trong 4–8 tuần. Chúng tôi làm sprint 2 tuần với demo hàng tuần, nên bạn thấy tiến độ mỗi tuần, không phải chỉ ở cuối.', ph: 'Karamihan ng engagements ay umuusad mula kickoff papuntang working v1 sa loob ng 4–8 linggo. Nagtatrabaho kami sa two-week sprints na may weekly demos, kaya nakikita mo ang progress kada linggo, hindi lamang sa huli.', de: 'Die meisten Engagements gehen in 4–8 Wochen von Kickoff zu einem funktionierenden v1. Wir arbeiten in Zwei-Wochen-Sprints mit wöchentlichen Demos, damit du jede Woche Fortschritt siehst.' },
  'faq.q2':  { en: 'Do you build with proprietary or open-source AI?', vn: 'Bạn dùng AI proprietary hay open-source?', ph: 'Gumagamit ba kayo ng proprietary o open-source AI?', de: 'Baut ihr mit proprietärer oder Open-Source-KI?' },
  'faq.a2':  { en: 'Both, depending on the use case. We default to Claude for reasoning-heavy work, but we also run Llama, Mistral, and custom fine-tunes on private GPU infrastructure when data residency or cost matters.', vn: 'Cả hai, tuỳ use case. Mặc định dùng Claude cho task reasoning nặng, nhưng cũng chạy Llama, Mistral, và fine-tune custom trên GPU private khi data residency hoặc cost quan trọng.', ph: 'Pareho, depende sa use case. Default kami sa Claude para sa reasoning-heavy na trabaho, ngunit nagpapatakbo rin kami ng Llama, Mistral, at custom fine-tunes sa private GPU infrastructure kapag mahalaga ang data residency o cost.', de: 'Beides, je nach Anwendungsfall. Standardmäßig nutzen wir Claude für reasoning-intensive Arbeit, lassen aber auch Llama, Mistral und individuelle Fine-Tunes auf privater GPU-Infrastruktur laufen, wenn Datenresidenz oder Kosten relevant sind.' },
  'faq.q3':  { en: 'Can you integrate AI into our existing ERP?', vn: 'Bạn có tích hợp AI vào ERP hiện có không?', ph: 'Maaari ba ninyong i-integrate ang AI sa aming existing ERP?', de: 'Könnt ihr KI in unser bestehendes ERP integrieren?' },
  'faq.a3':  { en: 'Yes — we are a certified Odoo Ready Partner and have shipped AI-augmented ERP for clients in logistics, manufacturing, and healthcare. We also integrate with SAP, NetSuite, and bespoke systems via API.', vn: 'Có — chúng tôi là Odoo Ready Partner và đã ship ERP có AI cho khách trong logistics, sản xuất, y tế. Cũng tích hợp với SAP, NetSuite, và hệ thống custom qua API.', ph: 'Oo — sertipikado kaming Odoo Ready Partner at naghatid na ng AI-augmented ERP para sa mga kliyente sa logistics, manufacturing, at healthcare. Nag-iintegrate din kami sa SAP, NetSuite, at custom systems sa pamamagitan ng API.', de: 'Ja — wir sind zertifizierter Odoo Ready Partner und haben KI-erweiterte ERP für Kunden in Logistik, Fertigung und Gesundheitswesen ausgeliefert. Auch SAP, NetSuite und individuelle Systeme integrieren wir per API.' },
  'faq.q4':  { en: 'Where are you based and what time zones do you cover?', vn: 'Bạn ở đâu và cover múi giờ nào?', ph: 'Saan kayo nakabase at anong time zones ang sinasaklaw ninyo?', de: 'Wo sitzt ihr und welche Zeitzonen deckt ihr ab?' },
  'faq.a4':  { en: 'TechNext is headquartered in Singapore with a development hub in Vietnam. We cover APAC, Europe, and US time zones via async-first delivery practices.', vn: 'TechNext có trụ sở chính tại Singapore với dev hub ở Việt Nam. Chúng tôi cover APAC, châu Âu, và Mỹ qua practice async-first.', ph: 'Ang TechNext ay nakahimpilan sa Singapore na may development hub sa Vietnam. Sinasaklaw namin ang APAC, Europe, at US time zones sa pamamagitan ng async-first delivery.', de: 'TechNext hat den Hauptsitz in Singapur und einen Entwicklungs-Hub in Vietnam. Wir decken APAC, Europa und US-Zeitzonen mit Async-first-Praktiken ab.' },
  'faq.q5':  { en: 'How do you handle data privacy and compliance?', vn: 'Bạn xử lý privacy và compliance dữ liệu thế nào?', ph: 'Paano ninyo hinahawakan ang data privacy at compliance?', de: 'Wie geht ihr mit Datenschutz und Compliance um?' },
  'faq.a5':  { en: 'We default to private cloud, EU/SG data residency, and customer-controlled keys. We can deploy on-prem or in your VPC when procurement requires it.', vn: 'Mặc định private cloud, data residency ở EU/SG, key do khách quản lý. Có thể deploy on-prem hoặc trong VPC của bạn khi procurement yêu cầu.', ph: 'Default kami sa private cloud, EU/SG data residency, at customer-controlled keys. Maaari kaming mag-deploy on-prem o sa inyong VPC kapag kinakailangan ng procurement.', de: 'Standardmäßig nutzen wir Private Cloud, EU/SG-Datenresidenz und kundenseitig kontrollierte Schlüssel. Wir können on-prem oder in deinem VPC ausliefern, wenn das Procurement es verlangt.' },
  'faq.q6':  { en: 'What does a typical engagement cost?', vn: 'Chi phí một engagement điển hình là bao nhiêu?', ph: 'Magkano ang gastos ng tipikal na engagement?', de: 'Was kostet ein typisches Engagement?' },
  'faq.a6':  { en: 'It depends on scope, but most production AI engagements start at USD 25K for a focused v1 and scale from there. We give a fixed quote after a 30-minute discovery call.', vn: 'Tuỳ scope, nhưng hầu hết engagement AI production bắt đầu từ 25K USD cho v1 tập trung và scale lên từ đó. Chúng tôi báo giá cố định sau 30 phút discovery call.', ph: 'Depende sa scope, ngunit karamihan ng production AI engagements ay nagsisimula sa USD 25K para sa nakatuong v1 at lumalaki mula doon. Nagbibigay kami ng fixed quote pagkatapos ng 30-minuto na discovery call.', de: 'Es hängt vom Umfang ab, aber die meisten produktiven KI-Engagements starten bei USD 25K für ein fokussiertes v1 und skalieren von dort. Nach einem 30-minütigen Discovery-Call geben wir ein Festpreisangebot.' },

  // ─────────── FOOTER ───────────
  'footer.cta.label': { en: 'Ready when you are', vn: 'Sẵn sàng khi bạn cần', ph: 'Handa kapag handa ka na', de: 'Bereit, wenn du es bist' },
  'footer.cta.title.l1': { en: "Let's build your", vn: 'Hãy xây dựng', ph: "Bumuo tayo ng inyong", de: 'Bauen wir deinen' },
  'footer.cta.title.l2': { en: 'AI advantage',     vn: 'lợi thế AI',  ph: 'AI advantage',         de: 'KI-Vorteil' },
  'footer.cta.desc':  { en: '30-minute discovery call · fixed quote within 48 hours · v1 in production within 4–8 weeks.', vn: 'Discovery call 30 phút · báo giá cố định trong 48 giờ · v1 production trong 4–8 tuần.', ph: '30-minutong discovery call · fixed quote sa loob ng 48 oras · v1 sa production sa loob ng 4–8 linggo.', de: '30-minütiger Discovery-Call · Festpreis innerhalb von 48 Stunden · v1 in 4–8 Wochen in Produktion.' },
  'footer.cta.btn':   { en: 'Start Your Project →', vn: 'Khởi động dự án →', ph: 'Simulan ang Proyekto →', de: 'Projekt starten →' },
  'footer.tagline':   { en: 'TechNext is an AI-native company building production-grade enterprise intelligence for ambitious teams across Southeast Asia and beyond.', vn: 'TechNext là công ty AI-native xây dựng hệ thống doanh nghiệp thông minh cấp production cho các đội ngũ tham vọng khắp Đông Nam Á và xa hơn.', ph: 'Ang TechNext ay isang AI-native na kumpanyang bumubuo ng production-grade enterprise intelligence para sa mga ambisyosong koponan sa Southeast Asia at higit pa.', de: 'TechNext ist ein AI-natives Unternehmen, das produktionsreife Enterprise-Intelligence für ambitionierte Teams in Südostasien und darüber hinaus baut.' },
  'footer.col.services': { en: 'Services', vn: 'Dịch vụ',  ph: 'Mga Serbisyo', de: 'Leistungen' },
  'footer.col.company':  { en: 'Company',  vn: 'Công ty',  ph: 'Kumpanya',     de: 'Unternehmen' },
  'footer.col.legal':    { en: 'Legal',    vn: 'Pháp lý',  ph: 'Legal',        de: 'Rechtliches' },
  'footer.col.newsletter.h': { en: 'Stay in the loop', vn: 'Đăng ký nhận tin', ph: 'Manatiling updated', de: 'Auf dem Laufenden bleiben' },
  'footer.col.newsletter.d': { en: 'Quarterly notes on AI engineering, Odoo, and the SEA delivery scene.', vn: 'Bản tin hàng quý về AI engineering, Odoo, và delivery scene Đông Nam Á.', ph: 'Quarterly notes tungkol sa AI engineering, Odoo, at SEA delivery scene.', de: 'Vierteljährliche Notizen zu KI-Engineering, Odoo und der SEA-Delivery-Szene.' },
  'footer.newsletter.placeholder': { en: 'you@company.com', vn: 'ban@congty.com', ph: 'ikaw@kumpanya.com', de: 'du@firma.de' },
  'footer.bottom.copyright': { en: '© {{year}} TECHNEXT PTE LTD (UEN: 202699888G) · Singapore.', vn: '© {{year}} TECHNEXT PTE LTD (UEN: 202699888G) · Singapore.', ph: '© {{year}} TECHNEXT PTE LTD (UEN: 202699888G) · Singapore.', de: '© {{year}} TECHNEXT PTE LTD (UEN: 202699888G) · Singapur.' },
  'footer.bottom.disclaimer': { en: 'All product and company names are trademarks of their respective holders.', vn: 'Tất cả tên sản phẩm và công ty là nhãn hiệu thương mại của chủ sở hữu.', ph: 'Lahat ng product at company names ay trademarks ng kanilang respective holders.', de: 'Alle Produkt- und Firmennamen sind Marken ihrer jeweiligen Inhaber.' },

  'footer.link.aiAgents':   { en: 'AI Agents',         vn: 'AI Agents',           ph: 'AI Agents',           de: 'KI-Agenten' },
  'footer.link.rag':        { en: 'RAG & Knowledge',   vn: 'RAG & Tri thức',      ph: 'RAG & Knowledge',     de: 'RAG & Wissen' },
  'footer.link.conv':       { en: 'Conversational AI', vn: 'Conversational AI',   ph: 'Conversational AI',   de: 'Konversations-KI' },
  'footer.link.odoo':       { en: 'Odoo ERP + AI',     vn: 'Odoo ERP + AI',       ph: 'Odoo ERP + AI',       de: 'Odoo ERP + KI' },
  'footer.link.web':        { en: 'Web & Mobile',      vn: 'Web & Mobile',        ph: 'Web & Mobile',        de: 'Web & Mobile' },
  'footer.link.about':      { en: 'About us',          vn: 'Về chúng tôi',        ph: 'Tungkol sa amin',     de: 'Über uns' },
  'footer.link.blog':       { en: 'Blog',              vn: 'Blog',                ph: 'Blog',                de: 'Blog' },
  'footer.link.contact':    { en: 'Contact',           vn: 'Liên hệ',             ph: 'Kontak',              de: 'Kontakt' },
  'footer.link.partnership':{ en: 'Partnership',       vn: 'Đối tác',             ph: 'Partnership',         de: 'Partnerschaft' },
  'footer.link.terms':      { en: 'Terms of Use',      vn: 'Điều khoản',          ph: 'Mga Tuntunin',        de: 'Nutzungsbedingungen' },
  'footer.link.privacy':    { en: 'Privacy',           vn: 'Quyền riêng tư',      ph: 'Pagkapribado',        de: 'Datenschutz' },
  'footer.link.cookies':    { en: 'Cookies',           vn: 'Cookies',             ph: 'Cookies',             de: 'Cookies' },
  'footer.link.a11y':       { en: 'Accessibility',     vn: 'Trợ năng',            ph: 'Accessibility',       de: 'Barrierefreiheit' },
  'footer.link.ai':         { en: 'Responsible AI',    vn: 'AI có trách nhiệm',   ph: 'Responsible AI',      de: 'Verantwortungsvolle KI' },

  // ─────────── BOOKING MODAL ───────────
  'booking.brand':    { en: '✦ TechNext', vn: '✦ TechNext', ph: '✦ TechNext', de: '✦ TechNext' },
  'booking.close':    { en: 'Close', vn: 'Đóng', ph: 'Isara', de: 'Schließen' },
  'booking.s1.h':     { en: 'What can we help with?', vn: 'Chúng tôi giúp gì được cho bạn?', ph: 'Saan kayo namin matutulungan?', de: 'Wobei können wir helfen?' },
  'booking.s1.sub':   { en: "Pick the service you're interested in", vn: 'Chọn dịch vụ bạn quan tâm', ph: 'Pumili ng serbisyong interesado ka', de: 'Wähle die gewünschte Leistung' },
  'booking.s2.h':     { en: 'Your details', vn: 'Thông tin của bạn', ph: 'Inyong mga detalye', de: 'Deine Daten' },
  'booking.s2.sub':   { en: "We'll send a calendar invite once you pick a slot", vn: 'Chúng tôi gửi calendar invite sau khi bạn chọn slot', ph: 'Padadalhan namin kayo ng calendar invite kapag pumili na kayo ng slot', de: 'Wir senden eine Kalendereinladung, sobald du einen Slot wählst' },
  'booking.s3.h':     { en: 'Pick a time', vn: 'Chọn thời gian', ph: 'Pumili ng oras', de: 'Zeit auswählen' },
  'booking.s3.sub':   { en: '1 hour · Asia / Singapore (UTC+8)', vn: '1 giờ · Asia / Singapore (UTC+8)', ph: '1 oras · Asia / Singapore (UTC+8)', de: '1 Stunde · Asien / Singapur (UTC+8)' },
  'booking.s3.times': { en: 'Available times', vn: 'Khung giờ trống', ph: 'Mga magagamit na oras', de: 'Verfügbare Zeiten' },
  'booking.s4.h':     { en: "You're booked!", vn: 'Đã đặt lịch!', ph: 'Naka-book na!', de: 'Termin gebucht!' },
  'booking.s4.sub':   { en: 'We received your request. Nathan will send a calendar invite to', vn: 'Đã nhận yêu cầu. Nathan sẽ gửi calendar invite tới', ph: 'Natanggap na namin ang inyong request. Magpapadala si Nathan ng calendar invite sa', de: 'Anfrage erhalten. Nathan sendet eine Kalendereinladung an' },
  'booking.s4.sub2':  { en: 'shortly.', vn: 'sớm thôi.', ph: 'sa lalong madaling panahon.', de: 'in Kürze.' },
  'booking.s4.svc':   { en: 'Service', vn: 'Dịch vụ', ph: 'Serbisyo', de: 'Leistung' },
  'booking.s4.when':  { en: 'When',    vn: 'Khi nào',  ph: 'Kailan',   de: 'Wann' },
  'booking.wa':       { en: 'Message us on WhatsApp', vn: 'Nhắn qua WhatsApp', ph: 'Mag-mensahe sa WhatsApp', de: 'Schreib uns auf WhatsApp' },
  'booking.continue': { en: 'Continue →', vn: 'Tiếp tục →', ph: 'Magpatuloy →', de: 'Weiter →' },
  'booking.back':     { en: '← Back', vn: '← Quay lại', ph: '← Bumalik', de: '← Zurück' },
  'booking.confirm':  { en: 'Confirm Booking →', vn: 'Xác nhận đặt lịch →', ph: 'Kumpirmahin ang Booking →', de: 'Buchung bestätigen →' },
  'booking.sending':  { en: 'Sending…', vn: 'Đang gửi…', ph: 'Pinapadala…', de: 'Wird gesendet…' },

  'booking.svc.ai.name':   { en: 'AI Agents & Automation', vn: 'AI Agents & Tự động hóa', ph: 'AI Agents & Automation', de: 'KI-Agenten & Automatisierung' },
  'booking.svc.ai.desc':   { en: 'AI agents, chatbots, RAG, local LLMs', vn: 'AI agent, chatbot, RAG, local LLM', ph: 'AI agents, chatbots, RAG, local LLMs', de: 'KI-Agenten, Chatbots, RAG, lokale LLMs' },
  'booking.svc.odoo.name': { en: 'Odoo ERP Implementation', vn: 'Triển khai Odoo ERP', ph: 'Odoo ERP Implementation', de: 'Odoo-ERP-Implementierung' },
  'booking.svc.odoo.desc': { en: 'End-to-end ERP for business operations', vn: 'ERP end-to-end cho vận hành doanh nghiệp', ph: 'End-to-end ERP para sa operasyong pangnegosyo', de: 'End-to-End-ERP für Geschäftsabläufe' },
  'booking.svc.both.name': { en: 'Both — Full Package', vn: 'Cả hai — Trọn gói', ph: 'Pareho — Buong Package', de: 'Beides — Komplettpaket' },
  'booking.svc.both.desc': { en: 'Complete transformation: AI + ERP', vn: 'Chuyển đổi toàn diện: AI + ERP', ph: 'Kumpletong transformation: AI + ERP', de: 'Komplette Transformation: KI + ERP' },

  'booking.field.name':      { en: 'Full name *',  vn: 'Họ tên *',       ph: 'Buong pangalan *',  de: 'Vollständiger Name *' },
  'booking.field.email':     { en: 'Email address *', vn: 'Email *',     ph: 'Email address *',  de: 'E-Mail-Adresse *' },
  'booking.field.phone':     { en: 'Phone / WhatsApp', vn: 'SĐT / WhatsApp', ph: 'Phone / WhatsApp', de: 'Telefon / WhatsApp' },
  'booking.field.company':   { en: 'Company name',  vn: 'Tên công ty',  ph: 'Pangalan ng kumpanya', de: 'Firmenname' },
  'booking.field.challenge': { en: "What's your biggest challenge right now? (optional)", vn: 'Thách thức lớn nhất hiện tại của bạn? (tuỳ chọn)', ph: 'Ano ang pinakamalaking hamon ninyo ngayon? (opsyonal)', de: 'Was ist deine größte Herausforderung gerade? (optional)' },

  // ─────────── CAREERS ───────────
  'careers.label': { en: 'Careers', vn: 'Tuyển dụng', ph: 'Mga Trabaho', de: 'Karriere' },
  'careers.h1.l1': { en: 'Build AI that runs', vn: 'Xây dựng AI chạy', ph: 'Bumuo ng AI na tumatakbo', de: 'Baue KI, die läuft' },
  'careers.h1.l2': { en: 'in production.',     vn: 'trong production.', ph: 'sa production.',         de: 'in Produktion.' },
  'careers.sub':   { en: "TechNext is assembling elite engineering teams across Vietnam, Philippines, and Singapore to build enterprise AI for global clients. Remote-friendly, English-first, and growing fast.", vn: 'TechNext đang tập hợp đội ngũ kỹ sư xuất sắc tại Việt Nam, Philippines, và Singapore để xây dựng AI doanh nghiệp cho khách hàng toàn cầu. Remote-friendly, English-first, và phát triển nhanh.', ph: 'Ang TechNext ay tinitipon ang elite engineering teams sa Vietnam, Philippines, at Singapore upang bumuo ng enterprise AI para sa mga global na kliyente. Remote-friendly, English-first, at mabilis na lumalago.', de: 'TechNext stellt erstklassige Engineering-Teams in Vietnam, den Philippinen und Singapur zusammen, um Enterprise-KI für globale Kunden zu bauen. Remote-freundlich, englischsprachig und schnell wachsend.' },
  'careers.country.all': { en: 'All Countries', vn: 'Tất cả',     ph: 'Lahat ng Bansa', de: 'Alle Länder' },
  'careers.country.vn':  { en: 'Vietnam',       vn: 'Việt Nam',   ph: 'Vietnam',        de: 'Vietnam' },
  'careers.country.ph':  { en: 'Philippines',   vn: 'Philippines',ph: 'Pilipinas',      de: 'Philippinen' },
  'careers.country.sg':  { en: 'Singapore',     vn: 'Singapore',  ph: 'Singapore',      de: 'Singapur' },
  'careers.dept.all':         { en: 'All Roles',       vn: 'Tất cả vị trí',   ph: 'Lahat ng Roles',    de: 'Alle Rollen' },
  'careers.dept.engineering': { en: 'Engineering',     vn: 'Kỹ thuật',         ph: 'Engineering',       de: 'Engineering' },
  'careers.dept.ai':           { en: 'AI Systems',     vn: 'AI Systems',       ph: 'AI Systems',        de: 'KI-Systeme' },
  'careers.dept.infra':        { en: 'Infrastructure', vn: 'Hạ tầng',          ph: 'Infrastructure',    de: 'Infrastruktur' },
  'careers.dept.leadership':   { en: 'Leadership',     vn: 'Lãnh đạo',         ph: 'Leadership',        de: 'Führung' },
  'careers.dept.quality':      { en: 'Quality',        vn: 'Chất lượng',       ph: 'Quality',           de: 'Qualität' },
  'careers.dept.finance':      { en: 'Finance',        vn: 'Tài chính',        ph: 'Finance',           de: 'Finanzen' },
  'careers.dept.erp':          { en: 'ERP',            vn: 'ERP',              ph: 'ERP',               de: 'ERP' },
  'careers.dept.sales':        { en: 'Sales',          vn: 'Bán hàng',         ph: 'Sales',             de: 'Vertrieb' },
  'careers.dept.cs':           { en: 'Client Success', vn: 'Khách hàng',       ph: 'Client Success',    de: 'Kundenerfolg' },
  'careers.dept.mgmt':         { en: 'Management',     vn: 'Quản lý',          ph: 'Pamamahala',        de: 'Management' },
  'careers.empty':   { en: 'No roles match this filter — try a different country or department.', vn: 'Không có vị trí nào khớp — thử filter khác.', ph: 'Walang roles na tumutugma — subukan ang ibang country o department.', de: 'Keine passenden Rollen — versuche ein anderes Land oder eine andere Abteilung.' },
  'careers.cta.label': { en: 'Not seeing your role?', vn: 'Không thấy vị trí của bạn?', ph: 'Hindi nakikita ang inyong role?', de: 'Deine Rolle ist nicht dabei?' },
  'careers.cta.title.l1': { en: "We're always", vn: 'Chúng tôi luôn', ph: 'Lagi kaming', de: 'Wir sind immer' },
  'careers.cta.title.l2': { en: 'talking to',   vn: 'trò chuyện với', ph: 'nakikipag-usap sa', de: 'im Gespräch mit' },
  'careers.cta.title.l3': { en: 'strong engineers.', vn: 'kỹ sư giỏi.', ph: 'mga mahuhusay na inhinyero.', de: 'starken Ingenieuren.' },
  'careers.cta.sub':  { en: "If you're senior and shipping production AI, send us a note. Worst case we file you for the next opening.", vn: 'Nếu bạn senior và đang ship AI production, gửi note cho chúng tôi. Tệ nhất là chúng tôi lưu cho lần mở tới.', ph: 'Kung senior ka at nag-shi-ship ng production AI, padalhan kami ng mensahe. Worst case, ifa-file ka namin para sa susunod na bukas na posisyon.', de: 'Wenn du Senior bist und produktive KI ausläufst, schick uns eine Nachricht. Im schlimmsten Fall legen wir dich für die nächste Öffnung ab.' },
  'careers.cta.btn':  { en: 'Send your CV →', vn: 'Gửi CV →', ph: 'Ipadala ang CV →', de: 'CV senden →' },

  // ─────────── JOB DETAIL ───────────
  'job.back':       { en: '← All roles', vn: '← Tất cả vị trí', ph: '← Lahat ng roles', de: '← Alle Rollen' },
  'job.remote':     { en: 'Remote-friendly', vn: 'Remote-friendly', ph: 'Remote-friendly', de: 'Remote-freundlich' },
  'job.english':    { en: 'English-first',   vn: 'Tiếng Anh là chính', ph: 'English-first',    de: 'Englisch zuerst' },
  'job.section.about': { en: 'About the role', vn: 'Về vị trí', ph: 'Tungkol sa role', de: 'Über die Rolle' },
  'job.section.must':  { en: "What we're looking for", vn: 'Yêu cầu', ph: 'Ano ang aming hinahanap', de: 'Was wir suchen' },
  'job.apply.label': { en: 'Apply', vn: 'Ứng tuyển', ph: 'Mag-apply', de: 'Bewerben' },
  'job.apply.h':     { en: 'Send us your CV', vn: 'Gửi CV cho chúng tôi', ph: 'Ipadala ang inyong CV', de: 'Sende uns deinen CV' },
  'job.apply.sub':   { en: "Replies usually go out within 2 business days. Skip the cover letter — a clear CV and 2–3 lines on why you're interested is enough.", vn: 'Phản hồi thường trong 2 ngày làm việc. Không cần cover letter — CV rõ ràng + 2-3 dòng lý do quan tâm là đủ.', ph: 'Karaniwang nagre-reply kami sa loob ng 2 araw ng negosyo. Laktawan ang cover letter — sapat na ang malinaw na CV at 2–3 linyang dahilan kung bakit interesado kayo.', de: 'Antworten gehen meist innerhalb von 2 Werktagen raus. Spar dir das Anschreiben — ein klarer CV und 2–3 Zeilen, warum du interessiert bist, reichen.' },
  'job.apply.btn':   { en: 'Apply by email →', vn: 'Ứng tuyển qua email →', ph: 'Mag-apply sa email →', de: 'Per E-Mail bewerben →' },
  'job.apply.or':    { en: 'or', vn: 'hoặc', ph: 'o', de: 'oder' },
  'job.apply.wa':    { en: 'Message on WhatsApp', vn: 'Nhắn WhatsApp', ph: 'Mag-mensahe sa WhatsApp', de: 'Auf WhatsApp schreiben' },

  // ─────────── GALLERY ───────────
  'gallery.label': { en: 'Gallery', vn: 'Thư viện', ph: 'Galerya', de: 'Galerie' },
  'gallery.h1.l1': { en: 'Inside',    vn: 'Bên trong', ph: 'Sa loob ng', de: 'Hinter den Kulissen von' },
  'gallery.h1.l2': { en: 'TechNext.', vn: 'TechNext.', ph: 'TechNext.',  de: 'TechNext.' },
  'gallery.sub':   { en: 'A snapshot of the team, the work, and the energy behind the AI systems we ship to clients across Southeast Asia and beyond.', vn: 'Một góc nhìn về đội ngũ, công việc, và năng lượng đằng sau các hệ thống AI chúng tôi ship cho khách khắp Đông Nam Á và xa hơn.', ph: 'Isang snapshot ng koponan, trabaho, at enerhiya sa likod ng AI systems na inihahatid namin sa mga kliyente sa Southeast Asia at higit pa.', de: 'Ein Blick auf das Team, die Arbeit und die Energie hinter den KI-Systemen, die wir an Kunden in Südostasien und darüber hinaus ausliefern.' },
}

export function translate(key, lang) {
  const entry = DICT[key]
  if (!entry) return key
  return entry[lang] || entry.en || key
}
