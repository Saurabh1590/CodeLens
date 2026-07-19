import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Lock,
  User,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: 'test@codelens.dev',
    fullName: 'John Developer',
    timezone: 'UTC-8',
    emailNotifications: true,
    pushNotifications: false,
    dataCollection: true,
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || 'test@codelens.dev';
    const storedName = localStorage.getItem('userFullName') || 'John Developer';
    setFormState(prev => ({
      ...prev,
      email: storedEmail,
      fullName: storedName
    }));
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('userEmail', formState.email);
      localStorage.setItem('userFullName', formState.fullName);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSaveStatus('success');
    } catch (err) {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-100 rounded-md transition-colors duration-150"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-lg font-extrabold text-slate-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {[
            { id: 'account', label: 'Account', icon: User },
            { id: 'privacy', label: 'Privacy & Data', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              className="px-4 py-3 text-sm font-medium text-slate-700 border-b-2 border-transparent hover:text-slate-900 transition-colors duration-150 flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Account Settings */}
        <div className="bg-white border border-slate-200 rounded-md p-8 mb-8">
          <h2 className="text-base font-extrabold text-slate-900 mb-6">Account Information</h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
              />
              <p className="text-xs text-slate-500 mt-2">
                Use the same email address in your Chrome Extension settings to sync sessions.
              </p>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
              <select
                value={formState.timezone}
                onChange={(e) => setFormState({ ...formState, timezone: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
              >
                <option>UTC-8</option>
                <option>UTC-5</option>
                <option>UTC</option>
                <option>UTC+1</option>
                <option>UTC+5:30</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                  type="button"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-white border border-slate-200 rounded-md p-8 mb-8">
          <h2 className="text-base font-extrabold text-slate-900 mb-6">Privacy & Data</h2>

          <div className="space-y-6">
            {/* Data Collection Toggle */}
            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors duration-150">
              <div>
                <p className="font-medium text-slate-900">Allow Code Analysis</p>
                <p className="text-sm text-slate-500 mt-1">
                  Permit CodeLens to analyze your code snapshots for AI insights
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.dataCollection}
                  onChange={(e) =>
                    setFormState({ ...formState, dataCollection: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Delete Data */}
            <div className="border border-red-200 bg-red-50 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Delete All Data</p>
                  <p className="text-sm text-red-800 mt-1">
                    Permanently remove all your sessions and analytics. This action cannot be undone.
                  </p>
                  <button className="mt-3 px-4 py-2 text-sm font-medium text-red-600 border border-red-300 hover:bg-red-100 rounded-md transition-colors duration-150">
                    Delete Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-md p-8 mb-8">
          <h2 className="text-base font-extrabold text-slate-900 mb-6">Notifications</h2>

          <div className="space-y-4">
            {[
              {
                id: 'emailNotifications',
                label: 'Email Notifications',
                description: 'Receive weekly summary emails of your progress',
              },
              {
                id: 'pushNotifications',
                label: 'Push Notifications',
                description: 'Get alerts when recommendations are ready',
              },
            ].map((notif) => (
              <div key={notif.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors duration-150">
                <div>
                  <p className="font-medium text-slate-900">{notif.label}</p>
                  <p className="text-sm text-slate-500 mt-1">{notif.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState[notif.id as keyof typeof formState] as boolean}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        [notif.id]: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Status */}
        {saveStatus === 'success' && (
          <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-800">Settings saved successfully</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-6">
          <Link
            to="/dashboard"
            className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-md transition-colors duration-150"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-md transition-colors duration-150 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}