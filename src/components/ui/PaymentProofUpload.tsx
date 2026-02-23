'use client';
import { useState, useRef } from 'react';
import { UploadCloud, X, ScanSearch } from 'lucide-react';
import Tesseract from 'tesseract.js';
import toast from 'react-hot-toast';

interface PaymentProofUploadProps {
  onUpload: (file: File | null) => void;
}

// Common keywords found in Indonesian transfer receipts
const VALID_KEYWORDS = [
  'berhasil', 'transfer', 'transaksi', 'sukses', 'rp', 'idr',
  'bca', 'mandiri', 'bni', 'bri', 'dana', 'ovo', 'gopay', 'shopeepay',
  'struk', 'bukti', 'mutasi', 'rekening', 'nominal', 'pengirim', 'penerima',
  'qris', 'merchant', 'pembayaran'
];

export default function PaymentProofUpload({ onUpload }: PaymentProofUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      clearInput();
      return;
    }

    // Start OCR Scan
    setIsScanning(true);
    const toastId = toast.loading('Memindai gambar dengan AI...');

    try {
      const url = URL.createObjectURL(file);
      
      const { data: { text } } = await Tesseract.recognize(
        file,
        'ind+eng',
        { logger: m => console.log(m) } // Optional: see progress in console
      );

      const lowerText = text.toLowerCase();
      console.log('OCR Result:', lowerText);

      // Check if at least one keyword is found
      const isValidReceipt = VALID_KEYWORDS.some(keyword => lowerText.includes(keyword));

      if (!isValidReceipt) {
        toast.error('Gambar ditolak! Harap upload BUKTI TRANSFER yang sah.', { id: toastId, duration: 5000 });
        clearInput();
        return;
      }

      toast.success('Bukti transfer valid!', { id: toastId });
      setPreviewUrl(url);
      onUpload(file);

    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Gagal memindai gambar.', { id: toastId });
      clearInput();
    } finally {
      setIsScanning(false);
    }
  };

  const clearInput = () => {
    setPreviewUrl(null);
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">4</div>
        <div>
          <h2 className="text-xl font-bold text-white">Upload Bukti Bayar</h2>
          <p className="text-sm text-white/50">Wajib jika memilih Transfer Manual</p>
        </div>
      </div>

      <div className="relative z-10">
        {!previewUrl ? (
          <div 
            className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              isScanning 
                ? 'border-primary/50 bg-primary/5 cursor-wait' 
                : 'border-white/20 hover:bg-white/5 cursor-pointer'
            }`}
            onClick={() => !isScanning && fileInputRef.current?.click()}
          >
            {isScanning ? (
              <>
                <ScanSearch className="w-10 h-10 text-primary mb-3 animate-pulse" />
                <p className="text-sm font-bold text-primary mb-1">AI Sedang Memindai Gambar...</p>
                <p className="text-xs text-primary/70">Mendeteksi struk pembayaran</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-white/50 mb-3" />
                <p className="text-sm font-medium text-white mb-1">Klik untuk upload bukti bayar</p>
                <p className="text-xs text-white/40 mb-2">Format JPG, PNG max 5MB</p>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] text-white/60 flex items-center gap-1 border border-white/10">
                  <ScanSearch className="w-3 h-3" /> Dilindungi OCR Anti-Fraud
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group bg-black">
            <img src={previewUrl} alt="Bukti Pembayaran" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={clearInput}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-lg"
              >
                <X className="w-4 h-4" /> Hapus Ganti Foto
              </button>
            </div>
            {/* Valid Badge */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg border border-green-400">
              ✔️ Struk Valid
            </div>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/jpg"
          className="hidden"
          disabled={isScanning}
        />
      </div>
    </div>
  );
}
