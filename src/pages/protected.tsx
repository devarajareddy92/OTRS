import { Outlet } from "react-router-dom";
import TopBar from "@/components/topbar";

const Protected = () => {
  return (
    <div className="flex flex-col h-full">
      <TopBar />
      <Outlet />
    </div>
  );
};
export default Protected;
