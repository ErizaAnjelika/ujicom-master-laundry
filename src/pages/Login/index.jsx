import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleLogin = () => {
    // Lakukan validasi kredensial pengguna menggunakan API users
    if (email && password) {
      // Panggil API users untuk memverifikasi kredensial
      axios
        .post("http://localhost:3000/login", { email, password })
        .then((response) => {
          // Tangani respon dari server (berhasil atau gagal login)
          console.log(response.data);
  
          if (response.data.message === "Login berhasil (admin)") {
            // Simpan username di Local Storage
            localStorage.setItem("loggedInUser", email);
  
            // Pindah ke halaman dashboard
            navigate("/");
  
            // Tampilkan SweetAlert berhasil
            Swal.fire({
              icon: "success",
              title: "Login Berhasil",
              text: "Selamat datang, " + email + "!",
            });
          } else {
            // Tampilkan SweetAlert gagal login
            Swal.fire({
              icon: "error",
              title: "Login Gagal",
              text: "Kombinasi username dan password salah",
            });
          }
        })
        .catch((error) => {
          // Tangani kesalahan jika permintaan gagal
          console.error(error);
  
          // Tampilkan SweetAlert akses ditolak
          Swal.fire({
            icon: "error",
            title: "Akses Ditokan",
            text: "Anda tidak memiliki izin untuk mengakses halaman ini",
          });
        });
    } else {
      setError("Please enter username and password");
    }
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card">
          <div className="card-body login-card-body">
            <h3 className="login-box-msg">Silahkan Login</h3>
            <div method="post">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="">
                <button type="submit" onClick={handleLogin} className="btn btn-primary btn-block">
                  Masuk
                </button>
              </div>
            </div>
            <div>
              <p className="mb-0 mt-2">
                <Link to="/register" className="text-center">
                  Belum punya akun? Daftar disini
                </Link>
              </p>
            </div>
            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
