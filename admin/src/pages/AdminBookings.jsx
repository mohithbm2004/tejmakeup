import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Trash2,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { TableSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = ['All', 'New', 'Contacted', 'Discussion', 'Confirmed', 'Completed', 'Cancelled'];

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings', {
        params: {
          status: statusFilter !== 'All' ? statusFilter : undefined,
          search: search || undefined
        }
      });
      setBookings(res.data || []);
    } catch (err) {
      console.warn('Failed to load bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await api.put(`/bookings/${id}`, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: res.data.status } : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently remove inquiry from "${name}"?`)) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  const getStatusColor = (st) => {
    switch (st) {
      case 'New':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Contacted':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Discussion':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Completed':
        return 'bg-sand-200 text-sand-800 border-sand-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-sand-100 text-sand-700 border-sand-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-champagne-700 font-semibold block">
            Client Registry
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
            Bridal Bookings & Inquiries
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 border border-sand-300 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, phone, location..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500"
          />
          <Search className="w-4 h-4 text-sand-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap border ${
                statusFilter === st
                  ? 'bg-noir text-ivory border-noir font-semibold shadow-sm'
                  : 'bg-sand-50 text-sand-700 border-sand-300 hover:border-champagne-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List / Cards */}
      {loading ? (
        <div className="bg-white p-6 border border-sand-300">
          <TableSkeleton rows={6} />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-sand-300 p-8">
          <EmptyState
            icon={CalendarCheck}
            title="No Bookings in this Category"
            description="There are currently no client inquiries matching this filter."
            actionText="View All Inquiries"
            onAction={() => setStatusFilter('All')}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const cleanPhone = b.phone ? b.phone.replace(/[^0-9]/g, '') : '';
            const waText = encodeURIComponent(
              `Hi ${b.name}, thank you for inquiring with Tej Makeup Artistry for your ${b.eventType} on ${new Date(
                b.eventDate
              ).toLocaleDateString()} in ${b.location}. We are thrilled to connect with you!`
            );
            const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

            return (
              <div
                key={b._id}
                className="bg-white border border-sand-300 p-6 sm:p-8 shadow-sm hover:border-sand-400 transition-all space-y-4"
              >
                {/* Header row: Client name, status dropdown & instant actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-2xl text-noir font-normal">{b.name}</h3>
                      <span className={`px-2.5 py-0.5 text-[10px] uppercase font-bold border ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-sand-500 mt-0.5">
                      Submitted on {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions: Call, WhatsApp, Email & Status Change */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Direct Contact Buttons */}
                    <div className="flex items-center gap-1.5 border-r border-sand-200 pr-3">
                      {b.phone && (
                        <a
                          href={`tel:${b.phone}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-noir text-xs rounded transition-colors font-medium"
                          title="Call Client"
                        >
                          <Phone className="w-3.5 h-3.5 text-champagne-700" />
                          <span>CALL</span>
                        </a>
                      )}
                      {b.phone && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs rounded transition-colors font-medium border border-emerald-200"
                          title="WhatsApp Client"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WHATSAPP</span>
                        </a>
                      )}
                      {b.email && (
                        <a
                          href={`mailto:${b.email}?subject=${encodeURIComponent(
                            `Tej Makeup Artistry - Consultation for your ${b.eventType}`
                          )}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-noir text-xs rounded transition-colors font-medium"
                          title="Email Client"
                        >
                          <Mail className="w-3.5 h-3.5 text-champagne-700" />
                          <span>EMAIL</span>
                        </a>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={b.status}
                      disabled={updatingId === b._id}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="px-3 py-1.5 text-xs bg-sand-50 border border-sand-300 focus:outline-none focus:border-champagne-500 font-medium"
                    >
                      {statuses.filter((s) => s !== 'All').map((s) => (
                        <option key={s} value={s}>
                          Mark as {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDelete(b._id, b.name)}
                      className="p-2 text-sand-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-sand-700 pt-2">
                  <div>
                    <span className="text-[10px] uppercase text-sand-400 font-semibold block">Event Type</span>
                    <p className="font-serif text-base text-noir mt-0.5">{b.eventType}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-sand-400 font-semibold block">Date & Timing</span>
                    <p className="text-noir font-medium mt-0.5">
                      {new Date(b.eventDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    {b.preferredTime && <p className="text-sand-500 text-[11px]">{b.preferredTime}</p>}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-sand-400 font-semibold block">Venue Location</span>
                    <p className="text-noir font-medium mt-0.5">{b.location}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-sand-400 font-semibold block">Guests & Budget</span>
                    <p className="text-noir font-medium mt-0.5">
                      {b.people || 1} Person(s) {b.budget ? `• ${b.budget}` : ''}
                    </p>
                  </div>
                </div>

                {/* Services & Client Message */}
                {(b.services?.length > 0 || b.message) && (
                  <div className="bg-sand-50/70 p-4 border border-sand-200/80 space-y-2 text-xs">
                    {b.services?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-champagne-800">
                          Requested Services:
                        </span>
                        {b.services.map((srv, i) => (
                          <span
                            key={i}
                            className="bg-white border border-sand-300 text-noir text-[11px] px-2 py-0.5 rounded"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    )}
                    {b.message && (
                      <p className="text-sand-700 italic font-light pt-1">
                        <strong className="text-noir not-italic font-medium">Notes:</strong> "{b.message}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
