import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Target,
  ArrowRight,
  Globe,
  CheckCircle2,
  X
} from 'lucide-react';

interface SuccessResponse {
  message: string;
  daily_target_seconds: string;
}

function App() {
  const [formData, setFormData] = useState({
    username: '',
    site: '',
    target_days: '',
    total_hours_needed: '',
    start_now: true,
    custom_start_date: ''
  });

  const [success, setSuccess] = useState<SuccessResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/goals/create-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to set goal');
      }

      const data = await response.json();
      setSuccess(data);
    } catch (error) {
      console.error('Error setting goal:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      site: '',
      target_days: '',
      total_hours_needed: '',
      start_now: true,
      custom_start_date: ''
    });
    setSuccess(null);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cross Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            onClick={() => (window.location.href = '/dashboard')}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="px-8 py-6">
            <div className="text-center mb-8">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Goal Set Successfully!</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">{success.message}</p>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Daily Target</h3>
                <p className="text-lg font-semibold text-indigo-600">
                  {(parseFloat(success.daily_target_seconds) / 3600).toFixed(2)} hours per day
                </p>
              </div>

              <button
                onClick={resetForm}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Set Another Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Added Cross Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={() => (window.location.href = '/dashboard')}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="px-8 py-6">
          <div className="text-center mb-8">
            <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Set Your Goal</h2>
            <p className="mt-2 text-sm text-gray-600">Track your progress and achieve more</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Site
                </div>
              </label>
              <input
                type="text"
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter website name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Target Days
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.target_days}
                  onChange={(e) => setFormData({ ...formData, target_days: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Days"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Total Hours
                  </div>
                </label>
                <input
                  type="number"
                  value={formData.total_hours_needed}
                  onChange={(e) => setFormData({ ...formData, total_hours_needed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Hours"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.start_now}
                  onChange={(e) => setFormData({ ...formData, start_now: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Start Now
                </label>
              </div>

              {!formData.start_now && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.custom_start_date}
                    onChange={(e) => setFormData({ ...formData, custom_start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Set Goal
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;