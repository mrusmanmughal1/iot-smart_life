import React from 'react';
import AuthBg from '../../../assets/images/auth-bg.png';
import SmartLifeImg from '../../../assets/images/smartlife-text-black.png';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <div className="flex">
      {/* Left Side - Background Image */}
      <div className="flex-1 hidden md:block">
      <img
        src={AuthBg}
        alt="Auth Background"
        className=" md:block hidden  h-screen w-full    "
      />
      </div>

      {/* Right Side - Form Content Area (50%) */}
      <div className="w-full   flex-1  md:px-20 px-4 ">
        <div className="flex justify-center pt-20   flex-col   ">
          <div className="flex justify-between">
            <img
              src={SmartLifeImg}
              alt="Auth Logo"
              width={150}
              className="mb-20"
            />
            <div className="">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-sm text-gray-500 mb-10">{description}</p>
          </div>
          <div className="my-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
