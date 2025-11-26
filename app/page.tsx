'use client';

import { useLiff } from '@/contexts/LiffContext';
import LiffProfile from '@/components/LiffProfile';
import { liffLogin, liffLogout, sendMessages, closeLiffWindow, openExternalBrowser } from '@/lib/liff';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { isReady, isLoggedIn, error, liffObject } = useLiff();
  const [message, setMessage] = useState('สวัสดีจาก LIFF App!');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!liffObject || !isLoggedIn) return;

    try {
      setSending(true);
      await sendMessages([
        {
          type: 'text',
          text: message,
        },
      ]);
      alert('ส่งข้อความสำเร็จ!');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('ไม่สามารถส่งข้อความได้');
    } finally {
      setSending(false);
    }
  };

  const handleCloseWindow = () => {
    if (liffObject) {
      closeLiffWindow();
    }
  };

  const handleOpenExternal = () => {
    if (liffObject) {
      openExternalBrowser('https://line.me');
    }
  };

  const handleLogout = () => {
    if (liffObject && isLoggedIn) {
      liffLogout();
      // Reload page to reset state
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LINE LIFF App
          </h1>
          <p className="text-gray-600">
            Next.js TypeScript + LINE LIFF Integration
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            สถานะการเชื่อมต่อ
          </h2>

          {!isReady ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <span className="text-gray-600">กำลังเริ่มต้น LIFF...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">เกิดข้อผิดพลาด:</p>
              <p className="text-red-600 mt-1">{error}</p>
              <p className="text-sm text-red-500 mt-2">
                กรุณาตรวจสอบว่าได้ตั้งค่า NEXT_PUBLIC_LIFF_ID ใน .env.local แล้ว
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isLoggedIn ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-700">
                  {isLoggedIn ? '✓ เชื่อมต่อกับ LINE แล้ว' : '○ ยังไม่ได้ล็อกอิน LINE'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${liffObject?.isInClient() ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-700">
                  {liffObject?.isInClient() ? '✓ เปิดใน LINE App' : '○ เปิดใน External Browser'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        {isReady && !error && (
          <div className="mb-6">
            {isLoggedIn ? (
              <LiffProfile />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 mb-4">กรุณาเปิดแอพนี้ใน LINE</p>
                <button
                  onClick={liffLogin}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  ล็อกอินด้วย LINE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Features Card */}
        {isReady && !error && isLoggedIn && liffObject && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ฟีเจอร์ LIFF
            </h2>

            <div className="space-y-4">
              {/* Send Message */}
              {liffObject.isInClient() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ส่งข้อความไปยังแชท
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="พิมพ์ข้อความ..."
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sending || !message.trim()}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      {sending ? 'กำลังส่ง...' : 'ส่ง'}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push('/scan')}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  📷 Scan QR Code
                </button>
                <button
                  onClick={() => router.push('/camera')}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  📸 ถ่ายภาพ
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  ออกจากระบบ
                </button>
                {liffObject.isInClient() && (
                  <button
                    onClick={handleCloseWindow}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                )}
                <button
                  onClick={handleOpenExternal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  เปิด External Browser
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 วิธีการใช้งาน</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>ตั้งค่า LIFF ID ใน .env.local (คัดลอกจาก .env.example)</li>
            <li>รัน <code className="bg-blue-100 px-2 py-1 rounded">npm run dev</code></li>
            <li>เปิด LIFF URL ใน LINE App เพื่อทดสอบ</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
