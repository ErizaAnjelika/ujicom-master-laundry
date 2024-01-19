import { Outlet, Navigate } from 'react-router-dom';
/**
 *Todo: outlet dan navigate pustaka dari "react-router-dom"
 */



// hoc adalah hire order component, untuk melindungi route
// Authentication dan Authorization: HOC dapat digunakan untuk mengamankan komponen dengan memeriksa apakah pengguna sudah login atau memiliki izin akses yang sesuai sebelum memperlihatkan komponen tersebut.

//todo: komponen yang menerima props "children"
const ProtectedRoute = ({ children }) => {
  //Todo: Mengambil pengguna yang sudah login dari localstorage browser
  const loggedInUser = localStorage.getItem("loggedInUser");

  //Todo: Redirect ke halaman login jika pengguna belum login
  if (!loggedInUser) {
    return <Navigate to={'/login'} />;
  }

  //Todo: Tampilkan komponen children, ketika sudah login
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;