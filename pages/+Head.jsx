export default function Head() {
    return (
        <>
            {/* Favicon */}
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="apple-touch-icon" href="/favicon.svg" />

            {/* Preconnect */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

            {/* Google Fonts — DM Sans (body) + Montserrat (heading) + Caveat (handwriting accent) */}
            <link
                href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap"
                rel="stylesheet"
            />

            {/* Preload hero image for faster LCP */}
            <link rel="preload" as="image" href="/hero-slide-1.png" />

            {/* Theme Color — cream BG */}
            <meta name="theme-color" content="#F0ECE3" />
            <meta name="msapplication-TileColor" content="#F0ECE3" />

            {/* Structured Data - Organization */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Tech Next Solutions",
                "url": "https://technext.asia",
                "logo": "https://technext.asia/favicon.svg",
                "description": "Your Reliable Technology Partner in Southeast Asia.",
                "foundingDate": "2018",
                "contactPoint": [
                    { "@type": "ContactPoint", "telephone": "+65-8427-2549", "contactType": "sales", "areaServed": "SG" },
                    { "@type": "ContactPoint", "telephone": "+84-792-030-623", "contactType": "sales", "areaServed": "VN" },
                    { "@type": "ContactPoint", "telephone": "+61-2-9234-5288", "contactType": "sales", "areaServed": "AU" },
                ],
                "address": { "@type": "PostalAddress", "streetAddress": "261 Waterloo Street #03-32", "addressLocality": "Singapore", "postalCode": "180261", "addressCountry": "SG" },
                "sameAs": ["https://www.linkedin.com/company/technextsolutions", "https://github.com/technextsolutions"]
            })}} />

            {/* Structured Data - WebSite */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Tech Next Solutions",
                "url": "https://technext.asia",
                "potentialAction": { "@type": "SearchAction", "target": "https://technext.asia/?s={search_term_string}", "query-input": "required name=search_term_string" }
            })}} />

            {/* GA4 - Consent Mode v2 */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-3X7ZW8QRKW" />
            <script dangerouslySetInnerHTML={{ __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', { 'analytics_storage': 'denied', 'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied', 'wait_for_update': 500 });
                gtag('js', new Date());
                gtag('config', 'G-3X7ZW8QRKW');
            `}} />
        </>
    )
}
