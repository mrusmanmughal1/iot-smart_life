import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Smartphone, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { TwoFactorMethod } from '../types/settings.types';

interface Enable2FAModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (code: string) => Promise<void>;
  method: Exclude<TwoFactorMethod, 'none'>;
  isVerifying?: boolean;
  onResend?: () => void;
  isResending?: boolean;
}

const CODE_LENGTH = 6;

const methodIcons = {
  email: Mail,
  sms: Smartphone,
  authenticator: Key,
};

const methodLabels = {
  email: 'Email',
  sms: 'SMS',
  authenticator: 'Authenticator',
};

export function Enable2FAModal({
  open,
  onOpenChange,
  onVerify,
  method,
  isVerifying = false,
  onResend,
  isResending = false,
}: Enable2FAModalProps) {
  const [code, setCode] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = methodIcons[method];

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset code when modal closes
  useEffect(() => {
    if (!open) {
      setCode('');
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to CODE_LENGTH
    if (/^\d*$/.test(value) && value.length <= CODE_LENGTH) {
      setCode(value);
      // Auto-submit when all digits are entered
      if (value.length === CODE_LENGTH) {
        handleSubmit(value);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    if (/^\d{6}$/.test(pastedData)) {
      setCode(pastedData);
      setTimeout(() => {
        handleSubmit(pastedData);
      }, 100);
    } else {
      toast.error('Invalid code format. Please enter a 6-digit code.');
    }
  };

  const handleSubmit = async (verificationCode?: string) => {
    const finalCode = verificationCode || code;

    if (finalCode.length !== CODE_LENGTH) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    try {
      await onVerify(finalCode);
      // Success will be handled by parent component
      onOpenChange(false);
    } catch {
      // Error handling is done in the parent component
      // Just reset the code on error
      setCode('');
      inputRef.current?.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-purple-600" />
            Enable {methodLabels[method]} Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Please enter the 6-digit verification code sent to your { }
            {method === 'authenticator' && ' app'} to complete the setup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              ref={inputRef}
              id="verification-code"
              type="text"
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              value={code}
              onChange={handleChange}
              onPaste={handlePaste}
              placeholder="Enter 6-digit code"
              className="h-14 text-center text-2xl font-semibold tracking-widest"
              disabled={isVerifying}
              aria-label="Enter verification code"
            />
            <p className="text-xs text-slate-500 text-center">
              {/* Enter the code from your {methodLabels[method].toLowerCase()} */}
              {method === 'authenticator' && ' app'}
            </p>
          </div>

          {onResend && method !== 'authenticator' && (
            <div className="text-center">
              <button
                onClick={onResend}
                disabled={isResending}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                {isResending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          )}
        </div>

        <DialogFooter className="p-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={code.length !== CODE_LENGTH || isVerifying}
            isLoading={isVerifying}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isVerifying ? 'Verifying...' : 'Enable 2FA'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

