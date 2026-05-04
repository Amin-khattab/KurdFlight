type FlightDealSummaryProps = {
  title: string;
  subtitle: string;
  meta: string;
};

export function FlightDealSummary({ title, subtitle, meta }: FlightDealSummaryProps) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Selected flight</p>
      <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{meta}</div>
      </div>
    </div>
  );
}
