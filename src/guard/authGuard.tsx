import { isAuthenticated } from "@/components/api/authApi";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return <>{authenticated && children}</>;
};

export default AuthGuard;
