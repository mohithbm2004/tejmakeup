import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image,
  Upload,
  Check,
  Star,
  Eye,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ExternalLink
} from 'lucide-react';
import api from '../api/axios';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const AdminPortfolio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form Fields
  const [form, setForm] = useState({
    title: '',
    category: 'Bridal',
    location: '',
    eventDate: '',
    description: '',
    featured: false,
    published: true,
    displayOrder: 0
  });

  // Images state in modal: both existing and new files
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // array of { file, preview }
  const [coverUrl, setCoverUrl] = useState('');

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/portfolio/admin/all', {
        params: { search, category: categoryFilter !== 'All' ? categoryFilter : undefined }
      });
      setItems(res.data.items || []);
    } catch (err) {
      console.warn('Failed to load portfolio items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      category: 'Bridal',
      location: '',
      eventDate: '',
      description: '',
      featured: false,
      published: true,
      displayOrder: items.length + 1
    });
    setExistingImages([]);
    setNewFiles([]);
    setCoverUrl('');
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category || 'Bridal',
      location: item.location || '',
      eventDate: item.eventDate ? item.eventDate.split('T')[0] : '',
      description: item.description || '',
      featured: !!item.featured,
      published: item.published !== false,
      displayOrder: item.displayOrder || 0
    });
    setExistingImages(item.images || []);
    setNewFiles([]);
    setCoverUrl(item.coverImage || item.images?.[0]?.url || '');
    setModalError('');
    setModalOpen(true);
  };

  // Handle multi-image file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setNewFiles((prev) => [...prev, ...newItems]);
    if (!coverUrl && newItems.length > 0) {
      setCoverUrl(newItems[0].preview);
    }
  };

  const removeExistingImage = (idx) => {
    const removed = existingImages[idx];
    const updated = existingImages.filter((_, i) => i !== idx);
    setExistingImages(updated);
    if (coverUrl === removed.url) {
      setCoverUrl(updated[0]?.url || newFiles[0]?.preview || '');
    }
  };

  const removeNewFile = (idx) => {
    const removed = newFiles[idx];
    const updated = newFiles.filter((_, i) => i !== idx);
    setNewFiles(updated);
    if (coverUrl === removed.preview) {
      setCoverUrl(existingImages[0]?.url || updated[0]?.preview || '');
    }
  };

  // Move image reordering
  const moveImage = (index, direction, listType) => {
    if (listType === 'existing') {
      const target = index + direction;
      if (target < 0 || target >= existingImages.length) return;
      const copy = [...existingImages];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      setExistingImages(copy);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (idx) => setDraggedIndex(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (draggedIndex === null || draggedIndex === idx) return;
    const copy = [...existingImages];
    const item = copy.splice(draggedIndex, 1)[0];
    copy.splice(idx, 0, item);
    setExistingImages(copy);
    setDraggedIndex(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setModalError('Project title is required');
      return;
    }

    if (existingImages.length === 0 && newFiles.length === 0) {
      setModalError('Please upload at least one image for this portfolio look');
      return;
    }

    setSaving(true);
    setModalError('');

    try {
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('category', form.category);
      data.append('location', form.location);
      data.append('eventDate', form.eventDate);
      data.append('description', form.description);
      data.append('featured', form.featured);
      data.append('published', form.published);
      data.append('displayOrder', form.displayOrder);

      // Reordered existing images array
      data.append('existingImages', JSON.stringify(existingImages));
      data.append('images', JSON.stringify(existingImages));

      if (coverUrl && !coverUrl.startsWith('blob:')) {
        data.append('coverImage', coverUrl);
      }

      // Append new files
      newFiles.forEach((item) => {
        data.append('images', item.file);
      });

      if (editingItem) {
        await api.put(`/portfolio/${editingItem._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/portfolio', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setModalOpen(false);
      fetchItems();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save portfolio look');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await api.delete(`/portfolio/${id}`);
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete portfolio item');
    }
  };

  const togglePublish = async (item) => {
    try {
      const updated = !item.published;
      await api.put(`/portfolio/${item._id}`, { published: updated });
      setItems((prev) => prev.map((it) => (it._id === item._id ? { ...it, published: updated } : it)));
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const toggleFeatured = async (item) => {
    try {
      const updated = !item.featured;
      await api.put(`/portfolio/${item._id}`, { featured: updated });
      setItems((prev) => prev.map((it) => (it._id === item._id ? { ...it, featured: updated } : it)));
    } catch (err) {
      alert('Failed to toggle featured status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & New Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-champagne-700 font-semibold block">
            Visual Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
            Portfolio Management
          </h1>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Portfolio Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 border border-sand-300 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by look title..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
          />
          <Search className="w-4 h-4 text-sand-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'Bridal', 'Reception', 'Engagement', 'Editorial', 'Glamour'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap border ${
                categoryFilter === cat
                  ? 'bg-noir text-ivory border-noir'
                  : 'bg-sand-50 text-sand-700 border-sand-300 hover:border-champagne-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white border border-sand-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Image}
            title="No Portfolio Items"
            description="No looks match your current search or filter. Create your first portfolio project to showcase on the client site."
            actionText="Create Portfolio Look"
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50/70 text-sand-500 uppercase tracking-widest text-[10px]">
                  <th className="py-3.5 px-4 w-20">Look</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4 text-center">Published</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 bg-sand-200 overflow-hidden border border-sand-300">
                        <img
                          src={item.coverImage || item.images?.[0]?.url}
                          alt={item.title}
                          className="w-full h-full object-cover object-[center_20%] face-align"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-serif text-base text-noir font-medium">{item.title}</p>
                      <p className="text-[11px] text-sand-500">
                        {item.images?.length || 0} images {item.location ? `• ${item.location}` : ''}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sand-700">
                      <span className="px-2 py-0.5 bg-sand-100 text-sand-700 text-[10px] uppercase tracking-wider font-semibold border border-sand-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(item)}
                        className={`p-1.5 rounded transition-colors ${
                          item.featured
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-sand-300 hover:text-sand-500'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => togglePublish(item)}
                        className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded ${
                          item.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sand-200 text-sand-600'
                        }`}
                      >
                        {item.published ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={`/portfolio/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-sand-500 hover:text-noir"
                          title="Preview Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-sand-500 hover:text-champagne-600"
                          title="Edit Look"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          className="p-1.5 text-sand-500 hover:text-red-600"
                          title="Delete Look"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-noir/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-sand-300 w-full max-w-3xl my-8 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-champagne-600 font-semibold block">
                  {editingItem ? 'Edit Project' : 'New Project'}
                </span>
                <h3 className="font-serif text-2xl text-noir font-normal">
                  {editingItem ? editingItem.title : 'Add Portfolio Look'}
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
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Look Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Royal Amber Palace Bride"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  >
                    <option value="Bridal">Bridal</option>
                    <option value="Reception">Reception</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Editorial">Editorial</option>
                    <option value="Glamour">Glamour</option>
                    <option value="Sangeet">Sangeet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium mb-1.5">
                  Description / Artistry Details
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the skincare infusion, eye palette, and couture draping details..."
                  className="w-full px-3 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
                />
              </div>

              {/* Multi-Image Upload Area with Drag-and-Drop / Reordering & Cover Selection */}
              <div className="space-y-3 pt-4 border-t border-sand-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-sand-700 font-medium">
                      Project Images (Multi-Upload, Drag to Reorder, Select Cover)
                    </label>
                    <p className="text-[11px] text-sand-500">
                      Drag cards or use arrow buttons to reorder. Click "Make Cover" to select primary photo.
                    </p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-sand-200 hover:bg-sand-300 text-noir text-xs uppercase tracking-wider font-medium">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Existing Images Reordering Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {existingImages.map((img, idx) => {
                    const isCover = coverUrl === img.url;
                    return (
                      <div
                        key={img.publicId || idx}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                        className={`relative aspect-square border-2 rounded overflow-hidden group bg-sand-100 cursor-move ${
                          isCover ? 'border-champagne-600 ring-2 ring-champagne-300' : 'border-sand-300'
                        }`}
                      >
                        <img src={img.url} alt={`Look ${idx}`} className="w-full h-full object-cover object-[center_20%] face-align" />
                        
                        {/* Badges & Reorder Controls */}
                        <div className="absolute top-1 left-1 flex items-center gap-1">
                          {isCover && (
                            <span className="bg-champagne-600 text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold">
                              Cover
                            </span>
                          )}
                          <span className="bg-noir/60 text-white text-[9px] px-1 py-0.5">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Hover Overlay with actions */}
                        <div className="absolute inset-0 bg-noir/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-white">
                          <button
                            type="button"
                            onClick={() => setCoverUrl(img.url)}
                            className="text-[10px] uppercase tracking-wider bg-champagne-600 px-2 py-1 font-semibold hover:bg-champagne-500"
                          >
                            Make Cover
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveImage(idx, -1, 'existing')}
                              disabled={idx === 0}
                              className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30"
                              title="Move Left"
                            >
                              <ArrowUp className="w-3.5 h-3.5 -rotate-90" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(idx, 1, 'existing')}
                              disabled={idx === existingImages.length - 1}
                              className="p-1 bg-white/20 hover:bg-white/40 disabled:opacity-30"
                              title="Move Right"
                            >
                              <ArrowDown className="w-3.5 h-3.5 -rotate-90" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExistingImage(idx)}
                              className="p-1 bg-red-600 hover:bg-red-700"
                              title="Delete Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* New Files Preview Grid */}
                  {newFiles.map((item, idx) => {
                    const isCover = coverUrl === item.preview;
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-square border-2 border-dashed rounded overflow-hidden group bg-sand-100 ${
                          isCover ? 'border-champagne-600 ring-2 ring-champagne-300' : 'border-sand-400'
                        }`}
                      >
                        <img src={item.preview} alt={`New ${idx}`} className="w-full h-full object-cover object-[center_20%] face-align" />
                        <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] uppercase px-1.5 py-0.5">
                          New
                        </span>
                        <div className="absolute inset-0 bg-noir/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-white">
                          <button
                            type="button"
                            onClick={() => setCoverUrl(item.preview)}
                            className="text-[10px] uppercase tracking-wider bg-champagne-600 px-2 py-1 font-semibold"
                          >
                            Make Cover
                          </button>
                          <button
                            type="button"
                            onClick={() => removeNewFile(idx)}
                            className="p-1 bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-sand-200 flex flex-wrap items-center gap-6 text-xs text-sand-800">
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
                  <span>Featured Look (Homepage)</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  {saving ? 'Uploading & Saving...' : 'Save Portfolio Look'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
