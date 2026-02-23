'use client';
import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-center"
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
