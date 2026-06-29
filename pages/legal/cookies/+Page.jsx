import LegalPage from '../../../src/pages/LegalPage'

export { Page }

function Page() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="March 1, 2026">
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files that are placed on your device when you visit a website. They are widely used to
        make websites work more efficiently, provide information to website owners, and improve the user experience.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>Tech Next Solutions uses cookies and similar technologies for several purposes:</p>

      <h3>Essential Cookies</h3>
      <p>
        These cookies are necessary for the website to function properly. They enable basic functions like page navigation
        and access to secure areas of the website. The website cannot function properly without these cookies.
      </p>

      <h3>Performance Cookies</h3>
      <p>
        These cookies help us understand how visitors interact with our website by collecting and reporting information
        anonymously. This helps us improve the way our website works.
      </p>

      <h3>Functional Cookies</h3>
      <p>
        These cookies enable enhanced functionality and personalization, such as remembering your preferences (e.g., language,
        theme settings). If you do not allow these cookies, some features may not function properly.
      </p>

      <h3>Marketing Cookies</h3>
      <p>
        These cookies may be set through our site by our advertising partners. They may be used by those companies to build
        a profile of your interests and show you relevant advertisements on other sites.
      </p>

      <h2>3. Types of Cookies We Use</h2>
      <p>The following table explains the cookies we use and why:</p>
      <ul>
        <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser. Used to maintain your session as you navigate the site.</li>
        <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them. Used to remember your preferences and settings.</li>
        <li><strong>First-Party Cookies:</strong> Set by TechNext. Used for site functionality and analytics.</li>
        <li><strong>Third-Party Cookies:</strong> Set by third-party services (e.g., Google Analytics, LinkedIn). Used for analytics and marketing purposes.</li>
      </ul>

      <h2>4. Managing Your Cookie Preferences</h2>
      <p>
        You can control and manage cookies in several ways. Please keep in mind that removing or blocking cookies can
        affect your user experience and parts of our website may no longer be fully accessible.
      </p>
      <ul>
        <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies, delete cookies, and set preferences for specific websites. Check your browser's help documentation for instructions.</li>
        <li><strong>Cookie Settings:</strong> Use our cookie consent tool (available at the bottom of every page) to manage your preferences for non-essential cookies.</li>
        <li><strong>Opt-Out Links:</strong> For third-party advertising cookies, you can opt out through the Digital Advertising Alliance (DAA), the Network Advertising Initiative (NAI), or the European Interactive Digital Advertising Alliance (EDAA).</li>
      </ul>

      <h2>5. Changes to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data
        practices. Any changes will be posted on this page with an updated "Last Updated" date.
      </p>

      <h2>6. Contact Us</h2>
      <p>If you have any questions about our use of cookies, please contact us:</p>
      <p>
        <strong>Tech Next Solutions Pte Ltd.</strong><br />
        Email: <a href="mailto:privacy@technext.asia">privacy@technext.asia</a>
      </p>
    </LegalPage>
  )
}
