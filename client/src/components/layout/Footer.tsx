import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Customer Service */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4">CUSTOMER SERVICE</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/contact" className="hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-gray-900 transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-gray-900 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-gray-900 transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4">COMPANY</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/about" className="hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-gray-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-gray-900 transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="hover:text-gray-900 transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4">SHOP</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/category/men" className="hover:text-gray-900 transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="hover:text-gray-900 transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="hover:text-gray-900 transition-colors">
                  Kids & Baby
                </Link>
              </li>
              <li>
                <Link to="/category/home" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/sale" className="hover:text-gray-900 transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs tracking-wider font-medium mb-4">LEGAL</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link to="/privacy" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gray-900 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-gray-900 transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-xs tracking-wider font-medium mb-4">CONNECT WITH US</h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="YouTube"
              >
                <FiYoutube size={20} />
              </a>
            </div>

            <h4 className="text-xs tracking-wider font-medium mb-3">SIGN UP FOR EMAILS</h4>
            <form className="flex">
              <input
                type="email"
                placeholder="Email Address"
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
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Cualquier. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
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
