import Card from "../components/ui/Card";
import useAsync from "../hooks/useAsync";
import api from "../services/api";
import { formatDate } from "../utils/format";

export default function NotificationsPage() {
  const { data, loading, error, setData } = useAsync(async () => {
    const { data } = await api.get("/notifications");
    return data.notifications;
  }, []);

  const markAsRead = async (id) => {
    const { data: response } = await api.put(`/notifications/${id}/read`);
    setData((current) => current.map((item) => (item._id === id ? response.notification : item)));
  };

  return (
    <Card title="การแจ้งเตือน" subtitle="ติดตามรายการที่เกี่ยวข้องกับงานของคุณ">
      {loading && <p className="text-sm text-slate-500">กำลังโหลดการแจ้งเตือน...</p>}
      {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
      <div className="space-y-4">
        {data?.map((item) => (
          <div key={item._id} className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium text-slate-900">{item.message}</p>
                <p className="mt-1 text-sm text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
              {!item.isRead && (
                <button onClick={() => markAsRead(item._id)} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white">
                  ทำเครื่องหมายว่าอ่านแล้ว
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
