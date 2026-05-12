import React from 'react';
import StatCard from '../../../../../components/StatCard/StatCard';
import { HiOutlineFilm, HiOutlineShieldCheck, HiOutlineUserGroup } from 'react-icons/hi2';

const DashboardOverview = ({ loading, stats, movies, getGenreName }) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-50">Key Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading || !stats ? (
            <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-6 text-sm text-slate-400">Loading...</div>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                change={`${stats.newUsers} new last 30 days`}
                changeType="positive"
                icon={<HiOutlineUserGroup className="h-6 w-6 text-emerald-300" />}
              />
              <StatCard
                title="Active Users"
                value={stats.activeUsers}
                change="Currently active"
                changeType="positive"
                icon={<HiOutlineUserGroup className="h-6 w-6 text-emerald-300" />}
              />
              <StatCard
                title="Total Movies"
                value={movies.length}
                change="In library"
                changeType="positive"
                icon={<HiOutlineFilm className="h-6 w-6 text-cyan-300" />}
              />
              <StatCard
                title="Admin Users"
                value={stats.adminUsers}
                change="System administrators"
                changeType="neutral"
                icon={<HiOutlineShieldCheck className="h-6 w-6 text-slate-300" />}
              />
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-slate-900/80 p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-50">Recent Movies</h3>
            <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-emerald-300" type="button">⋮</button>
          </div>
          {loading ? (
            <div className="py-5 text-sm text-slate-400">Loading movies...</div>
          ) : movies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                    <th className="px-2 py-3">Title</th>
                    <th className="px-2 py-3">Genre</th>
                    <th className="px-2 py-3">Year</th>
                    <th className="px-2 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.slice(0, 5).map((movie) => (
                    <tr key={movie.id || movie.movie_id} className="border-b border-white/5">
                      <td className="px-2 py-3">{movie.title}</td>
                      <td className="px-2 py-3">{getGenreName(movie.genre_id)}</td>
                      <td className="px-2 py-3">{movie.release_year}</td>
                      <td className="px-2 py-3">⭐ {movie.rating || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-5 text-sm text-slate-500">No movies yet</div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;