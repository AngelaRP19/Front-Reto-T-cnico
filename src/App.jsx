import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/common/RequireAuth";
import { lazy, Suspense } from "react";

const OAuthProfileGate = lazy(() =>
  import("./features/auth/components/OAuthProfileGate")
);

const MainLayout = lazy(() =>
  import("./components/layout/MainLayout")
);

const HomePage = lazy(() =>
  import("./features/catalog/pages/HomePage")
);

const ExpansionDetailPage = lazy(() =>
  import("./features/catalog/pages/ExpansionDetailPage")
);

const ChallengesPage = lazy(() =>
  import("./features/challenges/pages/ChallengesPage")
);

const ProfileLayout = lazy(() =>
  import("./features/profile/pages/ProfileLayout")
);

const ProfileInfoTab = lazy(() =>
  import("./features/profile/pages/ProfileInfoTab")
);

const ProfileChallengesTab = lazy(() =>
  import("./features/profile/pages/ProfileChallengesTab")
);

const ProfilePurchasesTab = lazy(() =>
  import("./features/profile/pages/ProfilePurchasesTab")
);

const ProfileBetaTestingTab = lazy(() =>
  import("./features/profile/pages/ProfileBetaTestingTab")
);

const ProfileSettingsTab = lazy(() =>
  import("./features/profile/pages/ProfileSettingsTab")
);

const LoginPage = lazy(() =>
  import("./features/auth/pages/loginPage")
);

const RegisterPage = lazy(() =>
  import("./features/auth/pages/registerPage")
);

const ForgotPasswordPage = lazy(() =>
  import("./features/auth/pages/ForgotPasswordPage")
);

const ResetPasswordPage = lazy(() =>
  import("./features/auth/pages/ResetPasswordPage")
);

const CompleteProfilePage = lazy(() =>
  import("./features/auth/pages/CompleteProfilePage")
);

const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage")
);

const CartPage = lazy(() =>
  import("./features/cart/CartPage").then((m) => ({ default: m.CartPage }))
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-main-bg text-text">
          Cargando...
        </div>
      }
    >
      <OAuthProfileGate />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo/:packId" element={<ExpansionDetailPage />} />
          <Route path="/comunidad" element={<ChallengesPage />} />
          <Route
            path="/carrito"
            element={
              <RequireAuth>
                <CartPage />
              </RequireAuth>
            }
          />
          <Route
            path="/perfil"
            element={
              <RequireAuth>
                <ProfileLayout />
              </RequireAuth>
            }
          >
            <Route index element={<ProfileInfoTab />} />
            <Route path="retos" element={<ProfileChallengesTab />} />
            <Route path="compras" element={<ProfilePurchasesTab />} />
            <Route path="beta-testing" element={<ProfileBetaTestingTab />} />
            <Route path="configuracion" element={<ProfileSettingsTab />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/completar-perfil"
          element={
            <RequireAuth>
              <CompleteProfilePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
