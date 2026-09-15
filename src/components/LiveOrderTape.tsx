import { TradeOrder, AssetId } from '../types';
import { Activity, ArrowUpRight, ArrowDownRight, Radio } from 'lucide-react';

interface LiveOrderTapeProps {
  orders: TradeOrder[];
  selectedAssetId: AssetId;
}

export default function LiveOrderTape({ orders, selectedAssetId }: LiveOrderTapeProps) {
  // Filter for selected asset or show all
  const filteredOrders = orders.filter((o) => o.assetId === selectedAssetId).slice(0, 10);

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 backdrop-blur-xl shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-100">
            شريط الصفقات الحية (Time & Sales)
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
          {selectedAssetId}/USDT
        </span>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-4 text-[10px] font-mono text-slate-500 py-2 border-b border-slate-800/60">
        <span>السعر ($)</span>
        <span className="text-center">الكمية</span>
        <span className="text-center">الإجمالي ($)</span>
        <span className="text-left">التوقيت</span>
      </div>

      {/* Orders List */}
      <div className="space-y-1.5 mt-2 flex-1 overflow-y-auto max-h-64 no-scrollbar font-mono text-xs">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            جاري استقبال الصفقات اللحظية...
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isBuy = order.type === 'buy';
            return (
              <div
                key={order.id}
                className="grid grid-cols-4 items-center py-1 px-1.5 rounded bg-slate-950/40 hover:bg-slate-800/40 transition-colors"
              >
                <div className={`flex items-center gap-1 font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isBuy ? (
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 shrink-0" />
                  )}
                  <span>{order.price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="text-center text-slate-300">
                  {order.amount.toFixed(selectedAssetId === 'BTC' ? 4 : 2)}
                </div>
                <div className="text-center text-slate-400">
                  ${order.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-left text-slate-500 text-[10px]">
                  {order.timestamp.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer mini summary */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>شراء: 58%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <span>بيع: 42%</span>
        </div>
      </div>
    </div>
  );
}
