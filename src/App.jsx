import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import NotFound from './pages/NotFound';

// Fitur Dashboard
import Assets from './pages/dashboard/Assets';
import AssetDetail from './pages/dashboard/AssetDetail';
import AddAsset from './pages/dashboard/AddAsset';
import EditAsset from './pages/dashboard/EditAsset';
import Requests from './pages/dashboard/Requests';
import AddRequest from './pages/dashboard/AddRequest';
import Repairs from './pages/dashboard/Repairs';
import AddRepair from './pages/dashboard/AddRepair';
import Calibration from './pages/dashboard/Calibration';
import AddCalibration from './pages/dashboard/AddCalibration';
import Mutation from './pages/dashboard/Mutation';
import AddMutation from './pages/dashboard/AddMutation';
import Notifications from './pages/dashboard/Notifications';
import Settings from './pages/dashboard/Settings';

// Fitur Teknisi
import TechnicianLayout from './components/TechnicianLayout';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianRepairs from './pages/technician/TechnicianRepairs';
import TechnicianScan from './pages/technician/TechnicianScan';
import TechnicianHistory from './pages/technician/TechnicianHistory';
import TechnicianProfile from './pages/technician/TechnicianProfile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          
          {/* Rute Fitur Sidebar */}
          <Route path="assets" element={<Assets />} />
          <Route path="assets/detail/:id" element={<AssetDetail />} />
          <Route path="assets/add" element={<AddAsset />} />
          <Route path="assets/edit/:id" element={<EditAsset />} />
          
          <Route path="requests" element={<Requests />} />
          <Route path="requests/add" element={<AddRequest />} />
          
          <Route path="repairs" element={<Repairs />} />
          <Route path="repairs/add" element={<AddRepair />} />
          
          <Route path="calibration" element={<Calibration />} />
          <Route path="calibration/add" element={<AddCalibration />} />
          
          <Route path="mutation" element={<Mutation />} />
          <Route path="mutation/add" element={<AddMutation />} />

          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/technician" element={<TechnicianLayout />}>
          <Route index element={<TechnicianDashboard />} />
          <Route path="repairs" element={<TechnicianRepairs />} />
          <Route path="scan" element={<TechnicianScan />} />
          <Route path="history" element={<TechnicianHistory />} />
          <Route path="profile" element={<TechnicianProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
