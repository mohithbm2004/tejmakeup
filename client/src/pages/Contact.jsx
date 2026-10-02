import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import api from '../api/axios';
import SEO from '../components/SEO';

const Contact = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        eventType: 'General Inquiry',
        eventDate: new Date(),
        location: 'Contact Form Message',
        message: form.message
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please reach out via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact & Studio"
        description="Get in touch with Tej Makeup Artistry. Visit our private Bandra studio or connect with our bridal concierge."
      />

      <div className="pt-32 pb-24 bg-ivory-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              Private Concierge
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-noir font-normal">
              Connect With The Atelier
            </h1>
            <p className="text-sand-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
              We look forward to curating your wedding aesthetic. Connect via direct WhatsApp concierge or visit our private studio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Direct channels */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 bg-white border border-sand-200 shadow-sm space-y-6">
                <h3 className="font-serif text-2xl text-noir font-normal border-b border-sand-100 pb-4">
                  Studio Details
                </h3>

                {settings.address && (
                  <div className="flex items-start gap-3.5">
                    <MapPin className="w-5 h-5 text-champagne-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-sand-500 font-medium">Bespoke Studio</p>
                      <a
                        href={settings.mapsUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-noir hover:text-champagne-600 leading-relaxed transition-colors block mt-1"
                      >
                        {settings.address}
                      </a>
                    </div>
                  </div>
                )}

                {settings.workingHours && (
                  <div className="flex items-start gap-3.5">
                    <Clock className="w-5 h-5 text-champagne-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-sand-500 font-medium">Studio Consultations</p>
                      <p className="text-xs text-noir leading-relaxed mt-1">{settings.workingHours}</p>
                    </div>
                  </div>
                )}

                {settings.phone && (
                  <div className="flex items-start gap-3.5">
                    <Phone className="w-5 h-5 text-champagne-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-sand-500 font-medium">Direct Telephone</p>
                      <a href={`tel:${settings.phone}`} className="text-xs text-noir hover:text-champagne-600 block mt-1">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings.email && (
                  <div className="flex items-start gap-3.5">
                    <Mail className="w-5 h-5 text-champagne-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-sand-500 font-medium">Concierge Email</p>
                      <a href={`mailto:${settings.email}`} className="text-xs text-noir hover:text-champagne-600 block mt-1">
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Callout */}
              {settings.whatsapp && (
                <div className="p-8 bg-sand-50 border border-champagne-300 text-center space-y-4">
                  <MessageCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-xl text-noir font-normal">Instant WhatsApp Assistance</h4>
                  <p className="text-xs text-sand-600 leading-relaxed font-light">
                    For urgent wedding date availability and bridal portfolio inquiries, chat directly with our booking concierge.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      settings.whatsappMessage || 'Hello Tej'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full py-3.5 bg-emerald-600 text-white text-xs uppercase tracking-widest font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    Open WhatsApp Chat
                  </a>
                </div>
              )}
            </div>

            {/* Right Column: Message Form */}
            <div className="lg:col-span-7 bg-white border border-sand-200 p-8 sm:p-12 shadow-sm">
              <h3 className="font-serif text-2xl sm:text-3xl text-noir font-normal mb-2">
                Send an Inquiry Message
              </h3>
              <p className="text-xs text-sand-600 font-light mb-8">
                Please leave your details below and our concierge will respond within 24 hours.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl text-noir">Thank You</h4>
                  <p className="text-xs text-sand-600 max-w-sm mx-auto leading-relaxed">
                    Your inquiry has been received by our studio. We look forward to connecting with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Aisha Kapoor"
                      className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="aisha@example.com"
                        className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Message / Inquiry Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please let us know about your event dates, venue location, or styling questions..."
                      className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-noir text-ivory text-xs uppercase tracking-ultra font-medium hover:bg-champagne-600 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Sending Inquiry...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
