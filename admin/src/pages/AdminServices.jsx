import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Upload, X, Star, Clock } from 'lucide-react';
import api from '../api/axios';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'Bridal',
    tagline: '',
    description: '',
    featuresText: '',
    duration: '2-3 hours',
    price: '',
    displayOrder: 0,
    published: true,
    featured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services/admin/all');
      setServices(res.data.items || []);
    } catch (err) {
      console.warn('Failed to load services:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      category: 'Bridal',
      tagline: '',
      description: '',
      featuresText: '',
      duration: '2.5 - 3 hours',
      price: 'From ₹25,000',
      displayOrder: services.length + 1,
      published: true,
      featured: false
    });
    setImageFile(null);
    setImagePreview('');
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingItem(s);
    setForm({
      title: s.title,
      category: s.category || 'Bridal',
      tagline: s.tagline || '',
      description: s.description || '',
      featuresText: Array.isArray(s.features) ? s.features.join('\n') : '',
      duration: s.duration || '',
      price: s.price || '',
      displayOrder: s.displayOrder || 0,
      published: s.published !== false,
      featured: !!s.featured
    });
    setImageFile(null);
    setImagePreview(s.image || '');
    setModalError('');
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setModalError('Service title is required');
      return;
    }

    setSaving(true);
    setModalError('');

    try {
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('category', form.category);
      data.append('tagline', form.tagline);
      data.append('description', form.description);
      data.append('features', form.featuresText);
      data.append('duration', form.duration);
      data.append('price', form.price);
      data.append('displayOrder', form.displayOrder);
      data.append('published', form.published);
      data.append('featured', form.featured);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingItem) {
        await api.put(`/services/${editingItem._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/services', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalOpen(false);
      fetchServices();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-champagne-700 font-semibold block">
            Offerings Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
            Services Management
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-sand-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No Services Found"
            description="Create your first bespoke makeup offering to display on your pricing and services page."
            actionText="Create Service"
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50/70 text-sand-500 uppercase tracking-widest text-[10px]">
                  <th className="py-3.5 px-4 w-20">Cover</th>
                  <th className="py-3.5 px-4">Service Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Duration & Price</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {services.map((s) => (
                  <tr key={s._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 bg-sand-200 overflow-hidden border border-sand-300">
                        {s.image ? (
                          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sand-400">
                            <Sparkles className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-serif text-base text-noir font-medium">{s.title}</p>
                      {s.tagline && <p className="text-[11px] text-sand-500 italic">"{s.tagline}"</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-sand-100 text-sand-700 text-[10px] uppercase font-semibold border border-sand-200">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sand-700">
                      <p className="font-serif text-sm text-noir font-medium">{s.price || 'Upon Request'}</p>
                      <p className="text-[11px] text-sand-500">{s.duration}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                          s.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sand-200 text-sand-600'
                        }`}
                      >
                        {s.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-sand-500 hover:text-champagne-600"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id, s.title)}
                          className="p-1.5 text-sand-500 hover:text-red-600"
                          title="Delete Service"
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

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-noir/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-sand-300 w-full max-w-2xl my-8 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold block">
                  {editingItem ? 'Edit Service' : 'New Service'}
                </span>
                <h3 className="font-serif text-2xl text-noir font-normal">
                  {editingItem ? editingItem.title : 'Create Offering'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-sand-400 hover:text-noir">
                <X className="w-6 h-6" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Haute Couture Bridal Artistry"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Bridal, Reception, Editorial"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                  Tagline (Catchphrase)
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="e.g. The quintessential transformation for the modern royal bride."
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 3.5 - 4 Hours"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Price / Investment
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. From ₹35,000 / $450"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the luxury experience and skin prep details..."
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                  Included Features (One feature per line)
                </label>
                <textarea
                  rows={4}
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  placeholder="Luxury skincare prep (Augustinus Bader & La Mer)&#10;Individual mink-feel lash couture mapping&#10;Dupattā & heirloom jewelry placement"
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500 font-mono text-[11px]"
                />
              </div>

              {/* Service Cover Image */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium">
                  Service Cover Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover border border-sand-300 rounded"
                    />
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-sand-200 hover:bg-sand-300 text-noir text-xs uppercase tracking-wider font-medium flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-sand-200 flex items-center gap-6 text-xs text-sand-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="accent-champagne-600"
                  />
                  <span>Published on Live Site</span>
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

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-sand-200 text-sand-800 text-xs uppercase tracking-wider hover:bg-sand-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
