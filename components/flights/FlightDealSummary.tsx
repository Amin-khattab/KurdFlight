type FlightDealSummaryProps = {
  title: string;
  subtitle: string;
  meta: string;
};

export function FlightDealSummary({ title, subtitle, meta }: FlightDealSummaryProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Selected flight</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      <p className="mt-2 text-base text-slate-600">{subtitle}</p>
      <p className="mt-4 text-sm text-slate-500">{meta}</p>
    </div>
  );
}
