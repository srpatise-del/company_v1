import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ResponsiveModal from "../components/ui/ResponsiveModal";
import FormInput from "../components/ui/FormInput";
import FileUpload from "../components/ui/FileUpload";
import useAsync from "../hooks/useAsync";
import api from "../services/api";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";

const documentCategories = [
  "เอกสารข้อมูลกิจการ",
  "เอกสารด้านรายรับ",
  "เอกสารด้านรายจ่าย",
  "เอกสารบัญชีและภาษี",
  "เอกสารฝ่ายบุคคล"
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const { keyword } = useSearch();
  const { data, loading, error, setData } = useAsync(async () => {
    const { data } = await api.get("/documents");
    return data.documents;
  }, []);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ name: "", category: "" });
  const [submitError, setSubmitError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadDocuments = async () => {
      const params = keyword.trim() ? { q: keyword.trim() } : {};
      const { data: response } = await api.get("/documents", { params });
      setData(response.documents);
    };

    loadDocuments().catch((err) => setSubmitError(err.message));
  }, [keyword, setData]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = keyword.toLowerCase();
    return data.filter((item) => [item.name, item.category].some((value) => value?.toLowerCase().includes(q)));
  }, [data, keyword]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setSubmitError("");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      if (file) formData.append("file", file);
      const { data: response } = await api.post("/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setData([response.document, ...(data || [])]);
      setForm({ name: "", category: "" });
      setFile(null);
      setOpen(false);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm("ต้องการลบเอกสารนี้ใช่หรือไม่?");
    if (!confirmed) return;

    try {
      setDeletingId(documentId);
      setSubmitError("");
      await api.delete(`/documents/${documentId}`);
      setData((data || []).filter((item) => item._id !== documentId));
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setDeletingId("");
    }
  };

  const columns = [
    { key: "name", label: "ชื่อเอกสาร" },
    { key: "category", label: "หมวดหมู่" },
    { key: "uploadedBy", label: "อัปโหลดโดย", render: (row) => row.uploadedBy?.name || "-" },
    { key: "createdAt", label: "วันที่", render: (row) => formatDate(row.createdAt) },
    {
      key: "fileUrl",
      label: "ไฟล์",
      render: (row) => (
        <a href={row.fileUrl} target="_blank" rel="noreferrer" className="font-medium text-brand-600">
          เปิดเอกสาร
        </a>
      )
    }
  ];

  if (user?.role === "admin") {
    columns.push({
      key: "actions",
      label: "จัดการ",
      render: (row) => (
        <button
          type="button"
          onClick={() => handleDelete(row._id)}
          disabled={deletingId === row._id}
          className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deletingId === row._id ? "กำลังลบ..." : "ลบ"}
        </button>
      )
    });
  }

  return (
    <Card
      title="เอกสารภายใน"
      subtitle="จัดเก็บคู่มือ แบบฟอร์ม และเอกสารสำคัญของบริษัท"
      action={
        user && (
          <button onClick={() => setOpen(true)} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            อัปโหลดเอกสาร
          </button>
        )
      }
    >
      {loading && <p className="text-sm text-slate-500">กำลังโหลดเอกสาร...</p>}
      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      {submitError && <p className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{submitError}</p>}
      {!loading && !error && <DataTable columns={columns} rows={filtered} emptyMessage="ยังไม่มีเอกสารในระบบ" />}

      <ResponsiveModal open={open} title="อัปโหลดเอกสารใหม่" onClose={() => setOpen(false)}>
        <form onSubmit={handleUpload} className="space-y-4">
          <FormInput label="ชื่อเอกสาร" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">หมวดหมู่</span>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            >
              <option value="">เลือกหมวดหมู่เอกสาร</option>
              {documentCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <FileUpload label="ไฟล์เอกสาร" accept=".pdf,image/*" onChange={setFile} />
          <button className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-medium text-white">บันทึกเอกสาร</button>
        </form>
      </ResponsiveModal>
    </Card>
  );
}
