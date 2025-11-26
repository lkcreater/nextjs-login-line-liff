'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from '@/components/CameraCapture';

export default function CameraPage() {
    const router = useRouter();
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [photoHistory, setPhotoHistory] = useState<string[]>([]);

    const handleCapture = (imageDataUrl: string) => {
        setCapturedPhoto(imageDataUrl);
        setPhotoHistory((prev) => [imageDataUrl, ...prev].slice(0, 5)); // Keep last 5 photos
    };

    const downloadPhoto = (dataUrl: string, index?: number) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `photo-${Date.now()}${index !== undefined ? `-${index}` : ''}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const retakePhoto = () => {
        setCapturedPhoto(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📸 Camera Capture
                    </h1>
                    <p className="text-gray-600">
                        เปิดกล้องและถ่ายภาพ
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

                {/* Camera Component */}
                {!capturedPhoto && (
                    <div className="mb-6">
                        <CameraCapture onCapture={handleCapture} />
                    </div>
                )}

                {/* Captured Photo Preview */}
                {capturedPhoto && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            ✅ ภาพที่ถ่าย
                        </h2>
                        <div className="mb-4">
                            <img
                                src={capturedPhoto}
                                alt="Captured"
                                className="w-full rounded-lg border-2 border-gray-300"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => downloadPhoto(capturedPhoto)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                💾 ดาวน์โหลด
                            </button>
                            <button
                                onClick={retakePhoto}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                🔄 ถ่ายใหม่
                            </button>
                        </div>
                    </div>
                )}

                {/* Photo History */}
                {photoHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-3 text-gray-800">
                            📷 ภาพที่ถ่ายไว้
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {photoHistory.map((photo, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={photo}
                                        alt={`Photo ${index + 1}`}
                                        className="w-full rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-500 transition-colors"
                                        onClick={() => setCapturedPhoto(photo)}
                                    />
                                    <button
                                        onClick={() => downloadPhoto(photo, index)}
                                        className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        💾
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
                        <li>กดปุ่ม "เปิดกล้อง" เพื่อเริ่มใช้งาน</li>
                        <li>กดปุ่ม 🔄 เพื่อสลับกล้องหน้า/หลัง</li>
                        <li>กดปุ่ม "ถ่ายภาพ" เพื่อบันทึกภาพ</li>
                        <li>สามารถดาวน์โหลดหรือถ่ายใหม่ได้ทันที</li>
                        <li>คลิกที่ภาพในประวัติเพื่อดูขนาดเต็ม</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
