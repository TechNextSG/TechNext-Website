import LegalPage from '../../../src/pages/LegalPage'

export { Page }

function Page() {
  return (
    <LegalPage title="Responsible AI Policy" lastUpdated="March 1, 2026">
      <h2>Our Approach to AI</h2>
      <p>
        At Tech Next Solutions, artificial intelligence is at the heart of many of our products and services. We believe
        that AI has the potential to transform businesses and improve lives. With this potential comes a responsibility
        to develop and deploy AI technologies thoughtfully and ethically. This Responsible AI Policy outlines the principles
        and practices that guide our work.
      </p>

      <h2>Core Principles</h2>

      <h3>1. Fairness and Non-Discrimination</h3>
      <p>
        We design and develop AI systems with fairness as a priority. We work to identify and mitigate biases in our
        AI models, training data, and algorithms. We regularly evaluate our systems to ensure they do not discriminate
        against individuals or groups based on race, gender, age, disability, sexual orientation, or other protected
        characteristics.
      </p>

      <h3>2. Transparency</h3>
      <p>
        We believe in being open about how our AI systems work. We strive to provide clear explanations of how our AI
        makes decisions, especially when those decisions may significantly affect individuals. We document our AI
        development processes and make information about our models available where appropriate.
      </p>

      <h3>3. Privacy and Data Protection</h3>
      <p>
        We handle data used in AI systems with the utmost care. We apply our <a href="/legal/privacy">Privacy Policy</a> to
        all data used for AI training and inference. We minimize data collection, use anonymization and pseudonymization
        techniques where possible, and ensure compliance with applicable data protection regulations.
      </p>

      <h3>4. Safety and Reliability</h3>
      <p>
        We rigorously test our AI systems to ensure they operate safely and reliably. We implement robust validation
        processes, monitor our systems continuously after deployment, and have procedures in place to quickly address
        any issues that arise. We design our AI systems with appropriate human oversight.
      </p>

      <h3>5. Accountability</h3>
      <p>
        We take responsibility for our AI systems and their outcomes. We have clear governance structures and processes
        in place to oversee the development and deployment of AI. Our team members are trained on responsible AI practices
        and understand their role in ensuring ethical AI development.
      </p>

      <h3>6. Human-Centered Design</h3>
      <p>
        Our AI systems are designed to augment and support human capabilities, not replace human judgment in critical
        decisions. We ensure that humans remain in control of AI-assisted processes and that appropriate escalation
        mechanisms are in place.
      </p>

      <h2>Governance</h2>
      <p>
        Our responsible AI program is overseen by our technology leadership team, who regularly review our AI practices,
        assess emerging risks, and ensure alignment with our principles. We encourage employees and stakeholders to
        raise concerns about AI ethics through established channels.
      </p>

      <h2>Client Commitments</h2>
      <p>When we develop AI solutions for our clients, we commit to:</p>
      <ul>
        <li>Clearly communicating the capabilities and limitations of AI systems we deliver.</li>
        <li>Providing documentation on model behavior, training data characteristics, and known limitations.</li>
        <li>Implementing appropriate monitoring and feedback mechanisms.</li>
        <li>Supporting clients in responsible deployment and use of the AI systems we build.</li>
        <li>Maintaining confidentiality and security of client data used in AI development.</li>
      </ul>

      <h2>Continuous Improvement</h2>
      <p>
        The field of AI ethics is rapidly evolving. We are committed to staying informed about emerging best practices,
        regulatory developments, and societal expectations. We regularly update our practices and this policy to reflect
        new learnings and standards.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about our AI practices, feedback, or concerns, please contact us:
      </p>
      <p>
        <strong>Tech Next Solutions Pte Ltd.</strong><br />
        AI Ethics Team<br />
        Email: <a href="mailto:ai-ethics@technext.asia">ai-ethics@technext.asia</a>
      </p>
    </LegalPage>
  )
}
