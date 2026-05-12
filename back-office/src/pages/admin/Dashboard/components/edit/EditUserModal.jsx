import React, { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/8 pb-4">
          <h3 className="text-xl font-bold text-slate-50">Edit User</h3>
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-rose-400" onClick={onClose}>×</button>
        </div>

        <div className="grid gap-4">
          {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200">Name *</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              placeholder="User name"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-200">Email *</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-200">Subscription Plan</label>
              <input
                type="text"
                name="subscription_plan"
                value={formData.subscription_plan}
                onChange={handleChange}
                placeholder="Basic, Standard, Premium, etc."
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-200">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 bg-slate-800 text-emerald-500 focus:ring-emerald-400/20"
              />
              <span>Active</span>
            </label>
          </div>
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

export default EditUserModal;
