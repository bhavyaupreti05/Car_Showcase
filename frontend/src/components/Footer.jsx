import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Car <span className="text-blue-500">Showcase</span>
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted platform for finding and comparing premium cars with AI-powered recommendations.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91-XXXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@carshowcase.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Browse Cars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Recommender</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compare</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Sedans</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SUVs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hatchbacks</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Electric</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4 mb-6">
              {[
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Instagram, href: '#' },
                { Icon: Linkedin, href: '#' },
              ].map((social, idx) => {
                const Icon = social.Icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-gray-400">Subscribe to our newsletter for updates</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Car Showcase. All rights reserved. Made for SDE internship aspirants.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
