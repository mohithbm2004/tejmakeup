import React, { useState, useEffect } from 'react';
import { User, Upload, Check, Sparkles, Award } from 'lucide-react';
import api from '../api/axios';

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    title: '',
    tagline: '',
    bio: '',
    paragraphsText: '',
    experienceYears: 8,
    eventsCompleted: 750,
    clientsSatisfied: 99,
    philosophy: '',
    signatureStyle: '',
    certificationsText: '',
    awardsText: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [secondaryImageFile, setSecondaryImageFile] = useState(null);
  const [secondaryImagePreview, setSecondaryImagePreview] = useState('');

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await api.get('/about/admin');
      const data = res.data || {};
      setForm({
        name: data.name || '',
        title: data.title || '',
        tagline: data.tagline || '',
        bio: data.bio || '',
        paragraphsText: Array.isArray(data.paragraphs) ? data.paragraphs.join('\n\n') : '',
        experienceYears: data.experienceYears || 8,
        eventsCompleted: data.eventsCompleted || 750,
        clientsSatisfied: data.clientsSatisfied || 99,
        philosophy: data.philosophy || '',
        signatureStyle: data.signatureStyle || '',
        certificationsText: Array.isArray(data.certifications) ? data.certifications.join('\n') : '',
        awardsText: Array.isArray(data.awards) ? data.awards.join('\n') : ''
      });
      setImagePreview(data.image || '');
      setSecondaryImagePreview(data.secondaryImage || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load about profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('title', form.title);
      data.append('tagline', form.tagline);
      data.append('bio', form.bio);
      data.append('paragraphs', form.paragraphsText);
      data.append('experienceYears', form.experienceYears);
      data.append('eventsCompleted', form.eventsCompleted);
      data.append('clientsSatisfied', form.clientsSatisfied);
      data.append('philosophy', form.philosophy);
      data.append('signatureStyle', form.signatureStyle);
      data.append('certifications', form.certificationsText);
      data.append('awards', form.awardsText);

      if (imageFile) data.append('image', imageFile);
      if (secondaryImageFile) data.append('secondaryImage', secondaryImageFile);

      await api.put('/about', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Artist profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
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
          Editorial Biography
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
          About Artist Profile
        </h1>
        <p className="text-xs text-sand-600 font-light mt-1">
          Update the artist story, credentials, accolades, and portrait imagery.
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

      <form onSubmit={handleSave} className="bg-white border border-sand-300 p-8 shadow-sm space-y-8">
        {/* Core Info */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            1. Core Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Artist Name *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Professional Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>
        </div>

        {/* Numerical Stats */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            2. Career Metrics & Experience
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Brides & Events Completed
              </label>
              <input
                type="number"
                value={form.eventsCompleted}
                onChange={(e) => setForm({ ...form, eventsCompleted: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Client Satisfaction (%)
              </label>
              <input
                type="number"
                value={form.clientsSatisfied}
                onChange={(e) => setForm({ ...form, clientsSatisfied: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
          </div>
        </div>

        {/* Bio and Narrative */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            3. Narrative & Philosophy
          </h3>
          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Short Bio Summary
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
              Full Story Paragraphs (Separate each paragraph with an empty line)
            </label>
            <textarea
              rows={6}
              value={form.paragraphsText}
              onChange={(e) => setForm({ ...form, paragraphsText: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Skin-First Philosophy
              </label>
              <textarea
                rows={3}
                value={form.philosophy}
                onChange={(e) => setForm({ ...form, philosophy: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Signature Style
              </label>
              <textarea
                rows={3}
                value={form.signatureStyle}
                onChange={(e) => setForm({ ...form, signatureStyle: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
              />
            </div>
          </div>
        </div>

        {/* Certifications & Awards */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            4. Credentials & Honors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Certifications (One per line)
              </label>
              <textarea
                rows={4}
                value={form.certificationsText}
                onChange={(e) => setForm({ ...form, certificationsText: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                Awards & Press (One per line)
              </label>
              <textarea
                rows={4}
                value={form.awardsText}
                onChange={(e) => setForm({ ...form, awardsText: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Artist Imagery */}
        <div className="space-y-4 pt-4 border-t border-sand-100">
          <h3 className="font-serif text-xl text-noir font-medium border-b border-sand-100 pb-2">
            5. Artist Portrait Photography
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium">
                Primary Founder Portrait
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Primary" className="w-16 h-20 object-cover border" />
                )}
                <label className="cursor-pointer px-3.5 py-2 bg-sand-200 hover:bg-sand-300 text-xs uppercase font-medium flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setImageFile(e.target.files[0]);
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium">
                Secondary Editorial Photo
              </label>
              <div className="flex items-center gap-4">
                {secondaryImagePreview && (
                  <img src={secondaryImagePreview} alt="Secondary" className="w-16 h-20 object-cover border" />
                )}
                <label className="cursor-pointer px-3.5 py-2 bg-sand-200 hover:bg-sand-300 text-xs uppercase font-medium flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSecondaryImageFile(e.target.files[0]);
                        setSecondaryImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-sand-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? 'Updating Profile...' : 'Save Artist Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;
