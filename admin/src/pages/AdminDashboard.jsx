import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Image,
  Sparkles,
  MessageSquare,
  CalendarCheck,
  Plus,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Eye
} from 'lucide-react';
import api from '../api/axios';
import { TableSkeleton } from '../components/LoadingSkeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data);
      } catch (err) {
        console.warn('Failed to load stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-ultra text-champagne-700 font-semibold block">
            Executive Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-noir font-normal">
            Atelier Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-noir text-ivory text-xs uppercase tracking-widest font-medium hover:bg-champagne-600 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Portfolio Look</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-sand-300 text-noir text-xs uppercase tracking-widest font-medium hover:border-champagne-500 transition-colors"
          >
            <span>View All Bookings</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/70 border border-sand-200 animate-pulse p-6" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* New Bookings Card */}
          <div className="bg-white border border-sand-300 p-6 shadow-sm hover:border-champagne-500 transition-colors">
            <div className="flex items-center justify-between text-sand-500 mb-3">
              <span className="text-[10px] uppercase tracking-ultra font-semibold text-champagne-700">
                Inquiries
              </span>
              <CalendarCheck className="w-5 h-5 text-champagne-600" />
            </div>
            <p className="font-serif text-3xl text-noir font-normal">
              {stats?.bookings?.new || 0}
            </p>
            <div className="flex items-center justify-between text-xs text-sand-600 mt-2">
              <span>{stats?.bookings?.total || 0} Total Bookings</span>
              <span className="text-emerald-700 font-medium">
                {stats?.bookings?.confirmed || 0} Confirmed
              </span>
            </div>
          </div>

          {/* Portfolio Card */}
          <div className="bg-white border border-sand-300 p-6 shadow-sm hover:border-champagne-500 transition-colors">
            <div className="flex items-center justify-between text-sand-500 mb-3">
              <span className="text-[10px] uppercase tracking-ultra font-semibold text-champagne-700">
                Portfolio
              </span>
              <Image className="w-5 h-5 text-champagne-600" />
            </div>
            <p className="font-serif text-3xl text-noir font-normal">
              {stats?.portfolio?.total || 0}
            </p>
            <div className="flex items-center justify-between text-xs text-sand-600 mt-2">
              <span>{stats?.portfolio?.published || 0} Live</span>
              <span className="text-champagne-700 font-medium">
                {stats?.portfolio?.featured || 0} Featured
              </span>
            </div>
          </div>

          {/* Services Card */}
          <div className="bg-white border border-sand-300 p-6 shadow-sm hover:border-champagne-500 transition-colors">
            <div className="flex items-center justify-between text-sand-500 mb-3">
              <span className="text-[10px] uppercase tracking-ultra font-semibold text-champagne-700">
                Services
              </span>
              <Sparkles className="w-5 h-5 text-champagne-600" />
            </div>
            <p className="font-serif text-3xl text-noir font-normal">
              {stats?.services?.total || 0}
            </p>
            <div className="flex items-center justify-between text-xs text-sand-600 mt-2">
              <span>{stats?.services?.published || 0} Active Offerings</span>
              <span>{stats?.services?.featured || 0} Featured</span>
            </div>
          </div>

          {/* Testimonials Card */}
          <div className="bg-white border border-sand-300 p-6 shadow-sm hover:border-champagne-500 transition-colors">
            <div className="flex items-center justify-between text-sand-500 mb-3">
              <span className="text-[10px] uppercase tracking-ultra font-semibold text-champagne-700">
                Reviews
              </span>
              <MessageSquare className="w-5 h-5 text-champagne-600" />
            </div>
            <p className="font-serif text-3xl text-noir font-normal">
              {stats?.testimonials?.total || 0}
            </p>
            <div className="flex items-center justify-between text-xs text-sand-600 mt-2">
              <span>{stats?.testimonials?.published || 0} Endorsements</span>
              <span>5.0 Rating Avg</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Inquiries Section */}
      <div className="bg-white border border-sand-300 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-sand-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl text-noir font-normal">Recent Inquiries</h2>
            <p className="text-xs text-sand-600 font-light mt-0.5">
              Latest client submissions requiring review or follow-up
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs uppercase tracking-widest text-champagne-700 hover:text-noir font-semibold flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : !stats?.recentBookings || stats.recentBookings.length === 0 ? (
          <p className="text-xs text-sand-500 py-6 text-center">No recent inquiries.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 text-sand-500 uppercase tracking-widest text-[10px]">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Date & Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Instant Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {stats.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-sand-50/60 transition-colors">
                    <td className="py-4 px-4 font-medium text-noir">
                      <p className="font-serif text-sm">{b.name}</p>
                      <p className="text-[11px] text-sand-500">{b.phone}</p>
                    </td>
                    <td className="py-4 px-4 text-sand-700">{b.eventType}</td>
                    <td className="py-4 px-4 text-sand-700">
                      <p>
                        {new Date(b.eventDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-[11px] text-sand-500">{b.location}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                          b.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-sand-200 text-sand-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {b.phone && (
                          <>
                            <a
                              href={`tel:${b.phone}`}
                              className="p-1.5 text-sand-600 hover:text-noir hover:bg-sand-200 rounded"
                              title="Call Client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                              title="WhatsApp Client"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}
                        {b.email && (
                          <a
                            href={`mailto:${b.email}`}
                            className="p-1.5 text-sand-600 hover:text-noir hover:bg-sand-200 rounded"
                            title="Email Client"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
