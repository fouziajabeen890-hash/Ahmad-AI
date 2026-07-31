import { Instagram, Phone, Mail } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Contact Us</h1>
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <a 
          href="https://www.instagram.com/its_ahmad_435/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-slate-300"
        >
          <Instagram className="w-6 h-6 text-pink-500" />
          <div>
            <p className="font-medium text-white">Instagram</p>
            <p className="text-sm text-slate-500">its_ahmad_435</p>
          </div>
        </a>
        <a 
          href="https://wa.me/923004985806" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors text-slate-300"
        >
          <Phone className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-white">WhatsApp</p>
            <p className="text-sm text-slate-500">03004985806</p>
          </div>
        </a>
      </div>
    </div>
  );
}
