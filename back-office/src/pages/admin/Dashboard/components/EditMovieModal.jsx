import React, { useState, useEffect } from 'react';
import './EditMovieModal.css';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Movie</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Movie title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Movie description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="0-10"
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="cdrama">C-Drama</option>
                <option value="kdrama">K-Drama</option>
                <option value="hollywood">Hollywood</option>
              </select>
            </div>

            <div className="form-group">
              <label>Release Year</label>
              <input
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 5}
              />
            </div>
          </div>

          {genres.length > 0 && (
            <div className="form-group">
              <label>Genre</label>
              <select
                name="genre_id"
                value={formData.genre_id}
                onChange={handleChange}
              >
                <option value="">Select Genre</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            className="btn-save" 
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
