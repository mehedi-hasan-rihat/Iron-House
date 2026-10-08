"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const ACC = "#BFE01D";

type DataPoint = { label: string; revenue: number };

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-[#BFE01D]/20 px-3 py-2 text-xs">
      <p className="text-[#9aa87a] uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className="text-[#f2f4e8] font-medium">৳{Number(payload[0].value).toLocaleString()}</p>
    </div>
  );
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={ACC} stopOpacity={0.18} />
            <stop offset="100%" stopColor={ACC} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(191,224,29,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "#9aa87a", fontSize: 9, fontFamily: "inherit", letterSpacing: "0.1em" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#9aa87a", fontSize: 9, fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: ACC, strokeWidth: 1, strokeOpacity: 0.3 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={ACC}
          strokeWidth={2}
          fill="url(#revGrad)"
          dot={{ fill: ACC, r: 3, strokeWidth: 0 }}
          activeDot={{ fill: ACC, r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
