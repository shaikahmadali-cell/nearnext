import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Offers from './pages/Offers';
import OfferDetails from './pages/OfferDetails';
import Businesses from './pages/Businesses';
import BusinessDetails from './pages/BusinessDetails';
import Profile from './pages/Profile';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import SavedOffers from './pages/customer/SavedOffers';
import CustomerEnquiries from './pages/customer/Enquiries';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import MyBusiness from './pages/business/MyBusiness';
import CreateOffer from './pages/business/CreateOffer';
import EditOffer from './pages/business/EditOffer';
import MyOffers from './pages/business/MyOffers';
import BusinessEnquiries from './pages/business/Enquiries';
import Analytics from './pages/business/Analytics';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminBusinesses from './pages/admin/Businesses';
import AdminOffers from './pages/admin/Offers';
import AdminReports from './pages/admin/Reports';

function App() {
  return (
    <ToastProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/offers/:id" element={<OfferDetails />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/businesses/:id" element={<BusinessDetails />} />

            {/* Authenticated Shared Profile Route */}
            <Route element={<ProtectedRoute allowedRoles={['customer', 'business', 'admin']} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Customer Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['customer', 'business', 'admin']} />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/saved" element={<SavedOffers />} />
              <Route path="/customer/enquiries" element={<CustomerEnquiries />} />
            </Route>

            {/* Business Owner Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['business', 'admin']} />}>
              <Route path="/business/dashboard" element={<BusinessDashboard />} />
              <Route path="/business/profile" element={<MyBusiness />} />
              <Route path="/business/create-offer" element={<CreateOffer />} />
              <Route path="/business/edit-offer/:id" element={<EditOffer />} />
              <Route path="/business/my-offers" element={<MyOffers />} />
              <Route path="/business/enquiries" element={<BusinessEnquiries />} />
              <Route path="/business/analytics" element={<Analytics />} />
            </Route>

            {/* Admin Console Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/businesses" element={<AdminBusinesses />} />
              <Route path="/admin/offers" element={<AdminOffers />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route
              path="*"
              element={
                <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>404</h1>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
                  <a href="/" className="btn btn-primary">Return Home</a>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
