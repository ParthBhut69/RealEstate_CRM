import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Properties from './pages/Properties';
import Inquiries from './pages/Inquiries';
import Tasks from './pages/Tasks';
import ProjectsList from './pages/Projects/ProjectsList';
import ProjectForm from './pages/Projects/ProjectForm';
import ProjectDetails from './pages/Projects/ProjectDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminPanel from './pages/AdminPanel';
import GenericFormPage from './pages/GenericFormPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id/edit" element={<GenericFormPage type="property" isEdit={true} />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="inquiries/:id/edit" element={<GenericFormPage type="inquiry" isEdit={true} />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="projects" element={<ProjectsList />} />
        <Route path="projects/new" element={<GenericFormPage type="project" />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="projects/:id/edit" element={<ProjectForm isEdit={true} />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="add-property" element={<GenericFormPage type="property" />} />
        <Route path="add-project" element={<GenericFormPage type="project" />} />
        <Route path="add-inquiry" element={<GenericFormPage type="inquiry" />} />
        <Route path="add-task" element={<GenericFormPage type="task" />} />
      </Route>
    </Routes>
  );
}

export default App;
