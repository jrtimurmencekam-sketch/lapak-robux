'use client';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethod {
  id: string;
  type: 'qris' | 'transfer';
  label: string;
  account_name: string | null;
  account_number: string | null;
  qris_image_url: string | null;
}

interface PaymentInstructionsProps {
  method: PaymentMethod;
  totalAmount: number;
}

export default function PaymentInstructions({ method, totalAmount }: PaymentInstructionsProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const handleCopy = async (text: string, type: 'account' | 'amount') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
          return;
        } finally {
          textArea.remove();
        }
      }

      if (type === 'account') {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2000);
      } else {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-accent/30 border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -mr-10 -mt-10" />

      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10">
        <span className="text-primary">💳</span> Instruksi Pembayaran — {method.label}
      </h3>

      <div className="bg-black/40 rounded-xl p-4 border border-white/5 relative z-10">
        {/* QRIS Display */}
        {method.type === 'qris' && method.qris_image_url && (
          <div className="space-y-4">
            <p className="text-white/60 text-sm">Scan QRIS di bawah ini menggunakan aplikasi e-wallet atau m-banking Anda:</p>
            <div className="bg-white rounded-xl p-4 mx-auto max-w-[260px]">
              <img
                src={method.qris_image_url}
                alt="QRIS"
                className="w-full object-contain"
              />
            </div>
            {method.account_name && (
              <p className="text-center text-white/50 text-sm">
                A/N: <span className="text-white font-semibold">{method.account_name}</span>
              </p>
            )}

            {/* Total Amount */}
            <div>
              <p className="text-xs text-white/50 mb-1 font-medium">Nominal yang harus dibayar:</p>
              <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3 border border-primary/20">
                <span className="font-black text-white text-xl">Rp {totalAmount.toLocaleString('id-ID')}</span>
                <button
                  onClick={() => handleCopy(totalAmount.toString(), 'amount')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                >
                  {copiedAmount ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-400" /> Disalin</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Salin Nominal</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Display */}
        {method.type === 'transfer' && (
          <div className="space-y-4">
            <p className="text-white/60 text-sm">Silakan transfer sesuai nominal ke rekening di bawah ini:</p>

            <div>
              <p className="text-xs text-white/50 mb-1 font-medium">Bank Tujuan</p>
              <p className="font-bold text-white text-lg">{method.label}</p>
            </div>

            {method.account_name && (
              <div>
                <p className="text-xs text-white/50 mb-1 font-medium">Nama Rekening</p>
                <p className="font-bold text-white">{method.account_name}</p>
              </div>
            )}

            {method.account_number && (
              <div>
                <p className="text-xs text-white/50 mb-1 font-medium">Nomor Rekening</p>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                  <span className="font-black text-primary text-xl tracking-wider">{method.account_number}</span>
                  <button
                    onClick={() => handleCopy(method.account_number!, 'account')}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    {copiedAccount ? (
                      <><CheckCircle2 className="w-4 h-4 text-green-400" /> Disalin</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Salin</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Total Amount */}
            <div>
              <p className="text-xs text-white/50 mb-1 font-medium">Nominal Transfer</p>
              <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3 border border-primary/20">
                <span className="font-black text-white text-xl">Rp {totalAmount.toLocaleString('id-ID')}</span>
                <button
                  onClick={() => handleCopy(totalAmount.toString(), 'amount')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                >
                  {copiedAmount ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-400" /> Disalin</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Salin Nominal</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
