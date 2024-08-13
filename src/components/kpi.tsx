const kpis = [
  { label: "pending tickets", value: 10 },
 
  { label: "breached", value: 18 },
  { label: "about to breach", value: 18 },
  { label: "not assigned", value: 18 },
  { label: "technicians available", value: 18 },
];

const KPI = () => {
  return (
    <div className="w-full mt-6 justify-center">
      <div className="flex gap-10 w-full items-center justify-center ">
        {kpis.map((kpi, index) => (
          <div
            className={`px-3 py-4 rounded-md border border-muted ${
              kpi.label === "technicians available" && "bg-green-600"
            } 
            ${kpi.label === "not assigned" && "bg-slate-500 "}
            ${kpi.label === "pending tickets" && "bg-yellow-500 "}
            // ${kpi.label === "raised today" && "bg-blue-500 "}
            ${kpi.label === "breached" && "bg-red-600 "} ${
              kpi.label === "about to breach" && "bg-orange-500 animate-pulse"
            }`}
            key={index}
          >
            <span className="flex align-text-bottom gap-2 align-bottom">
              <p className="text-2xl font-thin">{kpi.value}</p>
              <p className="text-xs pt-2 capitalize">{kpi.label}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPI;
