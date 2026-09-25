import React from 'react';
import { Link } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Smartphone, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  // Only display footer in web environment, never in mobile app
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  return (
    <footer className="hidden md:block bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                Z
              </div>
              <span className="font-black text-2xl text-white tracking-tight">
                Zestora<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curating culinary masterpieces and delivering fresh, chef-crafted delicacies right to your doorstep within minutes.
            </p>
          </div>

          {/* Col 2: Popular Cuisines */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Cuisines
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/search?q=Biryani" className="hover:text-brand-400 transition-colors">Aromatic Biryani</Link></li>
              <li><Link to="/search?q=Pizza" className="hover:text-brand-400 transition-colors">Woodfired Pizza</Link></li>
              <li><Link to="/search?q=Burgers" className="hover:text-brand-400 transition-colors">Smashed Burgers</Link></li>
              <li><Link to="/search?q=South+Indian" className="hover:text-brand-400 transition-colors">South Indian Tiffins</Link></li>
              <li><Link to="/search?q=Healthy" className="hover:text-brand-400 transition-colors">Healthy Salads & Bowls</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/orders" className="hover:text-brand-400 transition-colors">Live Order Tracking</Link></li>
              <li><Link to="/profile" className="hover:text-brand-400 transition-colors">Customer Profile</Link></li>
              <li><a href="#about" className="hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="#partner" className="hover:text-brand-400 transition-colors">Partner With Us</a></li>
              <li><a href="#terms" className="hover:text-brand-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Col 4: Mobile Experience */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Experience Anywhere
            </h4>
            <p className="text-sm text-slate-400">
              Enjoy quick ordering, live real-time GPS tracking, and exclusive culinary offers on your phone.
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 p-2.5 rounded-xl hover:border-slate-600 transition-all cursor-pointer">
                <Smartphone className="w-6 h-6 text-brand-400" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Available on</p>
                  <p className="text-xs font-bold text-white">Mobile App</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 p-2.5 rounded-xl hover:border-slate-600 transition-all cursor-pointer">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Certified Safe</p>
                  <p className="text-xs font-bold text-white">100% Contactless Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Zestora Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
            <span>for food lovers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
