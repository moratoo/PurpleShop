import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, LogOut } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FacebookProvider, LoginButton } from 'react-facebook';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => Promise<any>;
  isAuthenticated?: boolean;
  user?: any; // Flexible type for now
}

export function AuthModal({ isOpen, onClose, onLogin, isAuthenticated, user }: AuthModalProps) {
  const { t } = useTranslation();

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log('Google Login Success:', tokenResponse);
      onClose();
    },
    onError: error => {
      console.error('Google Login Failed:', error);
    }
  });

  const handleAppleLogin = async () => {
    try {
      // Apple Sign In implementation
      window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${import.meta.env.VITE_APPLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=name email`;
    } catch (error) {
      console.error('Apple Login Failed:', error);
    }
  };

  const handleFacebookLogin = (response: any) => {
    if (response.status === 'connected') {
      console.log('Facebook Login Success:', response);
      onClose();
    } else {
      console.error('Facebook Login Failed');
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      // Microsoft Sign In implementation
      window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${import.meta.env.VITE_MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin)}&response_mode=query&scope=user.read`;
    } catch (error) {
      console.error('Microsoft Login Failed:', error);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      // Twitter (X) Sign In implementation
      window.location.href = `https://twitter.com/i/oauth2/authorize?client_id=${import.meta.env.VITE_TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code&scope=tweet.read users.read`;
    } catch (error) {
      console.error('Twitter Login Failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label={t('common.close')}
        >
          <X className="h-6 w-6" />
        </button>

        <h2 id="auth-modal-title" className="text-2xl font-bold mb-6 text-center">
          {isAuthenticated ? t('auth.welcomeBack') : t('auth.welcome')}
        </h2>

        {isAuthenticated && user ? (
          // User is logged in - show profile options
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name || user.email}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
              )}
              <div>
                <p className="font-medium">{user.display_name || user.email}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <LogOut className="h-4 w-4" />
              {t('auth.logout')}
            </button>
          </div>
        ) : (
          // User is not logged in - show login options
          <div className="space-y-4">
            {/* Google Login */}
            <button
              type="button"
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              {t('auth.continueWithGoogle')}
            </button>

            {/* Microsoft Login */}
            <button
              type="button"
              onClick={handleMicrosoftLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.microsoft.com/favicon.ico"
                alt="Microsoft"
                className="w-5 h-5"
              />
              {t('auth.continueWithMicrosoft')}
            </button>

            {/* Apple Login */}
            <button
              type="button"
              onClick={handleAppleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://www.apple.com/favicon.ico"
                alt="Apple"
                className="w-5 h-5"
              />
              {t('auth.continueWithApple')}
            </button>

            {/* Facebook Login */}
            <FacebookProvider appId={import.meta.env.VITE_FACEBOOK_APP_ID || ''}>
              <LoginButton>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // Facebook login will be handled by LoginButton component
                    console.log('Facebook login initiated');
                  }}
                >
                  <img
                    src="https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico"
                    alt="Facebook"
                    className="w-5 h-5"
                  />
                  {t('auth.continueWithFacebook')}
                </button>
              </LoginButton>
            </FacebookProvider>

            {/* Twitter (X) Login */}
            <button
              type="button"
              onClick={handleTwitterLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png"
                alt="Twitter"
                className="w-5 h-5"
              />
              {t('auth.continueWithTwitter')}
            </button>
          </div>
        )}

        <p className="text-xs text-center mt-6 text-gray-500">
          {t('auth.termsNotice')}
        </p>
      </div>
    </div>
  );
}