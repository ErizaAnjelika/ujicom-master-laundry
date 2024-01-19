import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import Footer from "../../component/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Users = () => {
  const [users, setUsers] = useState([]);

  //state validasi
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isRoleValid, setIsRoleValid] = useState(false);


  // state input touched
  const [isTouched, setIsTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPassTouched, setIsPassTouched] = useState(false);
  const [isRoleTouched, setIsRoleTouched] = useState(false);


  const isEmailValidCheck = (email) => {
    return email.includes("@");
  };

  //state form tambah data
  const [isCreateForm, setIsCreateForm] = useState(false);

  // state tambah data
  const [createData, setCreateData] = useState({
    name: "",
    email:"",
    password: "",
    role: "",
  });

  //state memunculkan form update
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  //state update data
  const [updateData, setUpdateData] = useState({
    name: "",
    email:"",
    password: "",
    role: "",
  });

  // state search, filter, dan pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [perPage, setPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [roleFilter, setRoleFilter] = useState("all");
  useEffect(() => {
    const filteredData = users.filter(
      (user) =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (roleFilter === "all" || user.role === roleFilter)
    );
    setFilteredUsers(filteredData);

    fetchData();
  }, [searchTerm, roleFilter, users]);

  // read data
  const fetchData = async () => {
    try {
      // Panggil API atau sumber data lainnya
      const response = await axios.get("http://localhost:3000/users");
      const data = response.data;

      const usersWithNumber = data.map((user, index) => ({
        ...user,
        no: index + 1,
      }));
      setUsers(usersWithNumber);
      setTotalData(data.length);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //handle open form tambah
  const handleFormOpen = () => {
    // Ketika form dibuka, set isFormOpened menjadi true
    setIsCreateForm(true);
  };

  // create data
  const handleCreate = async () => {
    try {
      await axios.post(`http://localhost:3000/users`, createData);
      fetchData();
      setIsCreateForm(false);
      setCreateData({
        name: "",
        email:"",
        password: "",
        role: "",
      });
      // Atur ulang state validasi
      setIsUsernameValid(false);
      setIsEmailValid(false);
      setIsPasswordValid(false);
      setIsRoleValid(false);

      // atur ulang state input
      setIsTouched(false);
      setIsEmailTouched(false);
      setIsPassTouched(false);
      setIsRoleTouched(false);

      // Tampilkan SweetAlert
      Swal.fire({
        title: "Berhasil",
        text: "Data Berhasil Ditambahkan",
        icon: "success",
      });
    } catch (error) {
      console.log("error tambah data", error);
      Swal.fire({
        title: "Gagal",
        text: "Data Gagal Ditambahkan",
        icon: "error",
      });
    }
  };

  // edit data
  const handleClickEdit = (userId) => {
    setUpdateData({
      id: userId.id,
      name: userId.name,
      email: userId.email,
      password: userId.password,
      role: userId.role,
    });
    console.log("Update Data:", updateData);
    setIsEditFormVisible(true);
  };
  const handleEdit = async () => {
    try {
      console.log("Update Data:", updateData);
      // edit data berdasarkan id
      await axios.put(
        `http://localhost:3000/users/${updateData.id}`,
        updateData
      );
      fetchData();
      setIsEditFormVisible(false);

      Swal.fire({
        title: "Berhasil",
        text: "Data Berhasil Diupdate",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat mengupdate data.", "error");
    }
  };

  // delete data
  const handleDelete = (id) => {
    // Menampilkan SweetAlert konfirmasi
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Memanggil API penghapusan
          const response = await axios.delete(
            `http://localhost:3000/users/${id}`
          );

          // Cek status response dari API
          if (response.status === 200) {
            // Tampilkan SweetAlert berhasil hapus
            fetchData();
            Swal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          } else {
            // Tampilkan SweetAlert gagal hapus jika status tidak sesuai
            Swal.fire(
              "Gagal!",
              "Terjadi kesalahan saat menghapus data.",
              "error"
            );
          }
        } catch (error) {
          // Tangkap error jika ada kesalahan dalam memanggil API
          console.error("Error deleting data:", error);
          // Tampilkan SweetAlert gagal hapus
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus data.",
            "error"
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Tampilkan SweetAlert cancel hapus
        Swal.fire("Dibatalkan", "Data tidak dihapus.", "info");
      }
    });
  };

 
  // handle cancel
  const handleCancel = () => {
    setIsEditFormVisible(false);
    setIsCreateForm(false);
    setUpdateData({
      
      name: "",
      email:"",
      password: "",
      role: "",

    });
    setCreateData({
      name: "",
      email:"",
      password: "",
      role: "",

    });
    setIsUsernameValid(false);
    setIsEmailValid(false);
    setIsPasswordValid(false);
    setIsRoleValid(false);

    setIsTouched(false);
    setIsEmailTouched(false);
    setIsPassTouched(false);
    setIsRoleTouched(false);
  };

  // Hitung indeks awal dan akhir data yang akan ditampilkan pada halaman saat ini
  const indexOfLastData = currentPage * perPage;
  const indexOfFirstData = indexOfLastData - perPage;
  const currentData = filteredUsers.slice(indexOfFirstData, indexOfLastData);

  const startIndex = (currentPage - 1) * perPage + 1;
  const endIndex = Math.min(startIndex + perPage - 1, totalData);
  // Hitung jumlah halaman total berdasarkan jumlah data per halaman
  const totalPageCount = Math.ceil(filteredUsers.length / perPage);

  // Event handler untuk perubahan jumlah data per halaman
  const handlePerPageChange = (value) => {
    if (value === "semua") {
      setPerPage(totalData);
    } else {
      setPerPage(Number(value));
    }
    setCurrentPage(1); // Kembali ke halaman pertama setelah mengganti jumlah per halaman
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ minHeight: "431.679px" }}>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Pengguna</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to={"/"}>Beranda</Link>
                  </li>
                  <li className="breadcrumb-item">Master Data</li>
                  <li className="breadcrumb-item active">Pengguna</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="row">
                      <div className="col-6">
                        <h3 className="card-title">Data Pengguna</h3>
                      </div>
                      
                    </div>
                  </div>
                  <div className="card-body">
                    <div
                      id="example_wrapper"
                      className="dataTables_wrapper dt-bootstrap4"
                    >
                      {/* show header */}
                      <div className="row">
                        {/* show entries */}
                        <div className="col-sm-12 col-md-6">
                          <div
                            className="dataTables_length"
                            id="example_length"
                          >
                            <label>
                              Tampilkan{" "}
                              <select
                                name="example_length"
                                aria-controls="example"
                                className="custom-select"
                                style={{ width: "60px"}}
                                value={
                                  perPage === totalData ? "semua" : perPage
                                }
                                onChange={(e) =>
                                  handlePerPageChange(e.target.value)
                                }
                              >
                                <option value="semua">Semua</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                              </select>{" "}
                              Data
                            </label>
                          </div>
                        </div>
                        {/* search */}
                        <div className="col-sm-12 col-md-6">
                          <div
                            id="example_filter"
                            className="dataTables_filter d-flex justify-content-end"
                          >
                            <div
                              className="input-group"
                              style={{ width: "300px" }}
                            >
                              <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder="Cari.."
                                aria-controls="example"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                              <div className="input-group-append">
                                <span className="input-group-text">
                                  <i className="fas fa-search"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* button create */}
                        <div className=" col-12 d-flex justify-content-between mt-3">
                        <div className="mb-3 ">
                          <button
                            className="btn bg-gradient-success"
                            onClick={handleFormOpen}
                          >
                            <i class="fas fa-plus"></i> Pengguna
                          </button>
                          
                        </div>
                        
                        <select
                          className="custom-select"
                          style={{ width: "120px"}}
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                        >
                          <option value="all">Semua</option>
                          <option value="pelanggan">Pelanggan</option>
                          <option value="admin">Admin</option>
                          {/* Tambahkan opsi lain sesuai kebutuhan */}
                        </select>
                      </div>
                      </div>
                      {/* akhir show header */}

                      {/* form create */}
                      {isCreateForm && (
                        <div className="card card-success">
                          <div className="card-header">
                            <h3 className="card-title">Form Tambah Pengguna</h3>
                            <div className="card-tools">
                              <button
                                type="button"
                                className="btn btn-tool"
                                data-card-widget="collapse"
                                onClick={handleCancel}
                              >
                                <i className="fas fa-minus" />
                              </button>
                            </div>
                          </div>
                          <div className="form-horizontal">
                            <div className="card-body">
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Name
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={createData.name}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        name: e.target.value,
                                      });
                                      setIsTouched(true);
                                      setIsUsernameValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    onBlur={() => setIsTouched(true)}
                                    className={`form-control ${
                                      isTouched && !isUsernameValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isTouched && isUsernameValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Name"
                                  />
                                  {isTouched && !isUsernameValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan username.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Email
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      isEmailTouched && !isEmailValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isEmailTouched && isEmailValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    value={createData.email}
                                    onBlur={() => setIsEmailTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        email: e.target.value,
                                      });
                                      setIsEmailTouched(true);
                                      setIsEmailValid(
                                        isEmailValidCheck(inputValue)
                                      );
                                    }}
                                    placeholder="contoh : user1@gmail.com"
                                  />
                                  {isEmailTouched && !isEmailValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      {createData.email.trim() !== ""
                                        ? "Harap masukkan alamat email yang valid."
                                        : "Harap masukkan email."}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Password
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="password"
                                    value={createData.password}
                                    onBlur={() => setIsPassTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        password: e.target.value,
                                      });
                                      setIsPassTouched(true);
                                      setIsPasswordValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isPassTouched && !isPasswordValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isPassTouched && isPasswordValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Password"
                                  />
                                  {isPassTouched && !isPasswordValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan password.
                                    </div>
                                  )}
                                </div>
                              </div>
                             
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Role
                                </label>
                                <div className="col-sm-10">
                                  <select
                                    value={createData.role}
                                    onBlur={() => setIsRoleTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        role: e.target.value,
                                      });
                                      setIsRoleTouched(true);
                                      setIsRoleValid(inputValue.trim() !== "");
                                    }}
                                    className={`form-control ${
                                      isRoleTouched && !isRoleValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isRoleTouched && isRoleValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                  >
                                    <option value="">Pilih Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="pelanggan">Pelanggan</option>
                                  </select>
                                  {isRoleTouched && !isRoleValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap pilih role.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="card-footer">
                              <button
                                type="submit"
                                className="btn btn-success"
                                onClick={handleCreate}
                                disabled={!isUsernameValid}
                              >
                                Simpan
                              </button>
                              <button
                                type="submit"
                                onClick={handleCancel}
                                className="btn btn-danger ml-3"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* akhir form create */}

                      {/* form edit */}
                      {isEditFormVisible && (
                        <div className="card card-warning">
                          <div className="card-header">
                            <h3 className="card-title">Form Edit Pengguna</h3>
                            <div className="card-tools">
                              <button
                                type="button"
                                className="btn btn-tool"
                                data-card-widget="collapse"
                                onClick={handleCancel}
                              >
                                <i className="fas fa-minus" />
                              </button>
                            </div>
                          </div>
                          <div className="form-horizontal">
                            <div className="card-body">
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Name
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={updateData.name}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        name: e.target.value,
                                      });
                                      setIsTouched(true);
                                      setIsUsernameValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    onBlur={() => setIsTouched(true)}
                                    className={`form-control ${
                                      isTouched && !isUsernameValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isTouched && isUsernameValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan username"
                                  />
                                  {/* {isTouched && !isUsernameValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan username.
                                    </div>
                                  )} */}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Email
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      isEmailTouched && !isEmailValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isEmailTouched && isEmailValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    value={updateData.email}
                                    onBlur={() => setIsEmailTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        email: e.target.value,
                                      });
                                      setIsEmailTouched(true);
                                      setIsEmailValid(
                                        isEmailValidCheck(inputValue)
                                      );
                                    }}
                                    placeholder="contoh : user1@gmail.com"
                                  />
                                  {isEmailTouched && !isEmailValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      {updateData.email.trim() !== ""
                                        ? "Harap masukkan alamat email yang valid."
                                        : "Harap masukkan email."}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Password
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="password"
                                    value={updateData.password}
                                    onBlur={() => setIsPassTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        password: e.target.value,
                                      });
                                      setIsPassTouched(true);
                                      setIsPasswordValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isPassTouched && !isPasswordValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isPassTouched && isPasswordValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Password"
                                  />
                                  {isPassTouched && !isPasswordValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan password.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Role
                                </label>
                                <div className="col-sm-10">
                                  <select
                                    value={updateData.role}
                                    onBlur={() => setIsRoleTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        role: e.target.value,
                                      });
                                      setIsRoleTouched(true);
                                      setIsRoleValid(inputValue.trim() !== "");
                                    }}
                                    className={`form-control ${
                                      isRoleTouched && !isRoleValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isRoleTouched && isRoleValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                  >
                                    <option value="">Pilih Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="pelanggan">Pengguna</option>
                                  </select>
                                  {isRoleTouched && !isRoleValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap pilih role.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="card-footer">
                              <button
                                type="submit"
                                className="btn btn-success"
                                onClick={handleEdit}
                                // disabled={!isPasswordValid}
                              >
                                Simpan
                              </button>
                              <button
                                type="submit"
                                onClick={handleCancel}
                                className="btn btn-danger ml-3"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* akhir form edit */}

                      {/* data table */}
                      <div className="row dt-row">
                        <div className="col-sm-12">
                          <table
                            id="tablePengguna"
                            className="table table-striped dataTable"
                            aria-describedby="example_info"
                          >
                            <thead>
                              <tr>
                                <th>No</th>
                                <th
                                  
                                >
                                  Name
                                </th>
                                <th
                                 
                                >
                                  Email
                                </th>
                                <th
                                  
                                >
                                  Role
                                </th>
                                <th
                                
                                >
                                  Aksi
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentData.map((user) => (
                                <tr key={user.id}>
                                  <td>{user.no}</td>
                                  <td>
                                    {user.name}
                                  </td>
                                  <td>
                                    {user.email}
                                  </td>
                                  <td>{user.role}</td>
                                  <td className="d-flex">
                                    <div className="btn-group mr-1">
                                      <button
                                        className="btn btn-sm bg-gradient-warning"
                                        onClick={() => handleClickEdit(user)}
                                      >
                                        <i className="fas fa-pen"></i> Edit
                                      </button>
                                    </div>
                                    <div className="btn-group">
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleDelete(user.id)
                                        }
                                      >
                                        <i className="fas fa-trash"></i> Hapus
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/* akhir datatable */}

                      {/* pagination */}
                      <div className="row">
                        <div className="col-sm-12 col-md-5">
                          <div
                            className="dataTables_info"
                            id="example_info"
                            role="status"
                            aria-live="polite"
                          >
                            Tampilkan {startIndex} - {endIndex} dari {totalData}{" "}
                            data
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                          <div
                            className="dataTables_paginate paging_simple_numbers d-flex justify-content-end"
                            id="example_paginate"
                          >
                            <ul className="pagination">
                              <li
                                className={`paginate_button page-item previous ${
                                  currentPage === 1 ? "disabled" : ""
                                }`}
                                id="example_previous"
                              >
                                <button
                                  onClick={() =>
                                    setCurrentPage((prevPage) => prevPage - 1)
                                  }
                                  disabled={currentPage === 1}
                                  className="page-link"
                                >
                                  Sebelumnya
                                </button>
                              </li>
                              {Array.from({ length: totalPageCount }).map(
                                (_, index) => (
                                  <li
                                    key={index + 1}
                                    className={`paginate_button page-item ${
                                      currentPage === index + 1 ? "active" : ""
                                    }`}
                                  >
                                    <button
                                      onClick={() => setCurrentPage(index + 1)}
                                      className="page-link"
                                    >
                                      {index + 1}
                                    </button>
                                  </li>
                                )
                              )}
                              <li
                                className={`paginate_button page-item next ${
                                  currentPage === totalPageCount
                                    ? "disabled"
                                    : ""
                                }`}
                                id="example_next"
                              >
                                <button
                                  onClick={() =>
                                    setCurrentPage((prevPage) => prevPage + 1)
                                  }
                                  disabled={currentPage === totalPageCount}
                                  className="page-link"
                                >
                                  Selanjutnya
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {/* akhir pagination */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Users;
