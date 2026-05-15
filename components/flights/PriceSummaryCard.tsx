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
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  actionDisabled?: boolean;
  errorMessage?: string | null;
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
  actionLabel,
  onAction,
  actionLoading = false,
  actionDisabled = false,
  errorMessage = null,
}: PriceSummaryCardProps) {
  return (
    <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Price summary</p>
      <div className="mt-4 space-y-2.5">
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
              <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.value}</p>
            </div>
            <span className="font-medium text-slate-900">${item.total}</span>
          </div>
        ))}
        {extras.map((extra) => (
          <div key={extra.label} className="flex items-start justify-between gap-4 text-sm text-slate-600">
            <div>
              <p>{extra.label}</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">{extra.value}</p>
            </div>
            <span className="font-medium text-slate-900">{formatDelta(extra.totalDelta)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
          <span className="text-sm font-semibold text-slate-900">Estimated total</span>
          <span className="text-xl font-semibold tracking-tight text-slate-900">${totalPrice}</span>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Taxes are included in this mock total. Final airline pricing may vary at checkout.
      </p>
      {errorMessage ? (
        <p className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled || actionLoading}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {actionLoading ? "Confirming booking..." : actionLabel}
        </button>
      ) : null}
    </aside>
  );
}
