import { Navigate, useLocation } from "react-router";

interface IPrivateRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

function PrivateRoute({ isLoggedIn, children }: IPrivateRouteProps) {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

export default PrivateRoute;
