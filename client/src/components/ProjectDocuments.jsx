import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileText, Image as ImageIcon, Upload, Check, X, Trash2, History, Download } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    "changes-requested": "bg-red-100 text-red-700"
};

const ProjectDocuments = ({ project }) => {
    const { user } = useAuth();
    const [images, setImages] = useState([]);
    const [groups, setGroups] = useState({});
    const [tab, setTab] = useState("documents");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [feedbackDrafts, setFeedbackDrafts] = useState({});

    const canReview = (project.guide && project.guide._id === user.id) || project.workspace?.faculty === user.id;

    const fetchDocuments = async () => {
        try {
            const { data } = await api.get(`/document/project/${project._id}`);
            setImages(data.images);
            setGroups(data.groups);
        } catch (error) {
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project._id]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Choose a file");

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("file", file);

        setUploading(true);
        try {
            await api.post(`/document/project/${project._id}`, formData);
            toast.success("Uploaded");
            setTitle("");
            setFile(null);
            fetchDocuments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleReview = async (docId, status) => {
        try {
            await api.patch(`/document/${docId}/review`, { status, feedback: feedbackDrafts[docId] || "" });
            toast.success(`Marked as ${status}`);
            fetchDocuments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm("Delete this?")) return;
        try {
            await api.delete(`/document/${docId}`);
            toast.success("Deleted");
            fetchDocuments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    if (loading) return null;

    const titles = Object.keys(groups);

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-4 w-fit">
                <button onClick={() => setTab("documents")} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition ${tab === "documents" ? "bg-white shadow-sm text-brand-700" : "text-gray-500"}`}>
                    <FileText size={13} /> Documents ({titles.length})
                </button>
                <button onClick={() => setTab("images")} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition ${tab === "images" ? "bg-white shadow-sm text-brand-700" : "text-gray-500"}`}>
                    <ImageIcon size={13} /> Images ({images.length})
                </button>
            </div>

            <form onSubmit={handleUpload} className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. SRS Document) — leave blank for images" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                <div className="flex flex-col sm:flex-row gap-3">
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp" className="flex-1 text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:text-xs file:font-medium hover:file:bg-brand-100" />
                    <button type="submit" disabled={uploading} className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition shrink-0">
                        <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
                <p className="text-xs text-gray-400">PDF/DOC(X)/PPT(X) go to Documents with review; PNG/JPG/WEBP go to Images with no review. Max 10MB.</p>
            </form>

            {tab === "images" ? (
                images.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">No images uploaded yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {images.map((img) => (
                            <div key={img._id} className="relative group rounded-xl overflow-hidden border border-gray-100">
                                <a href={img.fileUrl} target="_blank" rel="noreferrer">
                                    <img src={img.fileUrl} alt={img.title} className="w-full h-28 object-cover" />
                                </a>
                                <p className="text-[11px] text-gray-500 px-2 py-1.5 truncate">{img.uploadedBy?.name}</p>
                                {img.uploadedBy?._id === user.id && (
                                    <button onClick={() => handleDelete(img._id)} className="absolute top-1.5 right-1.5 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )
            ) : titles.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No documents uploaded yet.</p>
            ) : (
                <div className="space-y-3">
                    {titles.map((docTitle) => {
                        const versions = groups[docTitle];
                        const latest = versions[0];
                        const olderVersions = versions.slice(1);
                        const isOpen = expanded[docTitle];

                        return (
                            <div key={docTitle} className="border border-gray-100 rounded-xl p-4">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-gray-800">{docTitle}</p>
                                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">v{latest.version}</span>
                                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[latest.status]}`}>{latest.status}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{latest.fileName} • Uploaded by {latest.uploadedBy?.name} • {new Date(latest.createdAt).toLocaleDateString()}</p>
                                        {latest.feedback && (
                                            <p className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mt-2"><span className="font-medium">Feedback:</span> {latest.feedback}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <a href={latest.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 px-2.5 py-1.5 rounded-lg bg-brand-50">
                                            <Download size={12} /> View
                                        </a>
                                        {olderVersions.length > 0 && (
                                            <button onClick={() => setExpanded({ ...expanded, [docTitle]: !isOpen })} className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1.5 rounded-lg bg-gray-50">
                                                <History size={12} /> {olderVersions.length} older
                                            </button>
                                        )}
                                        {latest.uploadedBy?._id === user.id && (
                                            <button onClick={() => handleDelete(latest._id)} className="text-gray-300 hover:text-red-500 transition">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {canReview && latest.status === "pending" && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                                        <input value={feedbackDrafts[latest._id] || ""} onChange={(e) => setFeedbackDrafts({ ...feedbackDrafts, [latest._id]: e.target.value })} placeholder="Feedback (optional)" className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none" />
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => handleReview(latest._id, "approved")} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                                <Check size={12} /> Approve
                                            </button>
                                            <button onClick={() => handleReview(latest._id, "changes-requested")} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                                <X size={12} /> Request Changes
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isOpen && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                                        {olderVersions.map((v) => (
                                            <div key={v._id} className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                                                <span>v{v.version} — {v.fileName} — {new Date(v.createdAt).toLocaleDateString()}</span>
                                                <a href={v.fileUrl} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">View</a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProjectDocuments;