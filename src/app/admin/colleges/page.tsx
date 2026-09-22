"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, GraduationCap, X } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { CollegeData } from "@/types";
import { useCity } from "@/context/CityContext";

export default function AdminCollegesPage() {
  const { availableCities } = useCity();
  const [colleges, setColleges] = useState<CollegeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<CollegeData | null>(null);

  // Form State
  const [cityId, setCityId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Engineering & Technology");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadColleges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/colleges");
      if (res.ok) {
        const data = await res.json();
        setColleges(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const openCreateModal = () => {
    setEditingCollege(null);
    setCityId(availableCities[0]?.id || "");
    setName("");
    setType("Engineering & Technology");
    setDescription("");
    setAddress("");
    setPhone("+91 141 ");
    setWebsite("");
    setImage("https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: CollegeData) => {
    setEditingCollege(c);
    setCityId(c.cityId);
    setName(c.name);
    setType(c.type);
    setDescription(c.description);
    setAddress(c.address);
    setPhone(c.phone || "");
    setWebsite(c.website || "");
    setImage(c.image);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      cityId,
      name,
      type,
      description,
      address,
      phone,
      website: website || undefined,
      image,
    };

    try {
      let res;
      if (editingCollege) {
        res = await fetch(`/api/colleges/${editingCollege.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        await loadColleges();
      } else {
        const d = await res.json();
        setError(d.error || "Operation failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!confirm(`Delete ${colName}?`)) return;

    try {
      const res = await fetch(`/api/colleges/${id}`, { method: "DELETE" });
      if (res.ok) {
        setColleges((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white">
            Colleges & Campuses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage universities, medical institutes, and engineering academies.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 font-bold text-xs hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add College</span>
        </button>
      </div>

      <AdminNav />

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Institution</th>
                <th className="p-4">City</th>
                <th className="p-4">Type</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {colleges.map((col) => (
                <tr key={col.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <Image src={col.image} alt={col.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{col.name}</div>
                      <div className="text-slate-400 line-clamp-1 max-w-xs">{col.address}</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">
                    {col.city?.name}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {col.type}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    ★ {col.rating.toFixed(1)} ({col.reviewCount})
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(col)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id, col.name)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white">
                {editingCollege ? `Edit ${editingCollege.name}` : "Create College"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">City</label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                  >
                    {availableCities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Program Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    placeholder="Engineering & Technology"
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">College Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Malaviya National Institute of Technology"
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Campus Address, City"
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 141 ..."
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                />
              </div>

              {error && <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 font-semibold">{error}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 font-bold"
                >
                  {submitting ? "Saving..." : "Save College"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
