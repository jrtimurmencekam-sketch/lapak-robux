'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, X, ScanSearch, ShieldCheck, AlertTriangle } from 'lucide-react';
import Tesseract, { createWorker, Worker } from 'tesseract.js';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';

interface SelectedPayment {
  type?: 'qris' | 'transfer';
  account_number?: string | null;
  account_name?: string | null;
  label?: string;
}

interface PaymentProofUploadProps {
  onUpload: (file: File | null) => void;
  selectedPayment?: SelectedPayment;
  totalAmount?: number;
}

// Keywords found in Indonesian transfer/payment receipts
const VALID_KEYWORDS = [
  'berhasil', 'transfer', 'transaksi', 'sukses',
  'bca', 'mandiri', 'bni', 'bri', 'dana', 'ovo', 'gopay', 'shopeepay',
  'struk', 'bukti', 'mutasi', 'rekening', 'nominal', 'pengirim', 'penerima',
  'qris', 'merchant', 'pembayaran', 'diterima', 'selesai', 'completed',
  'receipt', 'paid', 'approved', 'ke rekening', 'dari rekening',
  'bank central asia', 'bank negara indonesia', 'bank rakyat indonesia',
  'bank mandiri', 'link aja', 'linkaja'
];

const MIN_MATCH_COUNT = 2; // Minimum keyword matches required

// Convert image to grayscale via canvas for better OCR accuracy
function imageToGrayscale(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;     // R
        data[i + 1] = gray; // G
        data[i + 2] = gray; // B
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('toBlob failed')),
        'image/png'
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Extract numbers from OCR text for nominal matching
function extractNumbers(text: string): number[] {
  const matches = text.match(/[\d.,]+/g) || [];
  return matches
    .map(m => parseInt(m.replace(/[.,\s]/g, ''), 10))
    .filter(n => !isNaN(n) && n > 1000); // Only amounts > Rp 1.000
}

export default function PaymentProofUpload({ onUpload, selectedPayment, totalAmount }: PaymentProofUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [validationResult, setValidationResult] = useState<{
    type: 'valid' | 'warning' | null;
    messages: string[];
  }>({ type: null, messages: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // Initialize Tesseract worker once (persistent)
  useEffect(() => {
    let isMounted = true;

    const initWorker = async () => {
      try {
        const worker = await createWorker('ind+eng', 1, {
          logger: (m) => {
            if (isMounted && m.status === 'recognizing text') {
              setScanProgress(Math.round(m.progress * 100));
            }
          }
        });
        if (isMounted) {
          workerRef.current = worker;
        }
      } catch (err) {
        console.error('Failed to init Tesseract worker:', err);
      }
    };

    initWorker();

    return () => {
      isMounted = false;
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      clearInput();
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setValidationResult({ type: null, messages: [] });
    const toastId = toast.loading('Memvalidasi bukti transfer...');

    try {
      // 1. Compress image for faster OCR
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });

      // 2. Convert to grayscale for better accuracy
      const grayscaleBlob = await imageToGrayscale(compressed);

      // 3. Run OCR (use persistent worker, fallback to direct call)
      let ocrText = '';
      if (workerRef.current) {
        const { data: { text } } = await workerRef.current.recognize(grayscaleBlob);
        ocrText = text;
      } else {
        const { data: { text } } = await Tesseract.recognize(grayscaleBlob, 'ind+eng');
        ocrText = text;
      }

      const lowerText = ocrText.toLowerCase();
      console.log('OCR Result:', lowerText);

      // 4. Scoring: count keyword matches
      const matches = VALID_KEYWORDS.filter(kw => lowerText.includes(kw));
      console.log('Keyword matches:', matches);

      if (matches.length < MIN_MATCH_COUNT) {
        toast.error('Gambar ditolak! Harap upload BUKTI TRANSFER yang sah.', { id: toastId, duration: 5000 });
        clearInput();
        return;
      }

      // 5. Advanced validation (warnings, not blocking)
      const warnings: string[] = [];
      let isFullyValid = true;

      // 5a. Validate destination account/merchant name (dynamic from Supabase)
      if (selectedPayment) {
        if (selectedPayment.type === 'transfer' && selectedPayment.account_number) {
          // For bank transfer: check if account number exists in OCR text
          const cleanAccountNum = selectedPayment.account_number.replace(/[\s-]/g, '');
          const textWithoutSpaces = lowerText.replace(/[\s-]/g, '');
          if (!textWithoutSpaces.includes(cleanAccountNum)) {
            warnings.push('Nomor rekening tujuan tidak terdeteksi di bukti transfer');
            isFullyValid = false;
          }
        }

        if (selectedPayment.account_name) {
          // For both transfer & QRIS: check account/merchant name
          const cleanName = selectedPayment.account_name.toLowerCase().trim();
          // Check each word of the name (partial match for flexibility)
          const nameWords = cleanName.split(/\s+/).filter(w => w.length > 2);
          const nameFound = nameWords.some(word => lowerText.includes(word));
          if (!nameFound && nameWords.length > 0) {
            const label = selectedPayment.type === 'qris' ? 'Nama merchant' : 'Nama penerima';
            warnings.push(`${label} "${selectedPayment.account_name}" tidak terdeteksi`);
            isFullyValid = false;
          }
        }
      }

      // 5b. Validate nominal amount
      if (totalAmount && totalAmount > 0) {
        const detectedAmounts = extractNumbers(lowerText);
        const tolerance = 500; // Allow Rp 500 tolerance for unique code
        const nominalFound = detectedAmounts.some(
          amt => Math.abs(amt - totalAmount) <= tolerance
        );
        if (!nominalFound && detectedAmounts.length > 0) {
          warnings.push(`Nominal Rp ${totalAmount.toLocaleString('id-ID')} tidak terdeteksi`);
          isFullyValid = false;
        }
      }

      // 6. Show result
      if (isFullyValid) {
        toast.success('Bukti transfer valid! ✓', { id: toastId });
        setValidationResult({ type: 'valid', messages: ['Semua validasi lolos'] });
      } else {
        toast('Bukti diterima dengan catatan', {
          id: toastId,
          icon: '⚠️',
          duration: 5000,
        });
        setValidationResult({ type: 'warning', messages: warnings });
      }

      // Accept the file regardless (warnings don't block)
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onUpload(file);

    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Gagal memproses gambar. Coba lagi.', { id: toastId });
      clearInput();
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const clearInput = useCallback(() => {
    setPreviewUrl(null);
    setValidationResult({ type: null, messages: [] });
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onUpload]);

  return (
    <div className="bg-accent/30 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">4</div>
        <div>
          <h2 className="text-xl font-bold text-white">Upload Bukti Bayar</h2>
          <p className="text-sm text-white/50">
            {selectedPayment?.type === 'qris' ? 'Upload screenshot pembayaran QRIS' : 'Wajib jika memilih Transfer Manual'}
          </p>
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
                {/* Progress bar */}
                <div className="w-48 h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300" 
                    style={{ width: `${scanProgress}%` }} 
                  />
                </div>
                <p className="text-[10px] text-primary/50 mt-1">{scanProgress}%</p>
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
          <div className="space-y-3">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group bg-black">
              <img src={previewUrl} alt="Bukti Pembayaran" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={clearInput}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" /> Hapus & Ganti Foto
                </button>
              </div>
              {/* Validation Badge */}
              {validationResult.type === 'valid' && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg border border-green-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Struk Valid
                </div>
              )}
              {validationResult.type === 'warning' && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg border border-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Perlu Verifikasi
                </div>
              )}
            </div>

            {/* Warning details */}
            {validationResult.type === 'warning' && validationResult.messages.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Catatan Validasi:
                </p>
                <ul className="space-y-0.5">
                  {validationResult.messages.map((msg, i) => (
                    <li key={i} className="text-xs text-amber-300/80">• {msg}</li>
                  ))}
                </ul>
                <p className="text-[10px] text-white/40 mt-2">Bukti tetap diterima, admin akan verifikasi manual.</p>
              </div>
            )}
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
