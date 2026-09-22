"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, MapPin, X } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { CityData } from "@/types";

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityData | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [latitude, setLatitude] = useState(26.9124);
  const [longitude, setLongitude] = useState(75.7873);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCities = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cities");
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const openCreateModal = () => {
    setEditingCity(null);
    setName("");
    setState("");
    setCountry("India");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80");
    setLatitude(26.9124);
    setLongitude(75.7873);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: CityData) => {
    setEditingCity(c);
    setName(c.name);
    setState(c.state);
    setCountry(c.country);
    setDescription(c.description);
    setImage(c.image);
    setLatitude(c.latitude);
    setLongitude(c.longitude);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      state,
      country,
      description,
      image,
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    try {
      let res;
      if (editingCity) {
        res = await fetch(`/api/cities/${editingCity.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        await loadCities();
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

  const handleDelete = async (id: string, cityName: string) => {
    if (!confirm(`Are you sure you want to delete ${cityName}? All its associated places will be cascade deleted!`))
      return;

    try {
      const res = await fetch(`/api/cities/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCities((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold font-serif-hero text-slate-900 dark:text-white">
            City Destinations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage supported Indian cities, geographic coordinates, and regional cover imagery.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#101827] text-white dark:bg-[#F3A6C8] dark:text-slate-950 font-bold text-xs hover:bg-[#F3A6C8] hover:text-slate-950 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New City</span>
        </button>
      </div>

      <AdminNav />

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">City</th>
                <th className="p-4">State & Country</th>
                <th className="p-4">Coordinates</th>
                <th className="p-4">Attractions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cities.map((city) => (
                <tr key={city.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <Image src={city.image} alt={city.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{city.name}</div>
                      <div className="text-slate-400 line-clamp-1 max-w-xs">{city.description}</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    {city.state}, {city.country}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                  </td>
                  <td className="p-4 text-slate-500">
                    {(city._count?.touristPlaces || 0) + (city._count?.businesses || 0)} spots
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(city)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      title="Edit City"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(city.id, city.name)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete City"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif-hero text-slate-900 dark:text-white">
                {editingCity ? `Edit ${editingCity.name}` : "Create New City"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">City Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Jaipur"
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    placeholder="e.g. Rajasthan"
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-[#F3A6C8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    required
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
                  {submitting ? "Saving..." : "Save City"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
