import { toast } from "react-hot-toast";
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

export default function SuperAdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/gallery`);
      const data = await res.json();
      setImages(data);
    } catch (e) {
      console.error("Failed to fetch gallery images", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", title);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/gallery/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setTitle("");
        setSelectedFile(null);
        await fetchImages();
      } else {
        toast.error("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error", error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const executeDelete = async (id: string) => {
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success("Image deleted successfully");
        setImages(images.filter(img => img.id !== id));
      } else {
        toast.error("Failed to delete image.");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-bold text-slate-900">Are you sure you want to delete this image?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors" onClick={() => toast.dismiss(t.id)}>Cancel</button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors" onClick={() => { toast.dismiss(t.id); executeDelete(id); }}>Delete</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gallery Manager</h1>
        <p className="text-slate-500 mt-2">Upload photos to Cloudflare R2 and display them on the public gallery page.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Upload size={20} className="text-indigo-600" /> Upload New Photo
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Image Title / Caption</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Coding Class 2026"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Select File</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="w-full px-4 py-1.5 border border-slate-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={uploading || !selectedFile}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? "Uploading to R2..." : "Upload Photo"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Live Gallery Images ({images.length})</h2>
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map(img => (
              <div key={img.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group">
                <div className="aspect-[4/3] bg-slate-100 relative">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDelete(img.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-lg"
                      title="Delete Image"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 truncate" title={img.title}>{img.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Uploaded by: {img.uploadedBy}</p>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                <ImageIcon size={48} className="mx-auto text-slate-300 mb-2" />
                <p>No images in the gallery yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
