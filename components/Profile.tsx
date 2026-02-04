import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { CheckCircle, Briefcase, Mail, Link, Github } from './ui/Icons';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [skillsInput, setSkillsInput] = useState(userProfile.skills.join(', '));
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
    setSkillsInput(userProfile.skills.join(', '));
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      ...formData,
      skills: skillsInput.split(',').map(s => s.trim()).filter(s => s),
    };
    onUpdateProfile(updatedProfile);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const InputField = ({ label, name, value, ...props }: any) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={!isEditing}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600"
        {...props}
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">This information helps personalize your career guidance.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Information Card */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="name" value={formData.name} type="text" />
            <InputField label="Email Address" name="email" value={formData.email} type="email" />
          </div>
        </div>

        {/* Professional Details Card */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Details</h2>
          <div className="space-y-6">
            <InputField label="Professional Headline" name="headline" value={formData.headline} type="text" placeholder="e.g., Aspiring Full Stack Developer" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Target Role" name="role" value={formData.role} type="text" placeholder="e.g., Software Engineer Fresher" />
               <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-600"
                  >
                    <option>Fresher</option>
                    <option>0-1 Years</option>
                    <option>1-3 Years</option>
                    <option>3+ Years</option>
                  </select>
               </div>
            </div>
          </div>
        </div>
        
        {/* Key Skills Card */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Key Skills</h2>
          <p className="text-sm text-gray-500 mb-4">Separate skills with a comma.</p>
          {isEditing ? (
             <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, Node.js, Python..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 outline-none transition-all"
             />
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.skills.length > 0 ? formData.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-100">
                  {skill}
                </span>
              )) : <p className="text-sm text-gray-400">No skills added yet.</p>}
            </div>
          )}
        </div>
        
        {/* Online Presence Card */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Online Presence</h2>
          <div className="space-y-4">
            <InputField label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} type="url" placeholder="https://linkedin.com/in/..." />
            <InputField label="GitHub URL" name="githubUrl" value={formData.githubUrl} type="url" placeholder="https://github.com/..." />
            <InputField label="Portfolio URL" name="portfolioUrl" value={formData.portfolioUrl} type="url" placeholder="https://your-domain.com" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-between">
          <div>
            {showSuccess && (
                <div className="flex items-center gap-2 text-sm text-green-600 animate-fade-in">
                    <CheckCircle className="w-5 h-5" />
                    Profile updated successfully!
                </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(userProfile);
                    setSkillsInput(userProfile.skills.join(', '));
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;