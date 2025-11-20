import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { useRegister } from '../hooks/useRegister.ts';
import GoogleIcon from '@assets/icons/google.webp';
import AppleIcon from '@assets/icons/apple.svg';
import GithubIcon from '@assets/icons/github.svg';

type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

const createRegisterSchema = (t: (key: string) => string) => z.object({
  firstName: z.string().min(2, t('auth.register.firstNameMinLength')),
  lastName: z.string().min(2, t('auth.register.lastNameMinLength')),
  email: z.string().email(t('auth.register.emailInvalid')),
  mobile: z
    .string()
    .min(1, t('auth.register.mobileRequired'))
    .refine(
      (val) => {
        // Remove all spaces, dashes, and parentheses for validation
        const cleaned = val.replace(/[\s\-()]/g, '');
        
        // Saudi Arabia phone number patterns:
        // Local: 05XXXXXXXX (10 digits, starts with 05)
        // International with +: +9665XXXXXXXX (13 chars, +966 + 9 digits)
        // International with 00: 009665XXXXXXXX (14 chars, 00966 + 9 digits)
        // Without prefix: 9665XXXXXXXX (12 digits, 966 + 9 digits)
        
        // Check for local format (05XXXXXXXX)
        if (/^05\d{8}$/.test(cleaned)) {
          return true;
        }
        
        // Check for international format with + (+9665XXXXXXXX)
        if (/^\+9665\d{8}$/.test(cleaned)) {
          return true;
        }
        
        // Check for international format with 00 (009665XXXXXXXX)
        if (/^009665\d{8}$/.test(cleaned)) {
          return true;
        }
        
        // Check for format without + but with country code (9665XXXXXXXX)
        if (/^9665\d{8}$/.test(cleaned)) {
          return true;
        }
        
        return false;
      },
      {
        message: t('auth.register.mobileInvalid'),
      }
    ),
  password: z.string().min(6, t('auth.register.passwordMinLength')),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: t('auth.register.acceptTermsError'),
  }),
});

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: register, isPending, error } = useRegister();

  const registerSchema = createRegisterSchema(t);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    const { firstName, lastName, ...rest } = data;
    register({
      name: `${firstName} ${lastName}`,
      ...rest,
    });
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Social Signup Buttons */}
      <div className="flex  flex-col md:flex-row gap-3 mb-8">
        <Button
          variant="social"
          className="flex-1 h-12 rounded-full text-xs"
          type="button"
        >
          <img src={GoogleIcon} alt="Google" className="w-4 h-4 mr-2" />
          {t('auth.register.signUpWithGoogle')}
        </Button>
        <Button
          variant="social"
          className="flex-1 h-12 rounded-full text-xs"
          type="button"
        >
          <img src={AppleIcon} alt="Apple" className="w-4 h-4 mr-2" />
          {t('auth.register.signUpWithApple')}
        </Button>
        <Button
          variant="social"
          className="flex-1 h-12 rounded-full text-xs"
          type="button"
        >
          <img src={GithubIcon} alt="GitHub" className="w-5 h-5 mr-2" />
          {t('auth.register.signUpWithGithub')}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-[#DB42900D] rounded-[40px] border border-[#DB4290]">
          <p className="text-[20px] text-[#DB4290] text-center">
            {error.message}
          </p>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name */}
        <div>
          <Input
            type="text"
            placeholder={t('auth.register.firstNamePlaceholder')}
            {...formRegister('firstName')}
            error={errors.firstName?.message}
          />
        </div>

        {/* Last Name */}
        <div>
          <Input
            type="text"
            placeholder={t('auth.register.lastNamePlaceholder')}
            {...formRegister('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        {/* Email */}
        <div>
          <Input
            type="email"
            placeholder={t('auth.register.emailPlaceholder')}
            {...formRegister('email')}
            error={errors.email?.message}
          />
        </div>

        {/* Mobile Number */}
        <div>
          <Input
            type="tel"
            placeholder={t('auth.register.mobilePlaceholder')}
            {...formRegister('mobile')}
            error={errors.mobile?.message}
          />
        </div>

        {/* Password */}
        <div>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.register.passwordPlaceholder')}
            {...formRegister('password')}
            error={errors.password?.message}
            icon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#949CA9]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>
        <div className="flex justify-between">
          {/* Terms & Conditions */}
          <div className="flex flex-col items-center gap-2">
            <Checkbox
              {...formRegister('acceptTerms')}
              label={t('auth.register.acceptTerms')}
            />
            {errors.acceptTerms && (
              <p className="text-sm  ">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {/* Register Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              className="px-12"
              isLoading={isPending}
            >
              {isPending ? t('auth.register.registering') : t('auth.register.registerButton')}
            </Button>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center pt-4">
          <p className="text-sm text-[#545454]">
            {t('auth.register.alreadyHaveAccount')}{' '}
            <Link
              to="/login"
              className="text-[#1976D2] font-semibold hover:underline"
            >
              {t('auth.register.signIn')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
