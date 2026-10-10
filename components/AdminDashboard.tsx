"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export interface CommissionRecord {
  id: string;
  client_name: string;
  email: string;
  contact_platform?: string;
  contact_handle?: string;
  tier: string;
  brief: string;
  reference_urls: string[];
  status: "Pending" | "Accepted" | "Sketching" | "Coloring" | "Completed";
  created_at: string;
}

export interface ArtStyleItem {
  id: string;
  title: string;
  description: string;
  turnaround: string;
  sample_image_url: string;
  tag: string;
  price: string;
  is_available: boolean;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  category: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'art_styles' | 'gallery'>('orders');
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [artStyles, setArtStyles] = useState<ArtStyleItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Art Style Form State
  const [editingStyleId, setEditingStyleId] = useState<string | null>(null);
  const [styleTitle, setStyleTitle] = useState("");
  const [styleDesc, setStyleDesc] = useState("");
  const [styleTurnaround, setStyleTurnaround] = useState("");
  const [styleTag, setStyleTag] = useState("");
  const [stylePrice, setStylePrice] = useState("");
  const [styleFile, setStyleFile] = useState<File | null>(null);
  const [styleIsAvailable, setStyleIsAvailable] = useState<boolean>(true);

  // Gallery Form State
  const [galleryCategory, setGalleryCategory] = useState("Chibi Cuties");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const [commissionsRes, storeSettingsRes, artStylesRes, galleryRes] = await Promise.all([
        supabase.from("commissions").select("*").order("created_at", { ascending: false }),
        supabase.from("store_settings").select("is_open").eq("id", 1).single(),
        supabase.from("art_styles").select("*").order("created_at", { ascending: false }),
        supabase.from("portfolio").select("*").order("created_at", { ascending: false }),
      ]);

      if (commissionsRes.error) {
        throw commissionsRes.error;
      }

      if (commissionsRes.data) {
        setCommissions(commissionsRes.data as CommissionRecord[]);
      }

      if (storeSettingsRes.data) {
        setIsOpen(storeSettingsRes.data.is_open ?? true);
      }

      if (artStylesRes.data) {
        setArtStyles(artStylesRes.data as ArtStyleItem[]);
      }

      if (galleryRes.data) {
        setGalleryItems(galleryRes.data as GalleryItem[]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch dashboard data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtStyles = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("art_styles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setArtStyles(data as ArtStyleItem[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const fetchGallery = async (): Promise<void> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setGalleryItems(data as GalleryItem[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleAvailability = async (): Promise<void> => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("store_settings")
        .update({ is_open: nextState })
        .eq("id", 1);

      if (updateError) {
        throw updateError;
      }
    } catch (err: unknown) {
      setIsOpen(!nextState);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update store availability.");
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string): Promise<void> => {
    const validStatus = newStatus as CommissionRecord["status"];

    // Optimistic update
    setCommissions((prev: CommissionRecord[]) =>
      prev.map((item) => (item.id === id ? { ...item, status: validStatus } : item))
    );

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("commissions")
        .update({ status: validStatus })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }
    } catch (err: unknown) {
      // Revert on error
      fetchData();
    }
  };

  const resetStyleForm = () => {
    setEditingStyleId(null);
    setStyleTitle("");
    setStyleDesc("");
    setStyleTurnaround("");
    setStyleTag("");
    setStylePrice("");
    setStyleFile(null);
    setStyleIsAvailable(true);
    const fileInput = document.getElementById("art-style-file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleEditArtStyle = (style: ArtStyleItem) => {
    setEditingStyleId(style.id);
    setStyleTitle(style.title);
    setStyleDesc(style.description);
    setStyleTurnaround(style.turnaround);
    setStyleTag(style.tag);
    setStylePrice(style.price);
    setStyleIsAvailable(style.is_available ?? true);
    setStyleFile(null);
    const fileInput = document.getElementById("art-style-file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitArtStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = undefined;

    try {
      const supabase = createClient();

      // 1. Handle File Upload if a NEW file was selected
      if (styleFile) {
        const filePath = `${Date.now()}_${styleFile.name}`;
        const { error: uploadError } = await supabase.storage.from('portfolio_public').upload(filePath, styleFile);
        if (!uploadError) {
          finalImageUrl = supabase.storage.from('portfolio_public').getPublicUrl(filePath).data.publicUrl;
        }
      }

      // 2. Build Payload (Strictly Typed)
      const payload: Partial<ArtStyleItem> = {
        title: styleTitle,
        description: styleDesc,
        turnaround: styleTurnaround,
        tag: styleTag,
        price: stylePrice,
        is_available: styleIsAvailable,
      };
      if (finalImageUrl) payload.sample_image_url = finalImageUrl;

      // 3. Execute DB Operation
      if (editingStyleId) {
        const { error } = await supabase.from('art_styles').update(payload).eq('id', editingStyleId);
        if (error) throw error;
      } else {
        if (!finalImageUrl) {
          alert("Please select an image for the new style.");
          return;
        }
        payload.sample_image_url = finalImageUrl;
        const { error } = await supabase.from('art_styles').insert([payload as ArtStyleItem]);
        if (error) throw error;
      }

      resetStyleForm();
      fetchArtStyles(); // Refresh the list
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save art style.");
      }
    }
  };

  const handleDeleteArtStyle = async (id: string): Promise<void> => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("art_styles").delete().eq("id", id);
      if (error) throw error;
      setArtStyles((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete art style.");
      }
    }
  };

  const handleCreateGalleryItem = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!galleryFile) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      const supabase = createClient();
      const fileExt = galleryFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio_public")
        .upload(fileName, galleryFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio_public")
        .getPublicUrl(fileName);

      const image_url = publicUrlData.publicUrl;

      const { error: insertError } = await supabase
        .from("portfolio")
        .insert({
          image_url,
          category: galleryCategory,
        });

      if (insertError) throw insertError;

      setGalleryFile(null);
      const fileInput = document.getElementById("gallery-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      fetchGallery();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to upload gallery item.");
      }
    }
  };

  const handleDeleteGalleryItem = async (id: string, imageUrl: string): Promise<void> => {
    try {
      const supabase = createClient();
      try {
        const parts = imageUrl.split("/portfolio_public/");
        if (parts.length > 1) {
          const fileName = parts[1];
          await supabase.storage.from("portfolio_public").remove([fileName]);
        }
      } catch (storageErr) {
        console.error("Storage removal error:", storageErr);
      }

      const { error } = await supabase.from("portfolio").delete().eq("id", id);
      if (error) throw error;

      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete gallery item.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] font-black text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-black">
      <h2 className="text-3xl font-black uppercase tracking-wider mb-8 text-center border-b-4 border-black pb-3">
        Admin Dashboard - CMS
      </h2>

      <div className="flex justify-between items-center border-4 border-black shadow-neopop rounded-xl p-6 mb-8 bg-white">
        <h2 className="text-2xl font-black">Store Status</h2>
        <button onClick={toggleAvailability} className={`border-4 border-black font-black text-xl px-6 py-3 rounded-xl shadow-neopop transition-all ${isOpen ? 'bg-[#A7F3D0]' : 'bg-pastel-pink'}`}>
          {isOpen ? '🟢 OPEN FOR COMMISSIONS' : '🔴 CLOSED'}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 border-4 border-black font-black rounded-xl shadow-neopop transition-all ${activeTab === 'orders' ? 'bg-[#A7F3D0] translate-y-1 shadow-neopop-active' : 'bg-white'}`}>📋 Orders</button>
        <button onClick={() => setActiveTab('art_styles')} className={`px-6 py-2 border-4 border-black font-black rounded-xl shadow-neopop transition-all ${activeTab === 'art_styles' ? 'bg-pastel-yellow translate-y-1 shadow-neopop-active' : 'bg-white'}`}>🎨 Art Styles</button>
        <button onClick={() => setActiveTab('gallery')} className={`px-6 py-2 border-4 border-black font-black rounded-xl shadow-neopop transition-all ${activeTab === 'gallery' ? 'bg-pastel-pink translate-y-1 shadow-neopop-active' : 'bg-white'}`}>🖼️ Gallery</button>
      </div>

      {error && (
        <div className="mb-6 border-2 border-black bg-red-200 p-4 rounded-lg font-bold text-red-800">
          Error: {error}
        </div>
      )}

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <>
          {commissions.length === 0 ? (
            <div className="border-4 border-black shadow-neopop rounded-xl p-8 bg-white text-center font-bold text-lg">
              No commission requests found.
            </div>
          ) : (
            <div className="space-y-6">
              {commissions.map((record: CommissionRecord) => {
                const supabase = createClient();
                return (
                  <div
                    key={record.id}
                    className="border-4 border-black shadow-neopop rounded-xl p-6 bg-white"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b-2 border-black pb-3 gap-2">
                      <div>
                        <a
                          href={`mailto:${record.email}`}
                          className="text-sm font-bold text-purple-700 underline"
                        >
                          {record.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm uppercase">Status:</span>
                        <select
                          value={record.status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            handleStatusChange(record.id, e.target.value)
                          }
                          className="border-2 border-black rounded p-2 bg-yellow-200 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Sketching">Sketching</option>
                          <option value="Coloring">Coloring</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-black">{record.client_name}</h3>
                        <span className="bg-[#E0E7FF] border-2 border-black px-2 py-1 rounded-md text-xs font-black shadow-neopop-active">
                          📱 {record.contact_platform}: {record.contact_handle}
                        </span>
                        {record.tier && (
                          <span className="bg-pastel-purple border-2 border-black px-3 py-1 rounded-md text-xs font-black shadow-neopop-active">
                            🎨 Style: {record.tier}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-800 bg-gray-50 p-3 rounded-lg border-2 border-gray-200">
                        <span className="block text-xs uppercase text-gray-500 mb-1">Commission Brief:</span>
                        {record.brief}
                      </p>
                    </div>

                    {record.reference_urls && record.reference_urls.length > 0 && (
                      <div>
                        <h4 className="font-bold text-sm uppercase text-gray-600 mb-1">
                          Reference Images
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {record.reference_urls.map((urlPath: string, index: number) => {
                            const { data } = supabase.storage
                              .from("references_private")
                              .getPublicUrl(urlPath);
                            const publicUrl = data.publicUrl;

                            return (
                              <a
                                key={index}
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-2 border-black bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded font-bold text-sm shadow-sm inline-block"
                              >
                                View Ref #{index + 1}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: ART STYLES */}
      {activeTab === 'art_styles' && (
        <div className="space-y-8">
          <form onSubmit={handleSubmitArtStyle} className="border-4 border-black shadow-neopop rounded-xl p-6 bg-white space-y-4">
            <h3 className="text-xl font-black uppercase border-b-2 border-black pb-2">
              {editingStyleId ? '✏️ Edit Art Style' : '✨ Add New Art Style'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={styleTitle}
                  onChange={(e) => setStyleTitle(e.target.value)}
                  placeholder="e.g. Chibi Cuties"
                  className="w-full border-2 border-black p-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Price</label>
                <input
                  type="text"
                  required
                  value={stylePrice}
                  onChange={(e) => setStylePrice(e.target.value)}
                  placeholder="₱200 / $10"
                  className="w-full border-2 border-black p-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Tag</label>
                <input
                  type="text"
                  value={styleTag}
                  onChange={(e) => setStyleTag(e.target.value)}
                  placeholder="e.g. 💖 Budget-Friendly Starter Style"
                  className="w-full border-2 border-black p-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Turnaround</label>
                <input
                  type="text"
                  value={styleTurnaround}
                  onChange={(e) => setStyleTurnaround(e.target.value)}
                  placeholder="⏱️ Minimum 1-Week Turnaround"
                  className="w-full border-2 border-black p-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-sm mb-1">
                  Sample Image {editingStyleId ? '(Leave empty to keep existing)' : ''}
                </label>
                <input
                  id="art-style-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setStyleFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full border-2 border-black p-1.5 rounded font-medium bg-gray-50 cursor-pointer focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold text-sm mb-1">Description</label>
                <textarea
                  value={styleDesc}
                  onChange={(e) => setStyleDesc(e.target.value)}
                  placeholder="Detailed description..."
                  rows={3}
                  className="w-full border-2 border-black p-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 font-bold cursor-pointer mt-4 border-2 border-black p-3 rounded-xl bg-white shadow-neopop">
              <input type="checkbox" checked={styleIsAvailable} onChange={(e) => setStyleIsAvailable(e.target.checked)} className="w-5 h-5 accent-pastel-purple border-2 border-black" />
              Style is currently available for commissions
            </label>
            <div className="flex gap-4 mt-4">
              <button type="submit" className="flex-1 bg-pastel-yellow border-4 border-black font-black p-3 rounded-xl shadow-neopop active:translate-y-1">
                {editingStyleId ? 'Update Style' : 'Create Style'}
              </button>
              {editingStyleId && (
                <button type="button" onClick={resetStyleForm} className="bg-pastel-pink border-4 border-black font-black p-3 rounded-xl shadow-neopop active:translate-y-1">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {artStyles.length === 0 ? (
            <div className="border-4 border-black shadow-neopop rounded-xl p-8 bg-white text-center font-bold text-lg">
              No art styles configured yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artStyles.map((style) => (
                <div key={style.id} className="border-4 border-black shadow-neopop rounded-xl p-6 bg-white flex flex-col justify-between">
                  <div>
                    {style.sample_image_url && (
                      <img src={style.sample_image_url} alt={style.title} className="h-48 w-full object-cover border-2 border-black rounded-lg mb-4" />
                    )}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="border-2 border-black bg-pastel-pink text-xs font-black px-2 py-0.5 rounded uppercase inline-block">
                        {style.tag}
                      </span>
                      {!style.is_available && (
                        <span className="bg-red-200 text-red-800 font-black text-xs px-2 py-1 rounded border-2 border-red-800 inline-block">
                          UNAVAILABLE
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-black">{style.title}</h4>
                    <p className="font-bold text-purple-700 my-1">Price: {style.price}</p>
                    <p className="text-sm font-medium text-gray-700">{style.description}</p>
                    <p className="text-xs font-bold text-gray-500 mt-2">{style.turnaround}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleEditArtStyle(style)} className="flex-1 bg-pastel-blue border-2 border-black font-black py-2 rounded-lg hover:shadow-neopop-active transition-all">✏️ Edit</button>
                    <button onClick={() => handleDeleteArtStyle(style.id)} className="flex-1 bg-pastel-pink border-2 border-black font-black py-2 rounded-lg hover:shadow-neopop-active transition-all">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-8">
          <form onSubmit={handleCreateGalleryItem} className="border-4 border-black shadow-neopop rounded-xl p-6 bg-white space-y-4">
            <h3 className="text-xl font-black uppercase border-b-2 border-black pb-2">Upload Gallery Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={galleryCategory}
                  onChange={(e) => setGalleryCategory(e.target.value)}
                  placeholder="e.g. Chibi Cuties"
                  className="w-full border-2 border-black p-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Image File</label>
                <input
                  id="gallery-file-input"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setGalleryFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full border-2 border-black p-1.5 rounded font-medium bg-gray-50 cursor-pointer focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="border-4 border-black bg-pastel-pink font-black px-6 py-2 rounded-xl shadow-neopop hover:translate-y-0.5 transition-all"
            >
              Upload & Add to Gallery
            </button>
          </form>

          {galleryItems.length === 0 ? (
            <div className="border-4 border-black shadow-neopop rounded-xl p-8 bg-white text-center font-bold text-lg">
              No gallery items found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item.id} className="border-4 border-black shadow-neopop rounded-xl p-4 bg-white flex flex-col justify-between">
                  <div>
                    <img src={item.image_url} alt={item.category} className="h-40 w-full object-cover border-2 border-black rounded-lg mb-3" />
                    <span className="border-2 border-black bg-pastel-blue text-xs font-black px-2 py-0.5 rounded uppercase inline-block">
                      {item.category}
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t-2 border-black flex justify-end">
                    <button
                      onClick={() => handleDeleteGalleryItem(item.id, item.image_url)}
                      className="border-2 border-black bg-red-200 hover:bg-red-300 font-bold px-3 py-1 rounded text-sm shadow-sm transition-all"
                    >
                      [Delete]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
