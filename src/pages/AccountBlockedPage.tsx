import React from 'react';
import { AuthLayout } from '../features/auth/components/AuthLayout.tsx';
import { AccountBlockedForm } from '../features/auth/components/AccountBlockedForm.tsx';

export const AccountBlockedPage: React.FC = () => {

  return (
    <AuthLayout>
      <div className="w-full  flex justify-center items-center">
        <AccountBlockedForm />
      </div>
    </AuthLayout>
  );
};
