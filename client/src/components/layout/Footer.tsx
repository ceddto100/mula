import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address.');
      return;
    }
    const existing = JSON.parse(localStorage.getItem('newsletter_signups') || '[]');
    localStorage.setItem('newsletter_signups', JSON.stringify([...new Set([...existing, email.trim()])]));
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer className="bg-black/60 backdrop-blur-md border-t border-white/20">
      {/* Service band — "May We Help You?" (luxury-style contact prompt) */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-14 text-center">
          <h3 className="text-white text-sm tracking-[0.25em] font-grotesk font-semibold mb-2">
            MAY WE HELP YOU?
          </h3>
          <p className="text-white/70 text-sm font-grotesk mb-7">
            Our client advisors are available to assist you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-grotesk">
            <a
              href="tel:+18000000000"
              className="text-white/90 border-b border-white/40 pb-1 hover:border-white transition-colors"
            >
              Call Us
            </a>
            <Link
              to="/contact"
              className="text-white/90 border-b border-white/40 pb-1 hover:border-white transition-colors"
            >
              Email Us
            </Link>
            <Link
              to="/faq"
              className="text-white/90 border-b border-white/40 pb-1 hover:border-white transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Customer Service */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4 text-white">CUSTOMER SERVICE</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4 text-white">COMPANY</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-white transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4 text-white">SHOP</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/category/men" className="hover:text-white transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="hover:text-white transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="hover:text-white transition-colors">
                  Kids & Baby
                </Link>
              </li>
              <li>
                <Link to="/category/home" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/sale" className="hover:text-white transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4 text-white">LEGAL</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-xs tracking-wider font-medium mb-4 text-white">CONNECT WITH US</h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FiYoutube size={20} />
              </a>
            </div>

            <h4 className="text-xs tracking-wider font-medium mb-3 text-white">SIGN UP FOR EMAILS</h4>
            <form className="flex" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 border-r-0 focus:outline-none focus:border-gray-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white text-xs tracking-wider hover:bg-gray-800 transition-colors"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20 bg-black/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/70">
              &copy; 2026 Cualquier Cosa no.9. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/70">
              <span>United States</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
