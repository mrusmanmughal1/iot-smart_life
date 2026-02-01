import { useEffect, useState } from 'react';
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useAccountSettings } from '../hooks';
import { userService } from '@/features/users/services/usersService';
import { usersApi } from '@/services/api';
import { useGetCurrentUser } from '../hooks/useAccountSettings';
import { createChangePasswordSchema, createProfileSchema } from "../Schema";
type ChangePasswordFormData = z.infer<ReturnType<typeof createChangePasswordSchema>>;
type ProfileFormData = z.input<ReturnType<typeof createProfileSchema>>;

export function AccountTab() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { settings, isLoading } = useAccountSettings();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const changePasswordSchema = createChangePasswordSchema(t);
  const profileSchema = createProfileSchema(t);

  //  change password  api call 
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser()
  // update profile
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as unknown as Resolver<ProfileFormData>,
    defaultValues: {
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      phone: currentUser?.phone ?? '',
      companyName: currentUser?.companyName ?? ''
    },
  });

  useEffect(() => {
    if (!currentUser) return;
    resetProfile({
      name: currentUser.name ?? '',
      email: currentUser.email ?? '',
      phone: currentUser.phone ?? '',
    });
  }, [currentUser, resetProfile]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (data: { name: string; phone?: string }) => usersApi.updateProfile(data),
    onSuccess: () => {
      toast.success(t('common.saved') || 'Saved');
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error && typeof error === 'object' && 'response' in error &&
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
          typeof error.response.data.message === 'string')
          ? error.response.data.message
          : (t('common.somethingWentWrong') || 'Something went wrong');
      toast.error(errorMessage);
    },
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      userService.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success(t('settings.changePassword.passwordUpdatedSuccessfully'));
      resetPassword();
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string')
          ? error.message
          : (error && typeof error === 'object' && 'response' in error &&
            error.response && typeof error.response === 'object' && 'data' in error.response &&
            error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
            typeof error.response.data.message === 'string')
            ? error.response.data.message
            : t('settings.changePassword.failedToUpdatePassword');

      // Check for specific error messages
      if (errorMessage.toLowerCase().includes('incorrect') || errorMessage.toLowerCase().includes('wrong')) {
        toast.error(t('settings.changePassword.oldPasswordIncorrect'));
      } else if (errorMessage.toLowerCase().includes('different') || errorMessage.toLowerCase().includes('same')) {
        toast.error(t('settings.changePassword.newPasswordSameAsOld'));
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const onSubmitPassword = (data: ChangePasswordFormData) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const onSubmitProfile = (data: ProfileFormData) => {
    updateProfile({
      name: data.name.trim(),
      phone: data.phone ? data.phone.trim() : undefined,
    });
  };

  const accountType = settings?.accountType || 'Premium Account';
  const storageUsed = settings?.storageUsed || 2.4;
  const storageTotal = settings?.storageTotal || 10;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  if (isLoading || isLoadingUser) {
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
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t('common.profile') || 'Profile'}</CardTitle>
          <CardDescription>
            {t('common.updateYourProfile') || 'Update your account information'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile(onSubmitProfile as unknown as SubmitHandler<ProfileFormData>)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profileName">{t('common.name') || 'Name'}</Label>
                <Input
                  id="profileName"
                  placeholder={t('common.name') || 'Name'}
                  {...registerProfile('name')}
                  error={profileErrors.name?.message}
                  className="border rounded-md"
                />
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="profileEmail">{t('common.email') || 'Email'}</Label>
                <Input
                  id="profileEmail"
                  placeholder={t('common.email') || 'Email'}
                  {...registerProfile('email')}
                  disabled
                  className="border rounded-md opacity-80 disabled:opacity-100  disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-gray-100"
                />
                <div
                  className="absolute bottom-full left-1/2 mb-2 w-max
           -translate-x-1/2 scale-0
           rounded bg-gray-900 px-2 py-1 text-xs text-white
           transition-all group-hover:scale-100">
                  Tooltip text
                </div>

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">{t('common.companyName') || 'Company Name'}</Label>
              <Input
                type="tel"
                id="companyName"
                placeholder={t('common.companyName') || 'Phone Number'}
                {...registerProfile('companyName')}
                error={profileErrors.phone?.message}
                className="border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePhone">{t('common.phoneNumber') || 'Phone Number'}</Label>
              <Input
                type="tel"
                id="profilePhone"
                placeholder={t('common.phoneNumber') || 'Phone Number'}
                {...registerProfile('phone')}
                error={profileErrors.phone?.message}
                className="border rounded-md"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={isUpdatingProfile || !isProfileDirty}>
                {isUpdatingProfile ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!currentUser) return;
                  resetProfile({
                    name: currentUser.name ?? '',
                    email: currentUser.email ?? '',
                    phone: currentUser.phone ?? '',
                  });
                }}
                disabled={isUpdatingProfile || !isProfileDirty}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="p-3 bg-purple-50 dark:bg-gray-900 dark:border-gray-700 border border-purple-200 rounded-lg">
              <p className="font-medium text-purple-900 dark:text-white">{accountType}</p>
              <p className="text-sm text-purple-700 dark:text-white">Full access to all features</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Storage Used</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {storageUsed} GB of {storageTotal} GB used
                </span>
                <span>{Math.round(storagePercentage)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-gray-900 dark:border-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-red-600 dark:text-white">Danger Zone</Label>
            <div className="p-4 border border-red-200 rounded-lg space-y-2">
              <p className="text-sm text-slate-600 dark:text-white">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Form */}
      <Card className="mt-4 p-4" >
        <CardContent>
          <div className="space-y-1">
            <div className="mb-4">
              <Label className="text-lg font-semibold  text-black dark:text-gray-200">{t('settings.changePassword.title')}</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update your account password to keep your account secure
              </p>
            </div>

            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t('settings.changePassword.currentPassword')}</Label>
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder={t('settings.changePassword.currentPasswordPlaceholder')}
                  {...registerPassword('currentPassword')}
                  error={passwordErrors.currentPassword?.message}
                  className="border rounded-md"
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('settings.changePassword.newPassword')}</Label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder={t('settings.changePassword.newPasswordPlaceholder')}
                  {...registerPassword('newPassword')}
                  className="border rounded-md"
                  error={passwordErrors.newPassword?.message}
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('settings.changePassword.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('settings.changePassword.confirmPasswordPlaceholder')}
                  {...registerPassword('confirmPassword')}
                  error={passwordErrors.confirmPassword?.message}
                  className="border rounded-md"
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                />
              </div>

              {/* Submit Button */}
              <div className=" ">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={isPending}
                >
                  {isPending ? t('settings.changePassword.updating') : t('settings.changePassword.updatePassword')}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </>

  );
}

