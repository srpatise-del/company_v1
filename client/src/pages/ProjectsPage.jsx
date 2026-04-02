import { useEffect, useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import ProgressBar from "../components/ui/ProgressBar";
import useAsync from "../hooks/useAsync";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { formatDate } from "../utils/format";

const initialForm = {
  name: "",
  description: "",
  status: "ongoing",
  progress: 0,
  assignedTo: "",
  startDate: "",
  endDate: ""
};

export default function ProjectsPage() {
  const { user } = useAuth();
  const { keyword } = useSearch();
  const { data, loading, error, setData } = useAsync(async () => {
    const [{ data: projectsRes }, { data: usersRes }] = await Promise.all([api.get("/projects"), api.get("/users")]);
    return { projects: projectsRes.projects, users: usersRes.users };
  }, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      const params = keyword.trim() ? { q: keyword.trim() } : {};
      const [{ data: projectsRes }, { data: usersRes }] = await Promise.all([api.get("/projects", { params }), api.get("/users")]);
      setData({ projects: projectsRes.projects, users: usersRes.users });
    };

    loadProjects().catch((err) => setSubmitError(err.message));
  }, [keyword, setData]);

  const filteredProjects = useMemo(() => {
    if (!data?.projects) return [];
    const q = keyword.toLowerCase();
    return data.projects.filter((project) =>
      [project.name, project.description, project.status, project.assignedTo?.name].some((value) =>
        String(value || "").toLowerCase().includes(q)
      )
    );
  }, [data, keyword]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitError("");
      const payload = { ...form, progress: Number(form.progress) };
      const { data: response } = await api.post("/projects", payload);
      setData({ ...data, projects: [response.project, ...(data?.projects || [])] });
      setForm(initialForm);
      setOpen(false);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title="โครงการบริษัท"
        subtitle="ติดตามแผนงานการผลิต งานซ่อมบำรุง เครื่องจักร และโครงการปรับปรุงภายในโรงงาน"
        action={
          user?.role === "admin" && (
            <button onClick={() => setOpen(true)} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white">
              เพิ่มโครงการ
            </button>
          )
        }
      >
        {loading && <p className="text-sm text-slate-500">กำลังโหลดโครงการ...</p>}
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredProjects.map((project) => (
            <div key={project._id} className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {project.status === "ongoing" ? "กำลังดำเนินการ" : "เสร็จสิ้น"}
                </span>
              </div>
              <div className="mt-4">
                <ProgressBar value={project.progress} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-500">
                <p>ผู้รับผิดชอบ: {project.assignedTo?.name || "-"}</p>
                <p>เริ่ม: {formatDate(project.startDate)} | สิ้นสุด: {formatDate(project.endDate)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={open} title="เพิ่มโครงการใหม่" onClose={() => setOpen(false)}>
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
          <FormInput label="ชื่อโครงการ" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">สถานะ</span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              <option value="ongoing">กำลังดำเนินการ</option>
              <option value="completed">เสร็จสิ้น</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">รายละเอียด</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <FormInput label="ความคืบหน้า (%)" type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">ผู้รับผิดชอบ</span>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              <option value="">เลือกพนักงาน</option>
              {data?.users?.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} - {employee.department}
                </option>
              ))}
            </select>
          </label>
          <FormInput label="วันที่เริ่ม" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <FormInput label="วันที่สิ้นสุด" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          {submitError && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-600 md:col-span-2">{submitError}</p>}
          <button className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-medium text-white md:col-span-2">บันทึกโครงการ</button>
        </form>
      </Modal>
    </div>
  );
}
