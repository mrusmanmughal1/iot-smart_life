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
    <div className="max-h-screen w-full">
      <div className="flex">
        {/* Left Side - Background Image */}
        <div className="flex-1 hidden md:block h-screen  object-cover overflow-hidden  ">
          <img
            src={AuthBg}
            alt="Auth Background"
            className="  w-full h-full object-cover   "
          />
        </div>

        {/* Right Side - Form Content Area (50%) */}
        <div className="w-full  overflow-y-auto h-screen   flex-1  md:px-10 px-4 ">
          <div className="flex justify-center pt-20   flex-col   ">
            <div className="flex justify-between mb-14">
              <img
                src={SmartLifeImg}
                alt="Auth Logo"
                width={150}
                className=" "
              />
              <div className="">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="">
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
              <p className="text-sm text-gray-500 mb-10">{description}</p>
            </div>
            <div className="mb-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
