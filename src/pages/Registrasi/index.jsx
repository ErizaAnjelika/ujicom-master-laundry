import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response= await axios.post("http://localhost:3000/register",{
        name: name,
        email: email,
        password: password,
        role: role,
      });

      console.log(response.data);

      if (response.data.message === "Registrasi berhasil") {
        // Simpan username di Local Storage
        localStorage.setItem("loggedInUser", name);

        // Tampilkan SweetAlert berhasil
        Swal.fire({
            icon: "success",
            title: "Registrasi Berhasil",
            text: "Selamat datang, " + name + "!",
          }).then(()=>{
            
              navigate("/");
            
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Registrasi Gagal",
            text: "Terjadi kesalahan dalam proses registrasi",
          });
        }

        console.log('====================================');
        console.log(response.data);
        console.log('====================================');
    } catch (error) {
      // Tangani kesalahan jika permintaan gagal
      console.error(error);

      // Tampilkan SweetAlert akses ditolak
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Anda tidak memiliki izin untuk mengakses halaman ini",
      });
    };
  };
  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card">
          <div className="card-body login-card-body">
            <h3 className="login-box-msg">Silahkan Daftar</h3>
            <div method="post">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nama"
                  value={name}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
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
              <div className="input-group mb-3 me-2">
                <select className="form-control" value={role}
                  onChange={(e) => setRole(e.target.value)}>
                  <option value="">Pilih Role</option>
                  <option value="admin">Admin</option>
                  <option value="pelanggan">Pelanggan</option>
                </select>
              </div>

              <div className="">
                <button type="submit" onClick={handleRegister} className="btn btn-primary btn-block">
                  Daftar
                </button>
              </div>
            </div>
            <div>
              <p className="mb-0 mt-2">
                <Link to="/login" className="text-center">
                  Sudah Punya Aku? Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
