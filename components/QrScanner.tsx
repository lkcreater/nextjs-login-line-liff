'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

export default function QrScanner({ onScanSuccess, onScanError }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';

  const startScanner = async () => {
    try {
      setError(null);

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrCodeRegionId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore continuous scanning errors
          // console.log(errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'ไม่สามารถเปิดกล้องได้';
      setError(errorMsg);
      if (onScanError) {
        onScanError(errorMsg);
      }
      console.error('Error starting scanner:', err);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        // Check if scanner is actually running before stopping
        const state = await scannerRef.current.getState();
        if (state === 2) { // 2 = SCANNING state
          await scannerRef.current.stop();
        }
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);

    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {
          // Ignore errors on cleanup
        });
        // Clear is synchronous, no need for catch
        try {
          scannerRef.current.clear();
        } catch {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Scanner Container */}
        <div className="mb-4">
          {isMounted ? (
            <div
              id={qrCodeRegionId}
              className="rounded-lg overflow-hidden border-2 border-gray-300"
              style={{ minHeight: '300px' }}
            />
          ) : (
            <div
              className="rounded-lg overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100"
              style={{ minHeight: '300px' }}
            >
              <span className="text-gray-500">กำลังโหลด...</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-1">
              กรุณาตรวจสอบว่าได้อนุญาตให้เข้าถึงกล้องแล้ว
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isScanning ? (
            <button
              onClick={startScanner}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              เริ่ม Scan
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              หยุด Scan
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                }`}
            />
            <span className="text-sm text-gray-600">
              {isScanning ? 'กำลัง Scan...' : 'พร้อม Scan'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
