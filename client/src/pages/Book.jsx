import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, CheckCircle2, MessageCircle, Sparkles, MapPin, User, Phone, Mail, Clock, Users, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import SEO from '../components/SEO';

const Book = () => {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';
  const preselectedLook = searchParams.get('look') || '';

  const [availableServices, setAvailableServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: preselectedLook ? 'Bridal' : 'Bridal',
    eventDate: '',
    location: '',
    preferredTime: '',
    people: 1,
    services: preselectedService ? [preselectedService] : [],
    budget: '',
    message: preselectedLook ? `Inquiring about recreating the "${preselectedLook}" aesthetic.` : ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setAvailableServices(res.data);
      } catch (err) {
        console.warn('Failed to load services:', err.message);
      }
    };
    fetchServices();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name (minimum 2 characters)';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errs.phone = 'Please provide a valid phone number';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format';
    }
    if (!formData.eventType) {
      errs.eventType = 'Please select an event type';
    }
    if (!formData.eventDate) {
      errs.eventDate = 'Please select an event date';
    }
    if (!formData.location.trim()) {
      errs.location = 'Please provide an event location / venue city';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleServiceToggle = (srvTitle) => {
    setFormData((prev) => {
      const exists = prev.services.includes(srvTitle);
      return {
        ...prev,
        services: exists ? prev.services.filter((s) => s !== srvTitle) : [...prev.services, srvTitle]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post('/bookings', formData);
      setSubmittedBooking(res.data);
      window.scrollTo(0, 0);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Failed to submit booking inquiry' });
    } finally {
      setLoading(false);
    }
  };

  // Construct WhatsApp prefilled message
  const getWhatsAppUrl = () => {
    if (!submittedBooking) return '#';
    const cleanNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');
    const dateFormatted = new Date(submittedBooking.eventDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const msg = `Hi Tej! ✨ I just submitted an inquiry for my ${submittedBooking.eventType} on ${dateFormatted} in ${submittedBooking.location}. 

Name: ${submittedBooking.name}
Phone: ${submittedBooking.phone}
${submittedBooking.services?.length ? `Services: ${submittedBooking.services.join(', ')}` : ''}

I would love to confirm your availability and discuss next steps!`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      <SEO
        title="Reserve Your Date & Private Consultation"
        description="Check date availability and reserve bespoke bridal styling with Tej Makeup Artistry."
      />

      <div className="pt-32 pb-24 bg-ivory-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-ultra text-champagne-600 font-semibold block">
              Bespoke Reservations
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-noir font-normal">
              Reserve Your Celebration Date
            </h1>
            <p className="text-sand-600 text-xs sm:text-sm font-light leading-relaxed">
              Kindly share your event vision below. Once submitted, connect instantly with our WhatsApp concierge to fast-track your confirmation.
            </p>
          </div>

          {/* Submission Success View */}
          {submittedBooking ? (
            <div className="bg-white border border-champagne-400 p-8 md:p-14 shadow-xl text-center space-y-8 animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-champagne-100 border border-champagne-300 flex items-center justify-center mx-auto text-champagne-700 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold">
                  ENQUIRY CONFIRMATION
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
                  Thank you. Your enquiry has been received.
                </h2>
                <p className="text-sand-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-light">
                  We look forward to curating your bespoke beauty experience for{' '}
                  <span className="font-medium text-noir">
                    {submittedBooking.eventType} on{' '}
                    {new Date(submittedBooking.eventDate).toLocaleDateString()}
                  </span>{' '}
                  in {submittedBooking.location}.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-6 bg-sand-50 border border-sand-200 text-left max-w-md mx-auto space-y-2 text-xs text-sand-700">
                <p>
                  <strong className="text-noir font-medium">Guest:</strong> {submittedBooking.name}
                </p>
                <p>
                  <strong className="text-noir font-medium">Phone:</strong> {submittedBooking.phone}
                </p>
                <p>
                  <strong className="text-noir font-medium">Location:</strong> {submittedBooking.location}
                </p>
                {submittedBooking.services?.length > 0 && (
                  <p>
                    <strong className="text-noir font-medium">Services Required:</strong> {submittedBooking.services.join(', ')}
                  </p>
                )}
              </div>

              {/* Crucial WhatsApp Button as specified in prompt */}
              <div className="space-y-4 pt-4 border-t border-sand-200 max-w-md mx-auto">
                <p className="text-xs text-sand-700 font-medium">
                  Connect immediately with our concierge:
                </p>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs uppercase tracking-[0.2em] font-semibold shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                  <span>CONTINUE ON WHATSAPP</span>
                </a>
                <Link
                  to="/portfolio"
                  className="inline-block text-xs uppercase tracking-widest text-sand-600 hover:text-noir transition-colors pt-2"
                >
                  Return to Portfolio
                </Link>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="bg-white border border-sand-200 p-5 sm:p-8 md:p-14 shadow-sm space-y-6 sm:space-y-8">
              {errors.form && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errors.form}
                </div>
              )}

              {/* 1. Client Basic Details */}
              <div className="space-y-6">
                <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-3">
                  1. Personal & Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aisha Kapoor"
                      className={`w-full px-4 py-3 bg-sand-50/50 border ${
                        errors.name ? 'border-red-400' : 'border-sand-300'
                      } text-xs focus:outline-none focus:border-champagne-500`}
                    />
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full px-4 py-3 bg-sand-50/50 border ${
                        errors.phone ? 'border-red-400' : 'border-sand-300'
                      } text-xs focus:outline-none focus:border-champagne-500`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aisha@example.com"
                    className={`w-full px-4 py-3 bg-sand-50/50 border ${
                      errors.email ? 'border-red-400' : 'border-sand-300'
                    } text-xs focus:outline-none focus:border-champagne-500`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* 2. Event Specifications */}
              <div className="space-y-6 pt-6 border-t border-sand-100">
                <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-3">
                  2. Celebration Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Event Type *
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500"
                    >
                      <option value="Bridal">Bridal Wedding Ceremony</option>
                      <option value="Reception">Royal Reception / Sangeet</option>
                      <option value="Engagement">Pre-Wedding / Engagement</option>
                      <option value="Destination Wedding">Multi-Day Destination Wedding</option>
                      <option value="Editorial & Fashion">Editorial / Commercial Shoot</option>
                      <option value="Masterclass">Private 1-on-1 Masterclass</option>
                      <option value="Party Glamour">Party & Red Carpet Glam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className={`w-full px-4 py-3 bg-sand-50/50 border ${
                        errors.eventDate ? 'border-red-400' : 'border-sand-300'
                      } text-xs focus:outline-none focus:border-champagne-500`}
                    />
                    {errors.eventDate && <p className="text-[11px] text-red-600 mt-1">{errors.eventDate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Location / Venue City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Taj Lake Palace, Udaipur or Mumbai"
                      className={`w-full px-4 py-3 bg-sand-50/50 border ${
                        errors.location ? 'border-red-400' : 'border-sand-300'
                      } text-xs focus:outline-none focus:border-champagne-500`}
                    />
                    {errors.location && <p className="text-[11px] text-red-600 mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="text"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      placeholder="e.g. 06:00 AM start"
                      className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Number of People to be Styled
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={formData.people}
                      onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-2">
                      Estimated Budget Range
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. ₹35,000 - ₹50,000"
                      className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Services Selection */}
              {availableServices.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-sand-100">
                  <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-3">
                    3. Select Services of Interest
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableServices.map((srv) => {
                      const isSelected = formData.services.includes(srv.title);
                      return (
                        <div
                          key={srv._id}
                          onClick={() => handleServiceToggle(srv.title)}
                          className={`p-4 border cursor-pointer transition-all flex items-start gap-3 select-none ${
                            isSelected
                              ? 'bg-champagne-50 border-champagne-600 shadow-sm'
                              : 'bg-sand-50/40 border-sand-200 hover:border-sand-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-0.5 accent-champagne-600 cursor-pointer"
                          />
                          <div>
                            <p className="text-xs font-medium text-noir">{srv.title}</p>
                            {srv.price && (
                              <p className="text-[10px] text-champagne-700 font-semibold">{srv.price}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Notes / Vision */}
              <div className="space-y-4 pt-6 border-t border-sand-100">
                <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-3">
                  4. Artistic Vision & Special Requirements
                </h3>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your attire colors, skin preferences, veil draping requirements, or reference looks..."
                  className="w-full px-4 py-3 bg-sand-50/50 border border-sand-300 text-xs focus:outline-none focus:border-champagne-500"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-noir text-ivory text-xs uppercase tracking-[0.25em] font-medium hover:bg-champagne-600 transition-colors shadow-lg disabled:opacity-50"
              >
                {loading ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Book;
