import { createPortal } from "react-dom";

export default function ResponsiveModal({ open, title, children, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-950/50 p-4 md:p-6">
      <div className="flex min-h-full items-start justify-center py-6 md:items-center">
        <div className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <button type="button" onClick={onClose} className="shrink-0 text-sm text-slate-500">
              ปิด
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
