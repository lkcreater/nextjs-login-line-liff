'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QrScanner from '@/components/QrScanner';

export default function ScanPage() {
    const router = useRouter();
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [scanHistory, setScanHistory] = useState<string[]>([]);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

    const handleScanSuccess = (decodedText: string) => {
        setScannedResult(decodedText);
        setScanHistory((prev) => {
            // Add to history if not already present
            if (!prev.includes(decodedText)) {
                return [decodedText, ...prev].slice(0, 5); // Keep last 5 scans
            }
            return prev;
        });
    };

    const handleScanError = (error: string) => {
        // Silently ignore scan errors to avoid console spam
    };

    const handleCapture = (imageDataUrl: string) => {
        setCapturedPhoto(imageDataUrl);
    };

    const downloadPhoto = (dataUrl: string) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `qr-scan-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('คัดลอกแล้ว!');
        });
    };

    const openUrl = (url: string) => {
        try {
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error opening URL:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📷 QR Code Scanner
                    </h1>
                    <p className="text-gray-600">
                        สแกน QR Code เพื่อดูข้อมูล
                    </p>
                </div>

                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        ← กลับหน้าหลัก
                    </button>
                </div>

                {/* Scanner Component */}
                <div className="mb-6">
                    <QrScanner
                        onScanSuccess={handleScanSuccess}
                        onScanError={handleScanError}
                        onCapture={handleCapture}
                    />
                </div>

                {/* Captured Photo */}
                {capturedPhoto && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            📸 ภาพที่ถ่าย
                        </h2>
                        <div className="mb-3">
                            <img
                                src={capturedPhoto}
                                alt="Captured QR"
                                className="w-full rounded-lg border-2 border-gray-300"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => downloadPhoto(capturedPhoto)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                💾 ดาวน์โหลด
                            </button>
                            <button
                                onClick={() => setCapturedPhoto(null)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                ✖️ ปิด
                            </button>
                        </div>
                    </div>
                )}

                {/* Current Scan Result */}
                {scannedResult && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            ✅ ผลลัพธ์ล่าสุด
                        </h2>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
                            <p className="text-gray-800 break-all font-mono text-sm">
                                {scannedResult}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => copyToClipboard(scannedResult)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                📋 คัดลอก
                            </button>
                            {scannedResult.startsWith('http') && (
                                <button
                                    onClick={() => openUrl(scannedResult)}
                                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    🔗 เปิดลิงก์
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Scan History */}
                {scanHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            📜 ประวัติการสแกน
                        </h2>
                        <div className="space-y-2">
                            {scanHistory.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                                >
                                    <p className="text-gray-700 break-all font-mono text-sm flex-1">
                                        {item}
                                    </p>
                                    <button
                                        onClick={() => copyToClipboard(item)}
                                        className="ml-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded transition-colors text-sm"
                                    >
                                        คัดลอก
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 วิธีใช้งาน</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                        <li>กดปุ่ม "เริ่ม Scan" เพื่อเปิดกล้อง</li>
                        <li>นำกล้องไปส่องที่ QR Code</li>
                        <li>ระบบจะอ่านข้อมูลโดยอัตโนมัติ</li>
                        <li>กดปุ่ม "📸 Capture" เพื่อถ่ายภาพ QR Code</li>
                        <li>สามารถคัดลอกหรือเปิดลิงก์ได้ทันที</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
