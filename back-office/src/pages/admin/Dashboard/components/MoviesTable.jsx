import React, { useState, useEffect } from 'react';

const PAGE_SIZE = 15;

const MoviesTable = ({ movies, loading, searchTerm, setSearchTerm, getGenreName, onEditMovie }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [movies, searchTerm]);

  const sorted = React.useMemo(() => {
    if (!movies) return [];
    return [...movies].sort((a, b) => (Number(a.id || a.movie_id) || 0) - (Number(b.id || b.movie_id) || 0));
  }, [movies]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900/80 p-5 shadow-sm">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-emerald-400/20 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
        />
      </div>

      {loading ? (
        <div className="py-5 text-center text-sm text-slate-400">Loading movies...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm text-slate-200">
            <thead>
              <tr className="border-b border-emerald-400/15 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Image</th>
                <th className="px-3 py-3">Title</th>
                <th className="px-3 py-3">Genre</th>
                <th className="px-3 py-3">Year</th>
                <th className="px-3 py-3">Rating</th>
                <th className="px-3 py-3">Created</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? pageItems.map((m) => (
                <tr key={m.id || m.movie_id} className="border-b border-white/5">
                  <td className="px-3 py-3">{m.id || m.movie_id}</td>
                    <td className="px-3 py-3">
                      {m.image ? (
                        <img
                          src={m.image}
                          alt={m.title}
                          className="h-14 w-10 rounded-md object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-14 w-10 items-center justify-center rounded-md bg-white/5 text-[10px] text-slate-500">
                          No Img
                        </div>
                      )}
                    </td>
                  <td className="px-3 py-3">{m.title}</td>
                  <td className="px-3 py-3">{getGenreName(m.genre_id)}</td>
                  <td className="px-3 py-3">{m.release_year}</td>
                  <td className="px-3 py-3">⭐ {m.rating || 'N/A'}</td>
                  <td className="px-3 py-3">{m.created_at ? new Date(m.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => onEditMovie?.(m)}
                      className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-3 py-6 text-center text-sm text-slate-500">No movies found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
        <div>Showing {Math.min(sorted.length, (page - 1) * PAGE_SIZE + 1)}-{Math.min(sorted.length, page * PAGE_SIZE)} of {sorted.length}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded px-3 py-1 bg-white/5 disabled:opacity-40"
          >Prev</button>
          <div className="px-2">{page} / {totalPages}</div>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded px-3 py-1 bg-white/5 disabled:opacity-40"
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default MoviesTable;