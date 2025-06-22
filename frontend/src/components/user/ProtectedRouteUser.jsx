import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || user.role !== "student") {
      toast.error("Please login first!");
      navigate("/login");
    }
  }, [user, navigate]);

  return <>{children}</>;
};
export default ProtectedRoute;
