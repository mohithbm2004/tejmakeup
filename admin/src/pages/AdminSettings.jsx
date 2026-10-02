import React, { useState, useEffect } from 'react';
import { Settings, Check, Phone, MessageCircle, Mail, MapPin, Globe } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const AdminSettings = () => {
  const { settings, updateSettings, loading } = useSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateSettings(form);
      setSuccess('Site settings updated successfully across the atelier!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 bg-white border border-sand-300 animate-pulse h-96" />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-sand-300 pb-6">
        <span className="text-[10px] uppercase tracking-ultra text-champagne-700 font-semibold block">
          Global Configuration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
          Site & Concierge Settings
        </h1>
        <p className="text-xs text-sand-600 font-light mt-1">
          Configure studio address, contact numbers, WhatsApp pre-filled messaging, social links, and SEO defaults.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-sand-300 p-8 shadow-sm space-y-8">
        {/* Atelier Identity */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            1. Brand Identity & Hero Message
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Brand / Business Name *
              </label>
              <input
                type="text"
                required
                value={form.businessName || ''}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagram || ''}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/tejmakeup"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Homepage Hero Headline
            </label>
            <input
              type="text"
              value={form.heroHeading || ''}
              onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Homepage Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={form.heroSubheading || ''}
              onChange={(e) => setForm({ ...form, heroSubheading: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>
        </div>

        {/* Concierge Channels */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            2. Concierge Channels (Phone, WhatsApp, Email)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Telephone Number
              </label>
              <input
                type="text"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                WhatsApp Number (with country code)
              </label>
              <input
                type="text"
                value={form.whatsapp || ''}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="+919876543210"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Concierge Email
              </label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="concierge@tejmakeup.com"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Default WhatsApp Pre-filled Greeting
            </label>
            <input
              type="text"
              value={form.whatsappMessage || ''}
              onChange={(e) => setForm({ ...form, whatsappMessage: e.target.value })}
              placeholder="Hi Tej, I would love to check your availability for my upcoming wedding/event!"
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>
        </div>

        {/* Studio & Operating Details */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            3. Studio Location & Operating Hours
          </h3>
          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Studio Address
            </label>
            <input
              type="text"
              value={form.address || ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Bespoke Private Studio, Bandra West, Mumbai | Available Worldwide"
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Google Maps Link
              </label>
              <input
                type="url"
                value={form.mapsUrl || ''}
                onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Working / Consultation Hours
              </label>
              <input
                type="text"
                value={form.workingHours || ''}
                onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                placeholder="Mon – Sun: 08:00 AM – 08:00 PM (By Appointment)"
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            4. Global SEO Optimization
          </h3>
          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Default SEO Title Tag
            </label>
            <input
              type="text"
              value={form.seoTitle || ''}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Default Meta Description Tag
            </label>
            <textarea
              rows={2}
              value={form.seoDescription || ''}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-sand-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? 'Updating Settings...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
