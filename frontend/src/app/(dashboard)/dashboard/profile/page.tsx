"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("User");
  const [phone, setPhone] = useState("");

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900">
          Profile 👤
        </h1>
        <p className="mt-1 text-surface-500">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        {/* Cover */}
        <div className="h-32 gradient-primary relative">
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-500 border-4 border-white flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold font-[var(--font-heading)]">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-14 pb-6 px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold font-[var(--font-heading)] text-surface-900">{name}</h2>
              <p className="text-sm text-surface-500">user@waypay.in</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-all"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-3 rounded-xl gradient-primary text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-50">
                <p className="text-xs text-surface-500">Phone</p>
                <p className="text-sm font-medium text-surface-900 mt-0.5">{phone || "Not set"}</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-50">
                <p className="text-xs text-surface-500">KYC Status</p>
                <p className="text-sm font-medium text-warning-500 mt-0.5">Pending</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-50">
                <p className="text-xs text-surface-500">Account Status</p>
                <p className="text-sm font-medium text-success-500 mt-0.5">Active</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-50">
                <p className="text-xs text-surface-500">Member Since</p>
                <p className="text-sm font-medium text-surface-900 mt-0.5">July 2026</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6">
        <h3 className="text-lg font-semibold font-[var(--font-heading)] text-surface-900 mb-4">Security</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-sm font-medium text-surface-900">Two-Factor Authentication</p>
                <p className="text-xs text-surface-500">Add an extra layer of security</p>
              </div>
            </div>
            <button className="px-4 py-1.5 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-all">
              Enable
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50">
            <div className="flex items-center gap-3">
              <span className="text-lg">📱</span>
              <div>
                <p className="text-sm font-medium text-surface-900">Login Notifications</p>
                <p className="text-xs text-surface-500">Get notified on new logins</p>
              </div>
            </div>
            <button className="px-4 py-1.5 text-xs font-medium text-success-600 bg-success-50 rounded-lg">
              Enabled
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-danger-200 p-6">
        <h3 className="text-lg font-semibold font-[var(--font-heading)] text-danger-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-surface-500 mb-4">
          Once you delete your account, there is no going back.
        </p>
        <button className="px-4 py-2 text-sm font-medium text-danger-600 border border-danger-200 rounded-xl hover:bg-danger-50 transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
}
