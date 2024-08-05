const kpis = [
  { label: "pending tickets", value: 10 },
  { label: "raised today", value: 2 },
  { label: "breached", value: 18 },
  { label: "about to breach", value: 18 },
  { label: "not assigned", value: 18 },
  { label: "technicians available", value: 18 },
];

const KPI = () => {
  return (
    <div className="w-full mt-6 flex justify-center">
      <div className="flex flex-row gap-10 w-full items-center justify-center">
        {kpis.map((kpi, index) => (
          <div
            className={`px-6 py-4 rounded-md border border-muted ${
              kpi.label === "technicians available" && "bg-green-600"
            } 
            ${kpi.label === "not assigned" && 'bg-slate-500 '}
            ${kpi.label === "raised today" && 'bg-yellow-500 '}
            ${kpi.label === "breached" && "bg-red-600 "} ${
              kpi.label === "about to breach" && "bg-orange-500 animate-pulse"
            }`}
            key={index}
          >
            <p className="font-semibold text-2xl ">{kpi.value}</p>
            <p className="text-xs capitalize">{kpi.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPI;
