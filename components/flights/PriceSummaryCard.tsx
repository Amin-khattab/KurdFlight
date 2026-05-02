type PriceSummaryCardProps = {
  passengers: string;
  baseItems: Array<{
    label: string;
    value: string;
    total: number;
  }>;
  chargeablePassengers: number;
  extras: Array<{
    label: string;
    value: string;
    totalDelta: number;
  }>;
  totalPrice: number;
};

function formatDelta(totalDelta: number) {
  if (totalDelta === 0) return "Included";
  return `+$${totalDelta}`;
}

export function PriceSummaryCard({
  passengers,
  baseItems,
  chargeablePassengers,
  extras,
  totalPrice,
}: PriceSummaryCardProps) {
  return (
    <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Price summary</p>
      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
          <span>Passengers</span>
          <span className="font-medium text-slate-900">{passengers}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
          <span>Chargeable passengers</span>
          <span className="font-medium text-slate-900">{chargeablePassengers}</span>
        </div>
        {baseItems.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-4 text-sm text-slate-600">
            <div>
              <p>{item.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.value}</p>
            </div>
            <span className="font-medium text-slate-900">${item.total}</span>
          </div>
        ))}
        {extras.map((extra) => (
          <div key={extra.label} className="flex items-start justify-between gap-4 text-sm text-slate-600">
            <div>
              <p>{extra.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{extra.value}</p>
            </div>
            <span className="font-medium text-slate-900">{formatDelta(extra.totalDelta)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
          <span className="text-base font-semibold text-slate-900">Estimated total</span>
          <span className="text-2xl font-semibold tracking-tight text-slate-900">${totalPrice}</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        Taxes are included in this mock total. Final airline pricing may vary at checkout.
      </p>
    </aside>
  );
}
