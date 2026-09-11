import { createBrowserRouter, Link } from "react-router-dom"
import SiteLayout from "@/features/site/SiteLayout"
import SiteHome from "@/features/site/HomePage"
import SiteAbout from "@/features/site/AboutPage"
import V2Layout from "@/features/student-v2/V2Layout"
import V2Dashboard from "@/features/student-v2/dashboard/Dashboard"
import V2SeanceScreen from "@/features/student-v2/SeanceScreen"
import { V2Placeholder } from "@/features/student-v2/V2Placeholder"
import V2RecordingsScreen from "@/features/student-v2/recordings/RecordingsScreen"
import V2SubjectRecordingsScreen from "@/features/student-v2/recordings/SubjectRecordingsScreen"
import V2CalendarScreen from "@/features/student-v2/calendar/CalendarScreen"
import V2VideoScreen from "@/features/student-v2/video/VideoScreen"
import V2OffersScreen from "@/features/student-v2/offers/OffersScreen"
import LoginPage from "@/features/auth/LoginPage"
import RegisterPage from "@/features/auth/RegisterPage"
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage"

function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-v2-canvas px-4 text-center text-v2-ink">
      <div>
        <h1 className="text-2xl font-bold">الصفحة ما تلقاتش</h1>
        <p className="mt-2 text-sm text-v2-ink/60">الصفحة هاذي مازالت ما موجودةش.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-v2-brand hover:underline">
          ارجع للرئيسية
        </Link>
      </div>
    </div>
  )
}

/**
 * Wael Academy v2 — two areas, from the Figma redesign:
 *   /             the public site (landing + « شكون نحنا »)
 *   /connexion    the door — sign in, sign up, reset the password
 *   /student-v2   the élève space
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <SiteHome /> },
      { path: "a-propos", element: <SiteAbout /> },
    ],
  },
  /* The door — « Log In » and the two screens it opens onto. Outside every
     shell: no header, no rail. */
  { path: "/connexion", element: <LoginPage /> },
  { path: "/inscription", element: <RegisterPage /> },
  { path: "/mot-de-passe-oublie", element: <ForgotPasswordPage /> },
  {
    path: "/student-v2",
    element: <V2Layout />,
    children: [
      { index: true, element: <V2Dashboard /> },
      { path: "seance/:id", element: <V2SeanceScreen /> },
      { path: "video/:kind/:id", element: <V2VideoScreen /> },
      { path: "calendrier", element: <V2CalendarScreen /> },
      { path: "seances", element: <V2RecordingsScreen /> },
      { path: "seances/:subjectId", element: <V2SubjectRecordingsScreen /> },
      { path: "offres", element: <V2OffersScreen /> },
      { path: "groupes", element: <V2Placeholder title="مجموعاتي" note="صفحة جديدة — تستنّى التصميم متاعها." /> },
      { path: "matieres", element: <V2Placeholder title="موادك" /> },
      { path: "devoirs", element: <V2Placeholder title="التمارين" /> },
      { path: "profil", element: <V2Placeholder title="بروفيلي" /> },
      { path: "parametres", element: <V2Placeholder title="الإعدادات" /> },
      { path: "porte-monnaie", element: <V2Placeholder title="المحفظة" /> },
      { path: "favoris", element: <V2Placeholder title="مفضّلاتي" /> },
      { path: "codes", element: <V2Placeholder title="كوداتي" /> },
      { path: "*", element: <V2Placeholder title="الصفحة ما تلقاتش" /> },
    ],
  },
  { path: "*", element: <NotFound /> },
])
