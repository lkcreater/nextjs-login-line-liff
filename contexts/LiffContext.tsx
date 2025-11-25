'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import liff from '@line/liff';
import { initializeLiff, getLiffProfile, LiffProfile, LiffContextType } from '@/lib/liff';

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const useLiff = () => {
    const context = useContext(LiffContext);
    if (!context) {
        throw new Error('useLiff must be used within a LiffProvider');
    }
    return context;
};

interface LiffProviderProps {
    children: ReactNode;
}

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
    const [isInClient, setIsInClient] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [profile, setProfile] = useState<LiffProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsInClient(true);

        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

        if (!liffId) {
            setError('LIFF ID is not configured. Please set NEXT_PUBLIC_LIFF_ID in .env.local');
            setIsReady(true);
            return;
        }

        const initLiff = async () => {
            try {
                await initializeLiff(liffId);

                if (liff.isLoggedIn()) {
                    setIsLoggedIn(true);
                    const userProfile = await getLiffProfile();
                    setProfile(userProfile);
                } else {
                    // Auto login if not logged in
                    setIsLoggedIn(false);
                    setProfile(null);
                    liff.login();
                }
            } catch (err) {
                console.error('LIFF initialization failed:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize LIFF');
            } finally {
                setIsReady(true);
            }
        };

        initLiff();
    }, []);

    const value: LiffContextType = {
        isInClient,
        isLoggedIn,
        isReady,
        profile,
        error,
        liffObject: isInClient ? liff : null,
    };

    return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
};
