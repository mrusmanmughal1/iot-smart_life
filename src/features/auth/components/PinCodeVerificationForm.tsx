import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.tsx';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const CODE_LENGTH = 4;

export const PinCodeVerificationForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input when a digit is entered
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (newCode.every(digit => digit !== '') && index === CODE_LENGTH - 1) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[CODE_LENGTH - 1]?.focus();
      // Auto-submit after paste
      setTimeout(() => {
        handleSubmit(pastedData);
      }, 100);
    }
  };

  const handleSubmit = (pinCode?: string) => {
    const finalCode = pinCode || code.join('');
    
    if (finalCode.length !== CODE_LENGTH) {
      toast.error(t('auth.pinCodeVerification.invalidCode'));
      return;
    }

    verifyCode(finalCode);
  };

  const { mutate: verifyCode, isPending } = useMutation({
    mutationFn: async (pinCode: string) => {
      // TODO: Replace with actual API call when service method is available
      // return authService.verifyPinCode({ code: pinCode });
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Code verified successfully' });
        }, 1000);
      });
    },
    onSuccess: () => {
      toast.success(t('auth.pinCodeVerification.codeVerifiedSuccessfully'));
      // Navigate to next step (e.g., dashboard or complete verification)
      navigate('/login');
    },
    onError: (error: unknown) => {
      const errorMessage = 
        (error && typeof error === 'object' && 'response' in error && 
         error.response && typeof error.response === 'object' && 'data' in error.response &&
         error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
         typeof error.response.data.message === 'string')
          ? error.response.data.message
          : t('auth.pinCodeVerification.failedToVerifyCode');
      toast.error(errorMessage);
      // Clear code on error
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    },
  });

  const handleResend = () => {
    // TODO: Implement resend code functionality
    toast.success(t('auth.pinCodeVerification.codeResentSuccessfully'));
  };

  return (
    <div className="w-full max-w-lg animate-fadeIn">
      {/* PIN Code Inputs */}
      <div className="flex justify-center gap-3 mb-8">
        {Array.from({ length: CODE_LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-14 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            aria-label={t('auth.pinCodeVerification.digitInput', { number: index + 1 })}
          />
        ))}
      </div>

      {/* Verify Code Button */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={() => handleSubmit()}
          size="lg"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 shadow-xl"
          isLoading={isPending}
          disabled={code.some(digit => digit === '')}
        >
          {isPending ? t('auth.pinCodeVerification.verifying') : t('auth.pinCodeVerification.verifyCode')}
        </Button>
      </div>

      {/* Resend Code Link */}
      <div className="flex  mb-6">
        <button
          onClick={handleResend}
          className="text-sm text-gray-900 hover:text-gray-700 transition-colors"
        >
          {t('auth.pinCodeVerification.dontReceiveCode')}{' '}
          <span className="text-blue-600 hover:text-blue-700 font-medium">
            {t('auth.pinCodeVerification.clickToResend')}
          </span>
        </button>
      </div>

      {/* Back to Login Link */}
      <div className="flex justify-start">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('auth.pinCodeVerification.backToLogin')}
        </Link>
      </div>
    </div>
  );
};

