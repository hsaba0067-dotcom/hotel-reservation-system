import { Toaster } from "@/component/UI/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/Authcontex';
import Layout from '@/component/layout';
import Landing from '@/page/landing';
import ClientDashboard from '@/page/clientdashboard';
import BrowseRooms from '@/page/browserooms';
import BookRoom from '@/page/bookroom';
import MyReservations from '@/page/my reservations';
import AdminDashboard from '@/admindashboard';
import AdminRooms from '@/adminrooms';
import AdminReservations from '@/adminreservation';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/rooms" element={<BrowseRooms />} />
        <Route path="/book/:roomId" element={<BookRoom />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/reservations" element={<AdminReservations />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
