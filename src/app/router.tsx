import { lazy, Suspense } from "react";
import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { RequireAuth } from "./RequireAuth";
import CourseNotReadyPage from "../pages/CourseNotReadyPage";
import { Page, EmptyState, ActionLink, SkeletonBlock } from "../components/ui";
// Keep the established learning UI for development. Exclude fixture keys/evidence
// from production until the approved catalog/read side is connected in later stages.
const DashboardPage = import.meta.env.DEV
  ? lazy(() => import("../pages/DashboardPage"))
  : CourseNotReadyPage;
const LearningPathPage = import.meta.env.DEV
  ? lazy(() => import("../pages/LearningPathPage"))
  : CourseNotReadyPage;
const TopicPage = import.meta.env.DEV
  ? lazy(() => import("../pages/TopicPage"))
  : CourseNotReadyPage;
const AssessmentPage = import.meta.env.DEV
  ? lazy(() => import("../pages/AssessmentPage"))
  : CourseNotReadyPage;
const ReviewPage = import.meta.env.DEV
  ? lazy(() => import("../pages/ReviewPage"))
  : CourseNotReadyPage;
const SessionSummaryPage = import.meta.env.DEV
  ? lazy(() => import("../pages/SessionSummaryPage"))
  : CourseNotReadyPage;
const ProgressPage = import.meta.env.DEV
  ? lazy(() => import("../pages/ProgressPage"))
  : CourseNotReadyPage;
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
function routePage(Component: ComponentType) {
  return (
    <Suspense
      fallback={
        <div className="page" aria-busy="true">
          <SkeletonBlock height={180} />
          <div className="mt-8">
            <SkeletonBlock height={350} />
          </div>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/app" replace /> },
  { path: "/login", element: routePage(LoginPage) },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/app/topic/:topicId/assessment",
        element: routePage(AssessmentPage),
      },
      {
        path: "/app",
        element: <AppShell />,
        children: [
          { index: true, element: routePage(DashboardPage) },
          { path: "path", element: routePage(LearningPathPage) },
          { path: "topic/:topicId", element: routePage(TopicPage) },
          { path: "topic/:topicId/review", element: routePage(ReviewPage) },
          {
            path: "topic/:topicId/summary",
            element: routePage(SessionSummaryPage),
          },
          { path: "progress", element: routePage(ProgressPage) },
          { path: "settings", element: routePage(SettingsPage) },
          {
            path: "*",
            element: (
              <Page>
                <EmptyState
                  title="Let’s find your path."
                  description="This page is not part of the course."
                  action={<ActionLink to="/app/path">Learning path</ActionLink>}
                />
              </Page>
            ),
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/app" replace /> },
]);
