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
      'We collect only the information required to process orders, support customers, and improve the experience.',
      'You may request account or data deletion by contacting support.',
    ],
  },
  '/terms': {
    title: 'Terms of Use',
    body: [
      'By using this website, you agree to our purchase, return, and account policies.',
      'Misuse of content or platform services may result in account restrictions.',
    ],
  },
  '/accessibility': {
    title: 'Accessibility',
    body: [
      'We are working to improve keyboard navigation, contrast consistency, and assistive technology support.',
      'Please report accessibility issues to support@cualquier.com for prompt follow-up.',
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
