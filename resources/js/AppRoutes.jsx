import React, { Suspense, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import PublicLayouts from "./layouts/PublicLayouts";
import { PublicRoutes } from "./routes/publicRoutes";
import NotFound from "./pages/NotFound";
import UserDashboardLayout from "./layouts/UserDashboardLayout";
import { UserRoutes } from "./routes/UserRoutes";
import I18nProvider from "./providers/i18n";
import CoachDashboardLayout from "./layouts/CoachDashboardLayout";
import { CoachRoutes } from "./routes/CoachRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import UserProviders from "./providers/userProvider";
import SiteProvider from "./context/site";
import { ModalProvider } from "./context/modalContext";
import { setFavicon } from "./helpers/utils";
import ScrollToTop from "./components/common/Scrolltop";

const AppRoutes = () => {
    useEffect(() => {

        fetch("/api/favicon")
            .then((response) => response.json())
            .then((data) => {
                if (data.data) {
                    setFavicon(data.data);
                }
            })
            .catch((error) => console.error("Error fetching favicon:", error));
    }, []);
    return (
        <I18nProvider>
            <SiteProvider>
                <UserProviders>
                    <ModalProvider>
                        <BrowserRouter>
                            <Suspense fallback={<div>Loading...</div>}>
                            <ScrollToTop />
                                <Routes>
                                    {/* Public Layout */}
                                    <Route path="/" element={<PublicLayouts />}>
                                        {/* Public routes */}
                                        {PublicRoutes.map((route, index) => (
                                            <Route
                                                key={index}
                                                path={route.path}
                                                element={<route.component />}
                                            />
                                        ))}

                                        {/* User Dashboard Layout */}
                                        <Route
                                            path="user/"
                                            element={<UserDashboardLayout />}
                                        >
                                            {/* User routes */}
                                            {UserRoutes.map((route, index) => (
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    element={<route.component />}
                                                />
                                            ))}
                                        </Route>
                                        <Route
                                            path="coach/"
                                            element={<CoachDashboardLayout />}
                                        >
                                            {/* User routes */}
                                            {CoachRoutes.map((route, index) => (
                                                <Route
                                                    key={index}
                                                    path={route.path}
                                                    element={<route.component />}
                                                />
                                            ))}
                                        </Route>

                                    </Route>
                                    <Route
                                        path="admin/"
                                        element={<AdminDashboardLayout />}
                                    >
                                        {/* User routes */}
                                        {AdminRoutes.map((route, index) => (
                                            <Route
                                                key={index}
                                                path={route.path}
                                                element={<route.component />}
                                            />
                                        ))}
                                    </Route>
                                    {/* Catch-all route for undefined paths */}
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Suspense>
                        </BrowserRouter>
                    </ModalProvider>
                </UserProviders>
            </SiteProvider>
        </I18nProvider>
    );
};

export default AppRoutes;
