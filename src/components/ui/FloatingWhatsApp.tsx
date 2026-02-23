'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function FloatingWhatsApp() {
  const [phoneNumber, setPhoneNumber] = useState('6281234567890');
  const message = encodeURIComponent('Halo Admin Lapak Robux, saya mau tanya-tanya seputar Top Up / Joki dong.');

  useEffect(() => {
    async function fetchWA() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'whatsapp_number')
          .single();
          
        if (data && data.value && !error) {
          setPhoneNumber(data.value);
        }
      } catch (err) {
        console.error('Failed to load WA number', err);
      }
    }
    fetchWA();
  }, []);

  const waLink = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <Link 
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:scale-110 transition-all duration-300 group"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Tooltip Badge */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-black text-sm font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-xl whitespace-nowrap before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-right-1.5 before:border-t-8 before:border-t-transparent before:border-b-8 before:border-b-transparent before:border-l-8 before:border-l-white">
        Butuh Bantuan?
      </span>
      
      {/* Ping Animation Indicator */}
      <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" style={{ animationDuration: '2s' }}></div>
    </Link>
  );
}
