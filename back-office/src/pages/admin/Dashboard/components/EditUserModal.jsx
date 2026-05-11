import React, { useState, useEffect } from 'react';
import './EditUserModal.css';

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    role: 'user',
    subscription_plan: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        user_name: user.user_name || '',
        user_email: user.user_email || '',
        role: user.role || 'user',
        subscription_plan: user.subscription_plan || '',
        is_active: user.is_active !== false
      });
      setError('');
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!formData.user_name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.user_email.trim()) {
      setError('Email is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        user_name: formData.user_name.trim(),
        user_email: formData.user_email.trim(),
        role: formData.role,
        subscription_plan: formData.subscription_plan.trim(),
        is_active: formData.is_active
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="User name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="user@example.com"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subscription Plan</label>
              <input
                type="text"
                name="subscription_plan"
                value={formData.subscription_plan}
                onChange={handleChange}
                placeholder="Basic, Standard, Premium, etc."
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>
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

export default EditUserModal;
