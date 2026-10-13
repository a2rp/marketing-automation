import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";

const Journeys = lazy(() => import("./pages/journeys"));
const JourneyBuilder = lazy(() => import("./pages/journeyBuilder"));
const Campaigns = lazy(() => import("./pages/campaigns"));
const Audiences = lazy(() => import("./pages/audiences"));
const NotFound = lazy(() => import("./pages/notFound"));

const AppRoutes = (props) => {
  const location = useLocation();
  return <Suspense key={location.pathname} fallback={<Loading />}><Routes>
    <Route path="/" element={<Navigate to="/journeys" replace />} />
    <Route path="/journeys" element={<Journeys {...props} />} />
    <Route path="/journeys/:journeyId" element={<JourneyBuilder {...props} />} />
    <Route path="/campaigns" element={<Campaigns {...props} />} />
    <Route path="/audiences" element={<Audiences {...props} />} />
    <Route path="*" element={<NotFound />} />
  </Routes></Suspense>;
};

export default AppRoutes;
