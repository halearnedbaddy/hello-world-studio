import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CloudAuthProvider } from "@/contexts/CloudAuthContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { HomePage } from "./pages/HomePage";

// Lazy load pages for faster initial load
const SellerDashboard = lazy(() => import("./pages/SellerDashboard").then(m => ({ default: m.SellerDashboard })));
const BuyerDashboard = lazy(() => import("./pages/BuyerDashboard").then(m => ({ default: m.BuyerDashboard })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage").then(m => ({ default: m.AdminLoginPage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("./pages/SignupPage").then(m => ({ default: m.SignupPage })));
const LegalPage = lazy(() => import("./pages/LegalPage").then(m => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const StoreFrontPage = lazy(() => import("./pages/StoreFrontPage").then(m => ({ default: m.StoreFrontPage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage })));
const BuyPage = lazy(() => import("./pages/BuyPage").then(m => ({ default: m.BuyPage })));
const PaymentPage = lazy(() => import("./pages/PaymentPage").then(m => ({ default: m.PaymentPage })));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage").then(m => ({ default: m.OrderTrackingPage })));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <SupabaseAuthProvider>
      <CloudAuthProvider>
        <AuthProvider>
          <BrowserRouter>
            {/* Global language button — visible on all pages; z-40 so modals (z-50) cover it */}
            <LanguageSwitcher />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/buyer" element={<BuyerDashboard />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/pay/:transactionId" element={<PaymentPage />} />
                <Route path="/buy/:linkId" element={<BuyPage />} />
                <Route path="/track/:transactionId" element={<OrderTrackingPage />} />
                <Route path="/store/:storeSlug" element={<StoreFrontPage />} />
                <Route path="/store/:storeSlug/product/:productId" element={<ProductDetailPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </CloudAuthProvider>
    </SupabaseAuthProvider>
  );
}

export default App;
