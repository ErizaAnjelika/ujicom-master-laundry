import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Sidebar = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const navigate = useNavigate();
  // Fungsi untuk logout
  const handleLogout = () => {
    // Tampilkan konfirmasi menggunakan Swal (SweetAlert)
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika pengguna memilih Ya, hapus data dari localStorage
        localStorage.removeItem("loggedInUser");
        // Pindah ke halaman login
        navigate("/login");
        // Tampilkan alert bahwa logout berhasil
        Swal.fire("Berhasil!", "Anda telah keluar.", "success");
      }
    });
  };
  return (
    <div>
      <aside className="main-sidebar sidebar-light-primary elevation-3">
        {/* Brand Logo */}
        <a href="#" className="brand-link">
          <img
            src="https://png.pngtree.com/png-clipart/20230124/ourlarge/pngtree-illustration-of-a-laundry-washing-machine-png-image_6568228.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-bold">LuxeLaundry</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center">
            <div className="image">
              <i
                className="fas fa-user"
                style={{ fontSize: "25px" }}
              ></i>
            </div>
            <div className="info">
              <a href="#" className="d-block">
                {loggedInUser}
              </a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item ">
                <Link to={"/"} className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Beranda</p>
                </Link>
              </li>
              <li className="nav-header">Master Data</li>
              <li className="nav-item">
                <Link to={"/users"} className="nav-link">
                  <i className="fas fa-user nav-icon" />
                  <p>Pengguna</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/pelanggan"} className="nav-link">
                  <i className="fas fa-users nav-icon" />
                  <p>Pelanggan</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/unitMesinCuci"} className="nav-link">
                  <img className="nav-icon" src="../../public/icons8-washing-50.png" />
                  <p>Unit Mesin Cuci</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/jasaLaundry"} className="nav-link">
                <img className="nav-icon" src="../../public/icons8-laundry-bag-50.png" />
                  <p>Jasa Laundry</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/jenisBarang"} className="nav-link">
                <img className="nav-icon" src="../../public/icons8-laundry-64.png" />
                  <p>Jenis Barang Laundry</p>
                </Link>
              </li>
              <li className="nav-item fixed-bottom ml-2 mb-2">
                <Link onClick={handleLogout} className="nav-link">
                  <i className="nav-icon fas fa-arrow-right" />
                  <p>Keluar</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};

export default Sidebar;
