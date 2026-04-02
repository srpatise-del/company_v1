import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import useAsync from "../hooks/useAsync";
import api from "../services/api";
import { useSearch } from "../context/SearchContext";
import { formatDate } from "../utils/format";

function useQuery() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

export default function SearchResultsPage() {
  const query = useQuery();
  const q = query.get("q") || "";
  const { setKeyword } = useSearch();

  useEffect(() => {
    setKeyword(q);
  }, [q, setKeyword]);

  const { data, loading, error } = useAsync(async () => {
    if (!q.trim()) {
      return { documents: [], projects: [] };
    }

    const [{ data: documentsRes }, { data: projectsRes }] = await Promise.all([
      api.get("/documents", { params: { q } }),
      api.get("/projects", { params: { q } })
    ]);

    return {
      documents: documentsRes.documents,
      projects: projectsRes.projects
    };
  }, [q]);

  return (
    <div className="space-y-6">
      <Card title="ผลการค้นหา" subtitle={q ? `คำค้น: ${q}` : "พิมพ์คำค้นจากช่องด้านบนแล้วกด Enter"}>
        {loading && <p className="text-sm text-slate-500">กำลังค้นหาข้อมูล...</p>}
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
        {!loading && !error && !q && <EmptyState title="ยังไม่มีคำค้น" description="ค้นหาเอกสารหรือโครงการจากช่องค้นหาด้านบนได้เลย" />}
        {!loading && !error && q && !data?.documents?.length && !data?.projects?.length && (
          <EmptyState title="ไม่พบผลลัพธ์" description="ลองใช้คำค้นอื่น หรือเจาะจงชื่อเอกสารและชื่อโครงการมากขึ้น" />
        )}
      </Card>

      {!!data?.documents?.length && (
        <Card title="เอกสารที่พบ">
          <div className="space-y-3">
            {data.documents.map((document) => (
              <div key={document._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{document.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {document.category} | โดย {document.uploadedBy?.name || "-"}
                    </p>
                  </div>
                  <a href={document.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-600">
                    เปิดเอกสาร
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!!data?.projects?.length && (
        <Card title="โครงการที่พบ">
          <div className="grid gap-4 lg:grid-cols-2">
            {data.projects.map((project) => (
              <div key={project._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{project.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(project.startDate)}</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">ผู้รับผิดชอบ: {project.assignedTo?.name || "-"}</p>
                <p className="mt-1 text-sm text-slate-500">สถานะ: {project.status === "ongoing" ? "กำลังดำเนินการ" : "เสร็จสิ้น"}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
