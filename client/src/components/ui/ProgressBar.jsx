export default function ProgressBar({ value }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>ความคืบหน้า</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
