import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Image as ImageIcon, FileText, Upload, Trash2, Download } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const WorkspaceMaterials = ({ workspace }) => {
    const { user } = useAuth();
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [tab, setTab] = useState("documents");
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const isOwner = workspace.faculty?._id === user.id;

    const fetchMaterials = async () => {
        try {
            const { data } = await api.get(`/material/workspace/${workspace._id}`);
            setImages(data.images);
            setDocuments(data.documents);
        } catch (error) {
            toast.error("Failed to load materials");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspace._id]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Choose a file");

        const formData = new FormData();
        formData.append("title", title.trim() || file.name);
        formData.append("file", file);

        setUploading(true);
        try {
            await api.post(`/material/workspace/${workspace._id}`, formData);
            toast.success("Material uploaded");
            setTitle("");
            setFile(null);
            fetchMaterials();
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

   const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;

    try {
        await api.delete(`/material/${id}`);

        toast.success("Deleted");

        // Immediately remove from UI
        setImages((prev) => prev.filter((item) => item._id !== id));
        setDocuments((prev) => prev.filter((item) => item._id !== id));

    } catch (error) {
        toast.error(
            error.response?.data?.message || "Something went wrong"
        );
    }
};

    if (loading) return null;

    const list = tab === "documents" ? documents : images;

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-4 w-fit">
                <button onClick={() => setTab("documents")} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition ${tab === "documents" ? "bg-white shadow-sm text-brand-700" : "text-gray-500"}`}>
                    <FileText size={13} /> Documents ({documents.length})
                </button>
                <button onClick={() => setTab("images")} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition ${tab === "images" ? "bg-white shadow-sm text-brand-700" : "text-gray-500"}`}>
                    <ImageIcon size={13} /> Images ({images.length})
                </button>
            </div>

            {isOwner && (
                <form onSubmit={handleUpload} className="bg-gray-50 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp" className="flex-1 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:text-xs file:font-medium hover:file:bg-brand-100" />
                    <button type="submit" disabled={uploading} className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition shrink-0">
                        <Upload size={14} /> {uploading ? "Uploading..." : "Add Material"}
                    </button>
                </form>
            )}

            {list.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No {tab} shared yet.</p>
            ) : tab === "images" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {list.map((m) => (
                        <div key={m._id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                            <a href={m.fileUrl} target="_blank" rel="noreferrer">
                                <img src={m.fileUrl} alt={m.title} className="w-full h-28 object-cover" />
                            </a>
                            <p className="text-[11px] text-gray-500 px-2 py-1.5 truncate">{m.title}</p>
                            {m.uploadedBy?._id === user.id && (
                                <button onClick={() => handleDelete(m._id)} className="absolute top-1.5 right-1.5 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {list.map((m) => (
                        <div key={m._id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-100">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{m.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{m.fileName} • {m.uploadedBy?.name} • {new Date(m.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a href={m.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 px-2.5 py-1.5 rounded-lg bg-brand-50">
                                    <Download size={12} /> View
                                </a>
                                {m.uploadedBy?._id === user.id && (
                                    <button onClick={() => handleDelete(m._id)} className="text-gray-300 hover:text-red-500 transition">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkspaceMaterials;