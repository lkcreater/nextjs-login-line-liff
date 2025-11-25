import liff from '@line/liff';

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffContextType {
  isInClient: boolean;
  isLoggedIn: boolean;
  isReady: boolean;
  profile: LiffProfile | null;
  error: string | null;
  liffObject: typeof liff | null;
}

/**
 * Initialize LIFF with the given LIFF ID
 * @param liffId - LIFF ID from LINE Developers Console
 * @returns Promise that resolves when LIFF is initialized
 */
export const initializeLiff = async (liffId: string): Promise<void> => {
  if (!liffId) {
    throw new Error('LIFF ID is required');
  }

  try {
    await liff.init({ liffId });
  } catch (error) {
    console.error('Failed to initialize LIFF:', error);
    throw error;
  }
};

/**
 * Get user profile from LINE
 * @returns Promise with user profile or null
 */
export const getLiffProfile = async (): Promise<LiffProfile | null> => {
  try {
    if (!liff.isLoggedIn()) {
      return null;
    }

    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (error) {
    console.error('Failed to get LIFF profile:', error);
    return null;
  }
};

/**
 * Login to LINE
 */
export const liffLogin = (): void => {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
};

/**
 * Logout from LINE
 */
export const liffLogout = (): void => {
  if (liff.isLoggedIn()) {
    liff.logout();
  }
};

/**
 * Send messages to the current chat
 * @param messages - Array of messages to send
 */
export const sendMessages = async (messages: any[]): Promise<void> => {
  try {
    await liff.sendMessages(messages);
  } catch (error) {
    console.error('Failed to send messages:', error);
    throw error;
  }
};

/**
 * Close LIFF window
 */
export const closeLiffWindow = (): void => {
  liff.closeWindow();
};

/**
 * Open external browser
 * @param url - URL to open
 */
export const openExternalBrowser = (url: string): void => {
  liff.openWindow({
    url,
    external: true,
  });
};

export default liff;
