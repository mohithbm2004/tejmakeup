import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, Star, Upload, X } from 'lucide-react';
import api from '../api/axios';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const [form, setForm] = useState({
    clientName: '',
    role: 'Bride',
    content: '',
    rating: 5,
    location: '',
    eventDate: '',
    displayOrder: 0,
    published: true,
    featured: false
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials/admin/all');
      setTestimonials(res.data.items || []);
    } catch (err) {
      console.warn('Failed to load testimonials:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      clientName: '',
      role: 'Bride',
      content: '',
      rating: 5,
      location: '',
      eventDate: '',
      displayOrder: testimonials.length + 1,
      published: true,
      featured: false
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingItem(t);
    setForm({
      clientName: t.clientName,
      role: t.role || 'Bride',
      content: t.content || '',
      rating: t.rating || 5,
      location: t.location || '',
      eventDate: t.eventDate ? t.eventDate.split('T')[0] : '',
      displayOrder: t.displayOrder || 0,
      published: t.published !== false,
      featured: !!t.featured
    });
    setAvatarFile(null);
    setAvatarPreview(t.avatar || '');
    setModalError('');
    setModalOpen(true);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.content.trim()) {
      setModalError('Client name and review content are required');
      return;
    }

    setSaving(true);
    setModalError('');

    try {
      const data = new FormData();
      data.append('clientName', form.clientName.trim());
      data.append('role', form.role);
      data.append('content', form.content);
      data.append('rating', form.rating);
      data.append('location', form.location);
      data.append('eventDate', form.eventDate);
      data.append('displayOrder', form.displayOrder);
      data.append('published', form.published);
      data.append('featured', form.featured);

      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      if (editingItem) {
        await api.put(`/testimonials/${editingItem._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/testimonials', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await api.delete(`/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-champagne-700 font-semibold block">
            Endorsements
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
            Client Testimonials
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-sand-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : testimonials.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No Testimonials"
            description="Add genuine quotes and client feedback from previous weddings and campaigns."
            actionText="Add Review"
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50/70 text-sand-500 uppercase tracking-widest text-[10px]">
                  <th className="py-3.5 px-4 w-16">Client</th>
                  <th className="py-3.5 px-4">Review Story</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-3 px-4">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.clientName}
                          className="w-10 h-10 rounded-full object-cover border border-sand-300"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-champagne-100 text-champagne-800 font-serif font-bold flex items-center justify-center">
                          {t.clientName.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-serif text-base text-noir font-medium">{t.clientName}</p>
                      <p className="text-[11px] text-champagne-700 font-medium">{t.role}</p>
                      <p className="text-sand-600 line-clamp-2 mt-1 italic font-light">"{t.content}"</p>
                    </td>
                    <td className="py-3 px-4 text-sand-700 whitespace-nowrap">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sand-600">{t.location || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                          t.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sand-200 text-sand-600'
                        }`}
                      >
                        {t.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 text-sand-500 hover:text-champagne-600"
                          title="Edit Review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id, t.clientName)}
                          className="p-1.5 text-sand-500 hover:text-red-600"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-noir/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-sand-300 w-full max-w-xl my-8 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <h3 className="font-serif text-2xl text-noir font-normal">
                {editingItem ? 'Edit Review' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-sand-400 hover:text-noir">
                <X className="w-6 h-6" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="e.g. Aisha Kapoor"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1">
                    Role / Context
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Bride, Udaipur Wedding"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1">
                    Rating (Stars 1-5)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Udaipur & London"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1">
                  Testimonial Quote / Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Share what the bride loved about her experience, skin radiance, or punctuality..."
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium">
                  Client Photo / Avatar
                </label>
                <div className="flex items-center gap-3">
                  {avatarPreview && (
                    <img src={avatarPreview} alt="Avatar" className="w-12 h-12 rounded-full object-cover border" />
                  )}
                  <label className="cursor-pointer px-3 py-1.5 bg-sand-200 hover:bg-sand-300 text-noir text-xs uppercase tracking-wider font-medium flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-6 text-xs text-sand-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="accent-champagne-600"
                  />
                  <span>Published Live</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-champagne-600"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-sand-200 text-sand-800 text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
