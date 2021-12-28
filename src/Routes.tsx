import * as React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NotFound from "./containers/NotFound";
import Signup from "./containers/Signup";
import { selectIsAuthKnown, selectIsLoggedIn } from "./features/auth/authSlice";

const RequireAuth = ({ children }: { children: React.ReactElement }): React.ReactElement => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn);
    const isAuthKnown = useAppSelector(selectIsAuthKnown);
    const location = useLocation();

    const isFullyLoggedIn = isAuthKnown && isLoggedIn;

    if (!isFullyLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <Home />
                    </RequireAuth>
                }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
