import LegalPage from '../../../src/pages/LegalPage'

export { Page }

function Page() {
  return (
    <LegalPage title="Accessibility Statement" lastUpdated="March 1, 2026">
      <h2>Our Commitment</h2>
      <p>
        Tech Next Solutions is committed to ensuring that our digital services are accessible to everyone, including
        people with disabilities. We strive to meet or exceed the requirements of the Web Content Accessibility
        Guidelines (WCAG) 2.1 at the AA level.
      </p>

      <h2>Accessibility Features</h2>
      <p>Our website includes the following accessibility features:</p>
      <ul>
        <li><strong>Keyboard Navigation:</strong> All interactive elements can be accessed and operated using a keyboard alone.</li>
        <li><strong>Skip Navigation:</strong> A "Skip to main content" link is available at the top of every page to help keyboard users bypass repetitive navigation links.</li>
        <li><strong>Semantic HTML:</strong> We use proper HTML5 semantic elements to ensure our content is well-structured and meaningful to assistive technologies.</li>
        <li><strong>ARIA Labels:</strong> Interactive elements include appropriate ARIA attributes to provide context for screen readers.</li>
        <li><strong>Color Contrast:</strong> We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text, as recommended by WCAG 2.1 AA.</li>
        <li><strong>Alt Text:</strong> Images include descriptive alternative text to convey information to users who cannot see them.</li>
        <li><strong>Responsive Design:</strong> Our website is designed to work across various devices and screen sizes, supporting text resizing up to 200% without loss of content or functionality.</li>
        <li><strong>Reduced Motion:</strong> We respect the "prefers-reduced-motion" setting in the user's operating system, reducing or eliminating animations for users who are sensitive to motion.</li>
      </ul>

      <h2>Conformance Status</h2>
      <p>
        We are continually improving the accessibility of our digital experiences. While we strive for WCAG 2.1 AA
        conformance, some areas of our website may not yet meet all accessibility standards. We are aware of these
        limitations and are actively working to address them.
      </p>

      <h2>Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or
        have suggestions for improvement, please let us know:
      </p>
      <ul>
        <li>Email: <a href="mailto:accessibility@technext.asia">accessibility@technext.asia</a></li>
        <li>Phone: +65 8427 2549</li>
      </ul>
      <p>
        We aim to respond to accessibility feedback within 5 business days and to resolve issues within 30 business days.
      </p>

      <h2>Assistive Technology Compatibility</h2>
      <p>Our website is designed to be compatible with the following assistive technologies:</p>
      <ul>
        <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
        <li>Screen magnification software</li>
        <li>Speech recognition software (Dragon NaturallySpeaking)</li>
        <li>Operating system accessibility features (high contrast mode, text scaling)</li>
      </ul>

      <h2>Assessment and Remediation</h2>
      <p>
        We regularly assess our website for accessibility compliance through a combination of automated tools and manual
        testing. We are committed to making improvements as web accessibility standards and best practices evolve.
      </p>
    </LegalPage>
  )
}
