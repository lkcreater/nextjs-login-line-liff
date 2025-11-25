'use client';

import React from 'react';
import { useLiff } from '@/contexts/LiffContext';

export default function LiffProfile() {
    const { isReady, isLoggedIn, profile } = useLiff();

    if (!isReady) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!isLoggedIn || !profile) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 text-center">
                    กรุณาเปิดแอพนี้ใน LINE เพื่อล็อกอิน
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-4">
                {profile.pictureUrl && (
                    <img
                        src={profile.pictureUrl}
                        alt={profile.displayName}
                        className="w-20 h-20 rounded-full border-4 border-green-500"
                    />
                )}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {profile.displayName}
                    </h2>
                    {profile.statusMessage && (
                        <p className="text-gray-600 mt-1">{profile.statusMessage}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                        User ID: {profile.userId}
                    </p>
                </div>
            </div>
        </div>
    );
}
