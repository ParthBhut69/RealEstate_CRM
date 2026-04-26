import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Properties from './pages/Properties';
import Inquiries from './pages/Inquiries';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="properties" element={<Properties />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="projects" element={<Projects />} />
      </Route>
    </Routes>
  );
}

export default App;
