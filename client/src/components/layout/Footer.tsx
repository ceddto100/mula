import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-50 border-t border-brand-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {/* Logo centered */}
        <div className="text-center mb-10">
          <Link to="/">
            <span className="font-script text-4xl text-brand-900">Cualquier</span>
          </Link>
          <p className="font-grotesk text-xs tracking-[0.3em] text-brand-500 uppercase mt-2">
            Style With Purpose
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Customer Service */}
          <div>
            <h4 className="font-grotesk text-xs tracking-[0.2em] text-brand-900 uppercase font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3">
              {['Contact Us', 'Shipping', 'Returns & Exchanges', 'FAQ', 'Size Guide'].map((item) => (
                <li key={item}>
                  <Link to="#" className="font-grotesk text-sm text-brand-600 hover:text-brand-900 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-grotesk text-xs tracking-[0.2em] text-brand-900 uppercase font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Store Locator', 'Sustainability'].map((item) => (
                <li key={item}>
                  <Link to="#" className="font-grotesk text-sm text-brand-600 hover:text-brand-900 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-grotesk text-xs tracking-[0.2em] text-brand-900 uppercase font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: 'Men', path: '/category/men' },
                { label: 'Women', path: '/category/women' },
                { label: 'Accessories', path: '/category/accessories' },
                { label: 'Collections', path: '/category/collections' },
                { label: 'Sale', path: '/category/sale' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="font-grotesk text-sm text-brand-600 hover:text-brand-900 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-grotesk text-xs tracking-[0.2em] text-brand-900 uppercase font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              {[
                { Icon: FiInstagram, label: 'Instagram' },
                { Icon: FiFacebook, label: 'Facebook' },
                { Icon: FiTwitter, label: 'Twitter' },
                { Icon: FiYoutube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="text-brand-500 hover:text-brand-900 transition-colors"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            <h4 className="font-grotesk text-xs tracking-[0.2em] text-brand-900 uppercase font-semibold mb-3">Newsletter</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-3 py-2 text-sm border border-brand-300 border-r-0 focus:outline-none focus:border-brand-600 bg-white font-grotesk"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-900 text-brand-100 text-xs tracking-widest uppercase font-grotesk hover:bg-brand-800 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {['Privacy Policy', 'Terms of Use', 'Accessibility'].map((item) => (
            <Link key={item} to="#" className="font-grotesk text-xs text-brand-500 hover:text-brand-900 transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-brand-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="font-grotesk text-xs text-brand-500">
              &copy; {new Date().getFullYear()} Cualquier. All Rights Reserved.
            </p>
            <p className="font-grotesk text-xs text-brand-400 tracking-widest uppercase">
              United States &nbsp;•&nbsp; English
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
