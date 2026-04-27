import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useSeo } from '../hooks/useSeo';

const CONTENT: Record<string, { title: string; body: string[] }> = {
  '/shipping': {
    title: 'Shipping Policy',
    body: [
      'Orders are processed within 1-2 business days.',
      'Standard shipping takes 3-7 business days in the US.',
      'A tracking link is emailed once your order ships.',
    ],
  },
  '/returns': {
    title: 'Returns & Exchanges',
    body: [
      'Returns are accepted within 30 days for unworn items with tags.',
      'Exchanges are free for size changes when inventory is available.',
      'Refunds are issued to the original payment method after inspection.',
    ],
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    body: [
      'Need help? Reach out through the contact page for quick support.',
      'For order updates, include your order number in your message.',
      'For fit help, use our size guide before ordering.',
    ],
  },
  '/size-guide': {
    title: 'Size Guide',
    body: [
      'Measure chest, waist, and hip before selecting a size.',
      'If between sizes, size up for oversized fit and size down for slim fit.',
      'Contact support for product-specific measurements.',
    ],
  },
  '/contact': {
    title: 'Contact Us',
    body: [
      'Email: support@cualquier.com',
      'Response time: usually within 24 hours (Mon-Fri).',
      'Include order number and photo references when relevant.',
    ],
  },
  '/about': {
    title: 'About Cualquier',
    body: [
      'Cualquier is a contemporary clothing brand blending street energy with refined silhouettes.',
      'Each drop is designed to be wearable, expressive, and built for daily life.',
    ],
  },
  '/careers': {
    title: 'Careers',
    body: [
      'We are always looking for creative collaborators across design, content, and operations.',
      'Send your portfolio and role interest to careers@cualquier.com.',
    ],
  },
  '/stores': {
    title: 'Store Locator',
    body: [
      'Cualquier currently operates online only.',
      'Watch this page for upcoming pop-up events and in-person activations.',
    ],
  },
  '/sustainability': {
    title: 'Sustainability',
    body: [
      'We prioritize durable materials and intentional production runs to reduce waste.',
      'Supplier and fabric transparency details will continue to expand with each collection.',
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    body: [
      'Effective Date: April 27, 2026.',
      'Cualquier ("we," "us," or "our") collects and uses personal information to operate this website, process purchases, provide customer support, and improve our products and services.',
      'Information we collect may include your name, email address, shipping and billing addresses, phone number, order history, payment metadata from our payment processor, account credentials, wishlist/cart activity, and device or browser analytics data.',
      'We use this information to fulfill orders, provide order updates, prevent fraud, maintain account security, answer support requests, send service emails, and—when you opt in—send marketing communications.',
      'Payment card details are processed by third-party payment providers and are not stored in full on our servers.',
      'We may share data with trusted service providers that support payment processing, shipping/logistics, analytics, email delivery, and site operations. These providers may only use personal information to provide contracted services to us.',
      'We may also disclose information when required by law, legal process, or to protect rights, safety, and platform integrity.',
      'Cookies and similar technologies are used for cart persistence, login sessions, website performance, and analytics. You can manage cookies through your browser settings, though some site features may be affected.',
      'If you create an account, you are responsible for maintaining the confidentiality of your login credentials. We recommend using a unique password and signing out on shared devices.',
      'We retain personal information only as long as needed for business, contractual, tax, accounting, and legal compliance purposes, then delete or de-identify data where feasible.',
      'Depending on your location, you may have rights to request access, correction, deletion, portability, or limits on certain processing of your personal information.',
      'To exercise privacy rights, request account deletion, or ask a privacy question, contact support@cualquier.com with the subject line "Privacy Request." We may verify your identity before completing certain requests.',
      'This website is not directed to children under 13, and we do not knowingly collect personal information from children under 13.',
      'We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated effective date.',
    ],
  },
  '/terms': {
    title: 'Terms of Use',
    body: [
      'Effective Date: April 27, 2026.',
      'These Terms of Use govern your access to and use of the Cualquier website, including browsing products, creating an account, purchasing goods, and using related services.',
      'By accessing or using this website, you agree to be bound by these Terms and all policies referenced in them, including our Privacy Policy, Shipping Policy, and Returns & Exchanges policy.',
      'You agree to provide accurate information when creating an account or placing an order and to keep your account credentials secure.',
      'All product descriptions, prices, promotions, and availability are subject to change without notice. We reserve the right to correct pricing or content errors at any time.',
      'Placing an order is an offer to purchase. We may accept, reject, or cancel orders in our discretion, including in cases of suspected fraud, inventory issues, payment problems, or obvious pricing mistakes.',
      'You are responsible for applicable taxes, shipping charges, and ensuring shipping information is accurate at checkout.',
      'Returns, refunds, and exchanges are governed by the posted Returns & Exchanges policy in effect at the time of purchase.',
      'All website content—including logos, product imagery, graphics, text, and design elements—is owned by Cualquier or its licensors and is protected by applicable intellectual property laws.',
      'You may not copy, distribute, modify, scrape, reverse engineer, or commercially exploit any part of this website without prior written permission.',
      'You agree not to misuse the site, interfere with its operation, attempt unauthorized access, introduce malicious code, or use automated tools that burden infrastructure or violate applicable law.',
      'This website and services are provided on an "as is" and "as available" basis without warranties of any kind to the fullest extent permitted by law.',
      'To the maximum extent allowed by law, Cualquier is not liable for indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or goodwill arising from website use or purchases.',
      'If any provision of these Terms is held unenforceable, the remaining provisions remain in full force and effect.',
      'We may revise these Terms from time to time. Continued use of the website after updates means you accept the revised Terms.',
      'For questions about these Terms, contact support@cualquier.com.',
    ],
  },
  '/accessibility': {
    title: 'Accessibility',
    body: [
      'Effective Date: April 27, 2026.',
      'Cualquier is committed to providing an inclusive digital experience for all customers, including people with disabilities.',
      'We aim to design and maintain this website in alignment with recognized accessibility best practices, including the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, where feasible.',
      'Our accessibility efforts include ongoing work on semantic structure, keyboard operability, sufficient color contrast, clear focus states, alt text for meaningful imagery, form labeling, and support for assistive technologies.',
      'Accessibility is an ongoing process. As we release new features, products, and content, we continue testing and remediation to improve usability.',
      'If you have difficulty accessing any part of this website, encounter a barrier, or need information in an alternative format, please contact us at support@cualquier.com with the subject line "Accessibility Support."',
      'When contacting us, please include the page URL, a brief description of the issue, the assistive technology/browser you were using, and your preferred contact method so we can assist quickly.',
      'We welcome feedback that helps us improve accessibility for our entire community.',
    ],
  },
};

const InfoPage: React.FC = () => {
  const { pathname } = useLocation();
  const content = CONTENT[pathname] || {
    title: 'Info',
    body: ['The requested page is not available yet.'],
  };

  useSeo(`${content.title} | Cualquier`, content.body[0]);

  return (
    <Layout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-display mb-6">{content.title}</h1>
        <div className="space-y-4 text-brand-700 leading-relaxed">
          {content.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default InfoPage;
