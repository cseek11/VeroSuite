import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { SettingsCard } from '../shared/SettingsCard';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileSettingsProps {
  formData: ProfileData;
  updateFormData: (updates: Partial<ProfileData>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  formData,
  updateFormData,
  showPassword,
  setShowPassword
}) => {
  const handleInputChange = (field: keyof ProfileData, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <SettingsCard title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="John"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Doe"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="john.doe@example.com"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </SettingsCard>

      {/* Password Change */}
      <SettingsCard title="Change Password" icon={Lock}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
