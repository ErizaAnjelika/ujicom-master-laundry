import Dashboard from "./pages/Home/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";
import JasaLaundry from "./pages/JasaLaundry";
import JenisBarangLaundry from "./pages/JenisBarangLaundry";
import UnitMesinCuci from "./pages/UnitMesinCuci";
import ProtectedRoute from './hoc/ProtectedRoute';
import Register from "./pages/Registrasi";
import Pelanggan from "./pages/Pelanggan";

export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register/>,
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pelanggan',
    element: (
      <ProtectedRoute>
        <Pelanggan/>
      </ProtectedRoute>
    ),
  },
  {
    path: '/jasaLaundry',
    element: (
      <ProtectedRoute>
        <JasaLaundry/>
      </ProtectedRoute>
    ),
  },
  {
    path: '/jenisBarang',
    element: (
      <ProtectedRoute>
        <JenisBarangLaundry/>
      </ProtectedRoute>
    ),
  },
  {
    path: '/unitMesinCuci',
    element: (
      <ProtectedRoute>
        <UnitMesinCuci/>
      </ProtectedRoute>
    ),
  },
];
