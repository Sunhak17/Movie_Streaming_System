import React, { useState, useEffect } from 'react';

const EditMovieModal = ({ movie, isOpen, onClose, onSave, genres }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    rating: '',
    category: 'cdrama',
    release_year: '',
    genre_id: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (movie && isOpen) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        image: movie.image || '',
        rating: movie.rating || '',
        category: movie.category || 'cdrama',
        release_year: movie.release_year || '',
        genre_id: movie.genre_id || ''
      });
      setError('');
    }
  }, [movie, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        rating: formData.rating ? parseFloat(formData.rating) : null,
        category: formData.category.toLowerCase(),
        release_year: formData.release_year ? parseInt(formData.release_year) : null
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save movie');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/8 pb-4">
          <h3 className="text-xl font-bold text-slate-50">Edit Movie</h3>
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-rose-400" onClick={onClose}>×</button>
        </div>

        <div className="grid gap-4">
          {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Movie title"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Movie description"
              rows="4"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="0-10"
                min="0"
                max="10"
                step="0.1"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 outline-none appearance-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              >
                <option value="cdrama" className="bg-slate-900 text-slate-100">C-Drama</option>
                <option value="kdrama" className="bg-slate-900 text-slate-100">K-Drama</option>
                <option value="hollywood" className="bg-slate-900 text-slate-100">Hollywood</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Release Year</label>
              <input
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 5}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>
          </div>

          {genres.length > 0 && (
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Genre</label>
              <select
                name="genre_id"
                value={formData.genre_id}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 outline-none appearance-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              >
                <option value="" className="bg-slate-900 text-slate-100">Select Genre</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id} className="bg-slate-900 text-slate-100">{g.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/8 pt-4">
          <button 
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5" 
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMovieModal;
