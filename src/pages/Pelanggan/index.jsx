import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import Footer from "../../component/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Pelanggan = () => {
  const [pelanggan, setPelanggan] = useState([]);

  //state validasi
  const [isNamaDepanValid, setIsNamaDepanValid] = useState(false);
  const [isNamaBelakangValid, setIsNamaBelakangValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isAlamatValid, setIsAlamatValid] = useState(false);
  const [isNomorValid, setIsNomorValid] = useState(false);

  // state input touched
  const [isDepanTouched, setIsDepanTouched] = useState(false);
  const [isBelakangTouched, setIsBelakangTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isAlamatTouched, setIsAlamatTouched] = useState(false);
  const [isNomorTouched, setIsNomorTouched] = useState(false);

  const isEmailValidCheck = (email) => {
    return email.includes("@");
  };

  //state form tambah data
  const [isCreateForm, setIsCreateForm] = useState(false);

  // state tambah data
  const [createData, setCreateData] = useState({
    namaDepan: "",
    namaBelakang: "",
    email: "",
    alamat: "",
    nomorTelepon: "",
  });

  //state memunculkan form update
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  //state update data
  const [updateData, setUpdateData] = useState({
    namaDepan: "",
    namaBelakang: "",
    email: "",
    alamat: "",
    nomorTelepon: "",
  });

  // state search, filter, dan pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [perPage, setPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [roleFilter, setRoleFilter] = useState("all");
  useEffect(() => {
    const filteredData =pelanggan.filter(
      (user) =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (roleFilter === "all" || user.role === roleFilter)
    );
    setFilteredUsers(filteredData);

    fetchData();
  }, [searchTerm, roleFilter, pelanggan]);

  // read data
  const fetchData = async () => {
    try {
      // Panggil API atau sumber data lainnya
      const response = await axios.get("http://localhost:3000/pelanggan");
      const data = response.data;

      const usersWithNumber = data.map((user, index) => ({
        ...user,
        no: index + 1,
      }));
      setPelanggan(usersWithNumber);
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
      await axios.post(`http://localhost:3000/pelanggan`, createData);
      fetchData();
      setIsCreateForm(false);
      setCreateData({
        namaDepan: "",
        namaBelakang: "",
        email: "",
        alamat: "",
        nomorTelepon: "",
      });
      // Atur ulang state validasi
      setIsEmailValid(false);
      setIsAlamatValid(false);
      setIsNomorValid(false);
      setIsNamaDepanValid(false);
      setIsNamaBelakangValid(false);

      // atur ulang state input
      setIsDepanTouched(false);
      setIsBelakangTouched(false);
      setIsEmailTouched(false);
      setIsAlamatTouched(false);
      setIsNomorTouched(false);

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
      pelangganId: userId.pelangganId,
      namaDepan: userId.namaDepan,
      namaBelakang: userId.namaBelakang,
      email: userId.email,
      alamat: userId.alamat,
      nomorTelepon: userId.nomorTelepon,
    });
    console.log("Update Data:", updateData);
    setIsEditFormVisible(true);
  };

  const handleEdit = async () => {
    try {
      console.log("Update Data:", updateData);
      // edit data berdasarkan id
      await axios.put(
        `http://localhost:3000/pelanggan/${updateData.pelangganId}`,
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
  const handleDelete = (pelangganId) => {
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
            `http://localhost:3000/pelanggan/${pelangganId}`
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

  // state detail
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDetail = async (pelangganId) => {
    const response = await axios.get(`http://localhost:3000/pelanggan/${pelangganId}`);
    const data = response.data;
    setSelectedUser(data);
    setIsModalOpen(true);
    // Implementasikan logika detail sesuai kebutuhan
    console.log(`Show detail for user with ID: ${pelangganId}`);
  };
  const handleClose = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // handle cancel
  const handleCancel = () => {
    setIsEditFormVisible(false);
    setIsCreateForm(false);
    setUpdateData({
      pelangganId: "",
      namaDepan: "",
      namaBelakang: "",
      email: "",
      alamat: "",
      nomorTelepon: "",
    });
    setCreateData({
      namaDepan: "",
      namaBelakang: "",
      email: "",
      alamat: "",
      nomorTelepon: "",
    });
    setIsEmailValid(false);
    setIsAlamatValid(false);
    setIsNomorValid(false);
    setIsNamaDepanValid(false);
    setIsNamaBelakangValid(false);


    setIsDepanTouched(false);
    setIsBelakangTouched(false);
    setIsEmailTouched(false);
    setIsAlamatTouched(false);
    setIsNomorTouched(false);
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
                <h1 className="m-0">Pelanggan</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to={"/"}>Beranda</Link>
                  </li>
                  <li className="breadcrumb-item">Master Data</li>
                  <li className="breadcrumb-item active">Pelanggan</li>
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
                        <h3 className="card-title">Data Pelanggan</h3>
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
                                style={{ width: "75px" }}
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
                        <div className="col-sm-12 mb-3 ">
                          <button
                            className="btn bg-gradient-success"
                            onClick={handleFormOpen}
                          >
                            <i class="fas fa-plus"></i> Pengguna
                          </button>
                        </div>
                      </div>
                      {/* akhir show header */}

                      {/* form create */}
                      {isCreateForm && (
                        <div className="card card-success">
                          <div className="card-header">
                            <h3 className="card-title">Form Tambah Pelanggan</h3>
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
                                  Nama Depan
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={createData.namaDepan}
                                    onBlur={() => setIsDepanTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        namaDepan: e.target.value,
                                      });
                                      setIsDepanTouched(true);
                                      setIsNamaDepanValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isDepanTouched && !isNamaDepanValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isDepanTouched && isNamaDepanValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Nama Depan"
                                  />
                                  {isDepanTouched && !isNamaDepanValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan Nama Depan.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Nama Belakang
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={createData.namaBelakang}
                                    onBlur={() => setIsBelakangTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        namaBelakang: e.target.value,
                                      });
                                      setIsBelakangTouched(true);
                                      setIsNamaBelakangValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isBelakangTouched && !isNamaBelakangValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isBelakangTouched && isNamaBelakangValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Nama Belakang"
                                  />
                                  {isBelakangTouched &&
                                    !isNamaBelakangValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan nama belakang.
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
                                  Alamat
                                </label>
                                <div className="col-sm-10">
                                  <textarea
                                    type="text"
                                    value={createData.alamat}
                                    onBlur={() => setIsAlamatTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        alamat: e.target.value,
                                      });
                                      setIsAlamatTouched(true);
                                      setIsAlamatValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isAlamatTouched && !isAlamatValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isAlamatTouched && isAlamatValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Alamat"
                                  />
                                  {isAlamatTouched && !isAlamatValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan alamat.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Nomor Telepon
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      isNomorTouched && !isNomorValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isNomorTouched && isNomorValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    value={createData.nomorTelepon}
                                    onBlur={() => setIsNomorTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const sanitizedValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      );
                                      setCreateData({
                                        ...createData,
                                        nomorTelepon: sanitizedValue,
                                      });
                                      setIsNomorTouched(true);

                                      setIsNomorValid(
                                        sanitizedValue.length <= 15 && // Sesuaikan panjang maksimum
                                          sanitizedValue.startsWith("0") && // Harus diawali dengan 0
                                          /^\d+$/.test(sanitizedValue) // Hanya angka diizinkan
                                      );
                                      // setIsNomorValid(inputValue.trim() !== "");
                                    }}
                                    placeholder="Contoh : 08238345678"
                                  />
                                  {isNomorTouched && !isNomorValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan nomor telepon yang valid.
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
                                disabled={!isNamaDepanValid}
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
                            <h3 className="card-title">Form Edit Pelanggan</h3>
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
                                  Nama Depan
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={updateData.namaDepan}
                                    onBlur={() => setIsDepanTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        namaDepan: e.target.value,
                                      });
                                      setIsDepanTouched(true);
                                      setIsNamaDepanValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isDepanTouched && !isNamaDepanValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isDepanTouched && isNamaDepanValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Nama Depan"
                                  />
                                  {isDepanTouched && !isNamaDepanValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan Nama Depan.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Nama Belakang
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={updateData.namaBelakang}
                                    onBlur={() => setIsBelakangTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        namaBelakang: e.target.value,
                                      });
                                      setIsBelakangTouched(true);
                                      setIsNamaBelakangValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isBelakangTouched && !isNamaBelakangValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isBelakangTouched && isNamaBelakangValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Nama Belakang"
                                  />
                                  {isBelakangTouched &&
                                    !isNamaBelakangValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan nama belakang.
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
                                  Alamat
                                </label>
                                <div className="col-sm-10">
                                  <textarea
                                    type="text"
                                    value={updateData.alamat}
                                    onBlur={() => setIsAlamatTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        alamat: e.target.value,
                                      });
                                      setIsAlamatTouched(true);
                                      setIsAlamatValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isAlamatTouched && !isAlamatValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isAlamatTouched && isAlamatValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Alamat"
                                  />
                                  {isAlamatTouched && !isAlamatValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan alamat.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Nomor Telepon
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      isNomorTouched && !isNomorValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isNomorTouched && isNomorValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    value={updateData.nomorTelepon}
                                    onBlur={() => setIsNomorTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const sanitizedValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      );
                                      setUpdateData({
                                        ...updateData,
                                        nomorTelepon: sanitizedValue,
                                      });
                                      setIsNomorTouched(true);

                                      setIsNomorValid(
                                        sanitizedValue.length <= 15 && // Sesuaikan panjang maksimum
                                          sanitizedValue.startsWith("0") && // Harus diawali dengan 0
                                          /^\d+$/.test(sanitizedValue) // Hanya angka diizinkan
                                      );
                                    }}
                                    placeholder="Contoh: 081234567890"
                                  />
                                  {isNomorTouched && !isNomorValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Masukkan nomor telepon yang valid
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

                      {/* detail user */}
                      {isModalOpen && selectedUser && (
                        <div className="card card-info">
                          <div className="card-header">
                            <h3 className="card-title">Detail Pengguna</h3>

                            <div className="card-tools">
                              <button
                                type="button"
                                className="btn btn-tool"
                                data-card-widget="collapse"
                                onClick={handleClose}
                              >
                                <i className="fas fa-minus" />
                              </button>
                            </div>
                          </div>
                          <div className="card-body">
                            <dl className="row">
                              <dt className="col-sm-4">Nama Lengkap</dt>
                              <dd className="col-sm-8">
                                {selectedUser.namaDepan}{" "}
                                {selectedUser.namaBelakang}
                              </dd>
                              <dt className="col-sm-4">Alamat</dt>
                              <dd className="col-sm-8">
                                {selectedUser.alamat}
                              </dd>
                              <dt className="col-sm-4">Email</dt>
                              <dd className="col-sm-8">{selectedUser.email}</dd>
                              <dt className="col-sm-4">Nomor Telepon</dt>
                              <dd className="col-sm-8">
                                {selectedUser.nomorTelepon}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      )}
                      {/* akhir detail user */}

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
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  width="150"
                                  aria-label="Position: activate to sort column ascending"
                                >
                                  Nama Lengkap
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Office: activate to sort column ascending"
                                >
                                  Alamat
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Age: activate to sort column ascending"
                                >
                                  Email
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Start date: activate to sort column ascending"
                                >
                                  No Telepon
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Salary: activate to sort column ascending"
                                >
                                  Aksi
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentData.map((user) => (
                                <tr key={user.pelangganId}>
                                  <td>{user.no}</td>
                                  <td>
                                    {user.namaDepan} {user.namaBelakang}
                                  </td>
                                  <td>{user.alamat}</td>
                                  <td>{user.email}</td>
                                  <td>{user.nomorTelepon}</td>
                                  <td className="d-flex justify-content-center">
                                    <div className="btn-group mr-1">
                                      <button
                                        className="btn btn-sm bg-gradient-info"
                                        onClick={() =>
                                          handleDetail(user.pelangganId)
                                        }
                                      >
                                        <i className="fas fa-info"></i> Detail
                                      </button>
                                    </div>
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
                                          handleDelete(user.pelangganId)
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

export default Pelanggan;
