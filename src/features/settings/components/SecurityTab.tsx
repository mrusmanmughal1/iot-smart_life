import { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Smartphone,
  Key,
  QrCode,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Radio } from '@/components/ui/radio';
import { Badge } from '@/components/ui/badge';
import { useSecuritySettings } from '../hooks';
import { Disable2FAModal } from './Disable2FAModal';
import { Enable2FAModal } from './Enable2FAModal';
import type { TwoFactorMethod } from '../types/settings.types';

export function SecurityTab() {
  const {
    settings,
    isLoading,
    showQRCode,
    qrCodeData,
    manualEntryKey,
    showDisableModal,
    setShowDisableModal,
    showEnableModal,
    setShowEnableModal,
    enableMethod,
    handleGenerateQR,
    handleResendSMS,
    handleSetupEmail,
    handleEnableAuthenticator,
    handleEnable2FA,
    handleDisable2FA,
    handleVerifyDisable,
    handleMethodChange,
    selectedMethod,
    isGeneratingQR,
    isEnablingAuthenticator,
    isSettingUpSMS,
    isResendingSMS,
    isEnablingSMS,
    isSendingEmailCode,
    isEnablingEmail,
    isDisabling2FA,
  } = useSecuritySettings();

  // Local state to show method selection UI when user wants to enable 2FA
  // This is separate from settings.isEnabled which is only set by API after setup
  const [showMethodSelection, setShowMethodSelection] = useState(false);
  const [authenticatorCode, setAuthenticatorCode] = useState<string>('');
  const authenticatorCodeRef = useRef<HTMLInputElement>(null);

  const twoFactorEnabled = settings?.isEnabled ?? false;
  const currentSelectedMethod = selectedMethod || 'none';

  // Show method selection UI if 2FA is enabled OR if user toggled switch to enable
  const shouldShowMethodSelection = twoFactorEnabled || showMethodSelection;

  const handleToggle2FA  = (enabled: boolean) => {
    if (enabled) {
      // Show method selection UI without making API call
      // isEnabled will be set to true by API only when user sets up a method
      setShowMethodSelection(true);
    } else {
      // If 2FA is not actually enabled yet, just hide method selection
      if (!twoFactorEnabled) {
        setShowMethodSelection(false);
      } else {
        // Show verification modal to disable
        handleDisable2FA();
      }
    }
  };
   
  // Reset showMethodSelection when 2FA is successfully enabled
  useEffect(() => {
    if (twoFactorEnabled && showMethodSelection) {
      setShowMethodSelection(false);
    }
  }, [twoFactorEnabled, showMethodSelection]);

  const handleSetupMethod = (method: TwoFactorMethod) => {
    if (method === 'authenticator') {
      handleGenerateQR();
    } else if (method === 'sms') {
      // TODO: Add phone number input modal for SMS setup
      // For now, this will need to be implemented with a phone input dialog
      toast.error('Phone number input required for SMS setup');
    } else if (method === 'email') {
      console.log('email');
      handleSetupEmail();
    }
  };

  const handleAuthenticatorCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    // Only allow digits and limit to 6
    if (/^\d*$/.test(value) && value.length <= 6) {
      setAuthenticatorCode(value);
      // Auto-submit when 6 digits are entered
      if (value.length === 6) {
        handleSubmitAuthenticatorCode(value);
      }
    }
  };

  const handleAuthenticatorCodePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setAuthenticatorCode(pastedData);
      setTimeout(() => {
        handleSubmitAuthenticatorCode(pastedData);
      }, 100);
    } else {
      toast.error('Invalid code format. Please enter a 6-digit code.');
    }
  };

  const handleSubmitAuthenticatorCode = async (code?: string) => {
    const finalCode = code || authenticatorCode;

    if (finalCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    try {
      await handleEnableAuthenticator(finalCode);
      setAuthenticatorCode('');
    } catch {
      // Error handling is done in the hook
      setAuthenticatorCode('');
      authenticatorCodeRef.current?.focus();
    }
  };

  // Auto-focus code input when QR code is shown
  useEffect(() => {
    if (showQRCode && qrCodeData && authenticatorCodeRef.current) {
      setTimeout(() => {
        authenticatorCodeRef.current?.focus();
      }, 300);
    }
  }, [showQRCode, qrCodeData]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your security preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Two-Factor Authentication Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-slate-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled || showMethodSelection}
              onCheckedChange={handleToggle2FA}
              disabled={
                isGeneratingQR ||
                isEnablingAuthenticator ||
                isSettingUpSMS ||
                isEnablingSMS ||
                isSendingEmailCode ||
                isEnablingEmail ||
                isDisabling2FA
              }
            />
          </div>

          {shouldShowMethodSelection && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-900">
                  Choose 2FA Method
                </Label>
                <div className="space-y-3">
                  {/* Email Option */}
                  <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-1">
                      <Radio
                        checked={currentSelectedMethod === 'email'}
                        onChange={() => handleMethodChange('email')}
                        value="email"
                        id="email"
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Mail className="h-4 w-4 text-blue-600" />
                        Email Verification
                      </Label>
                      <p className="text-sm text-slate-500 mt-1">
                        Receive verification codes via email
                      </p>
                      {currentSelectedMethod !== 'email' && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleSetupMethod('email')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSendingEmailCode || isEnablingEmail}
                            isLoading={isSendingEmailCode}
                          >
                            Setup Email 2FA
                          </Button>
                        </div>
                      )}
                    </div>
                    {currentSelectedMethod === 'email' && twoFactorEnabled && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </div>

                  {/* SMS Option */}
                  <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-1">
                      <Radio
                        checked={currentSelectedMethod === 'sms'}
                        onChange={() => handleMethodChange('sms')}
                        value="sms"
                        id="sms"
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="sms"
                        className="flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Smartphone className="h-4 w-4 text-green-600" />
                        SMS Verification
                      </Label>
                      <p className="text-sm text-slate-500 mt-1">
                        Receive verification codes via SMS
                      </p>
                      {currentSelectedMethod === 'sms' && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleSetupMethod('sms')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={isSettingUpSMS || isEnablingSMS}
                            isLoading={isSettingUpSMS}
                          >
                            Setup SMS 2FA
                          </Button>
                        </div>
                      )}
                    </div>
                    {currentSelectedMethod === 'sms' && twoFactorEnabled && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </div>

                  {/* Google Authenticator Option */}
                  <div className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="mt-1">
                      <Radio
                        checked={currentSelectedMethod === 'authenticator'}
                        onChange={() => handleMethodChange('authenticator')}
                        value="authenticator"
                        id="authenticator"
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="authenticator"
                        className="flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Key className="h-4 w-4 text-purple-600" />
                        Google Authenticator
                      </Label>
                      <p className="text-sm text-slate-500 mt-1">
                        Use an authenticator app for time-based codes
                      </p>
                      {currentSelectedMethod === 'authenticator' && (
                        <div className="mt-3 space-y-3">
                          {showQRCode && qrCodeData && (
                            <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
                              <div className="flex items-center gap-2 mb-3">
                                <QrCode className="h-4 w-4 text-slate-600" />
                                <Label className="text-sm font-semibold">
                                  Scan QR Code
                                </Label>
                              </div>
                              <div className="flex items-center justify-center p-4 bg-white border-2 border-dashed border-slate-300 rounded-lg mb-3">
                                <div className="text-center">
                                  <img
                                    src={qrCodeData}
                                    alt="QR Code for Google Authenticator"
                                    className="w-48 h-48 mx-auto mb-2"
                                  />
                                  <p className="text-xs text-slate-500">
                                    Scan with Google Authenticator
                                  </p>
                                </div>
                              </div>
                              {manualEntryKey && (
                                <div className="space-y-2 text-xs text-slate-600">
                                  <p className="font-medium">
                                    Manual Entry Key:
                                  </p>
                                  <code className="block p-2 bg-slate-100 rounded font-mono text-xs break-all">
                                    {manualEntryKey}
                                  </code>
                                </div>
                              )}

                              {/* Verification Code Input */}
                              <div className="space-y-2 pt-3 border-t border-slate-200">
                                <Label
                                  htmlFor="authenticator-code"
                                  className="text-sm font-semibold"
                                >
                                  Enter Verification Code
                                </Label>
                                <Input
                                  ref={authenticatorCodeRef}
                                  id="authenticator-code"
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={6}
                                  value={authenticatorCode}
                                  onChange={handleAuthenticatorCodeChange}
                                  onPaste={handleAuthenticatorCodePaste}
                                  placeholder="Enter 6-digit code"
                                  className="h-12 text-center text-xl font-semibold tracking-widest"
                                  disabled={isEnablingAuthenticator}
                                  aria-label="Enter verification code from authenticator app"
                                />
                                <p className="text-xs text-slate-500 text-center">
                                  Enter the code from your authenticator app
                                </p>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleSubmitAuthenticatorCode()
                                  }
                                  disabled={
                                    authenticatorCode.length !== 6 ||
                                    isEnablingAuthenticator
                                  }
                                  isLoading={isEnablingAuthenticator}
                                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  {isEnablingAuthenticator
                                    ? 'Enabling...'
                                    : 'Enable Authenticator 2FA'}
                                </Button>
                              </div>
                            </div>
                          )}
                          {currentSelectedMethod === 'authenticator' && (
                            <Button
                              size="sm"
                              onClick={() => handleSetupMethod('authenticator')}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                              disabled={
                                isGeneratingQR || isEnablingAuthenticator
                              }
                              isLoading={isGeneratingQR}
                            >
                              Generate QR Code
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    {currentSelectedMethod === 'authenticator' &&
                      twoFactorEnabled && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                  </div>
                </div>
              </div>

              {currentSelectedMethod !== 'none' && twoFactorEnabled && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Status
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {currentSelectedMethod === 'email' &&
                          'Email 2FA is active'}
                        {currentSelectedMethod === 'sms' && 'SMS 2FA is active'}
                        {currentSelectedMethod === 'authenticator' &&
                          'Google Authenticator is active'}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      Active
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {!shouldShowMethodSelection && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600">
                <XCircle className="h-4 w-4" />
                <p className="text-sm">
                  Two-factor authentication is currently disabled
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <Separator />

        <Button variant="destructive">Change Password</Button>
      </CardContent>

      <Disable2FAModal
        open={showDisableModal}
        onOpenChange={setShowDisableModal}
        onVerify={handleVerifyDisable}
        isVerifying={isDisabling2FA}
      />

      {enableMethod !== 'none' && (
        <Enable2FAModal
          open={showEnableModal}
          onOpenChange={setShowEnableModal}
          onVerify={handleEnable2FA}
          method={enableMethod}
          isVerifying={
            isEnablingAuthenticator || isEnablingSMS || isEnablingEmail
          }
          onResend={enableMethod === 'sms' ? handleResendSMS : undefined}
          isResending={isResendingSMS}
        />
      )}
    </Card>
  );
}
