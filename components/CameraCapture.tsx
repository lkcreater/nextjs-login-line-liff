'use client';

import { useEffect, useRef, useState } from 'react';

interface CameraCaptureProps {
    onCapture: (imageDataUrl: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
        try {
            setError(null);

            // Stop existing stream if any
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: mode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsStreaming(true);
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'ไม่สามารถเปิดกล้องได้';
            setError(errorMsg);
            console.error('Error accessing camera:', err);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(imageDataUrl);
    };

    const switchCamera = async () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newMode);
        if (isStreaming) {
            await startCamera(newMode);
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Video Preview */}
                <div className="mb-4 relative">
                    <video
                        ref={videoRef}
                        className="w-full rounded-lg bg-black"
                        style={{ aspectRatio: '16/9' }}
                        playsInline
                        muted
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Camera Mode Indicator */}
                    {isStreaming && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {facingMode === 'user' ? '📱 กล้องหน้า' : '📷 กล้องหลัง'}
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
                <div className="space-y-3">
                    {!isStreaming ? (
                        <button
                            onClick={() => startCamera()}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            🎥 เปิดกล้อง
                        </button>
                    ) : (
                        <>
                            <div className="flex gap-3">
                                <button
                                    onClick={capturePhoto}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    📸 ถ่ายภาพ
                                </button>
                                <button
                                    onClick={switchCamera}
                                    className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                >
                                    🔄
                                </button>
                            </div>
                            <button
                                onClick={stopCamera}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                ⏹️ ปิดกล้อง
                            </button>
                        </>
                    )}
                </div>

                {/* Status Indicator */}
                <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <div
                            className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                                }`}
                        />
                        <span className="text-sm text-gray-600">
                            {isStreaming ? 'กล้องเปิดอยู่' : 'กล้องปิด'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
