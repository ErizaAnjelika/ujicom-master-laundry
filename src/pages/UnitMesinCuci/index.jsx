import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const UnitMesinCuci = () => {
  const [unit, setUnit] = useState([]);

  //state validasi
  const [isNamaMesinValid, setIsNamaMesinValid] = useState(false);
  const [isMerekValid, setIsMerekValid] = useState(false);
  const [isKapasitasValid, setIsKapasitasValid] = useState(false);
  const [isTahunPembuatanValid, setIsTahunPembuatanValid] = useState(false);
  const [isKondisiValid, setIsKondisiValid] = useState(false);
  const [isStatusValid, setIsStatusValid] = useState(false);

  // state input touched
  const [isMesinTouched, setIsMesinTouched] = useState(false);
  const [isMerekTouched, setIsMerekTouched] = useState(false);
  const [isKapasitasTouched, setIsKapasitasTouched] = useState(false);
  const [isTahunPembuatanTouched, setIsTahunPembuatanTouched] = useState(false);
  const [isKondisiTouched, setIsKondisiTouched] = useState(false);
  const [isStatusTouched, setIsStatusTouched] = useState(false);

  // state search, filter, dan pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [perPage, setPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const filteredData = unit.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredData);

    fetchData();
  }, [searchTerm, unit]);

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

  const fetchData = async () => {
    try {
      // Panggil API atau sumber data lainnya
      const response = await axios.get(
        "http://localhost:5041/api/MasterLaundry/Get Data Master Laundry"
      );
      const data = response.data.data;

      const usersWithNumber = data.map((unit, index) => ({
        ...unit,
        no: index + 1,
      }));
      setUnit(usersWithNumber);
      setTotalData(data.length);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //state form tambah data
  const [isCreateForm, setIsCreateForm] = useState(false);

  // state tambah data
  const [createData, setCreateData] = useState({
    namaMesinCuci: "",
    merek: "",
    kapasitas: "",
    tahunPembuatan: "",
    kondisi: "",
    status: "",
  });

  //handle open form tambah
  const handleFormOpen = () => {
    // Ketika form dibuka, set isFormOpened menjadi true
    setIsCreateForm(true);
  };

  // create data
  const handleCreate = async () => {
    try {
      await axios.post(
        `http://localhost:5041/api/MasterLaundry/Create Data Master Laundry`,
        createData
      );
      fetchData();
      setIsCreateForm(false);
      setCreateData({
        namaMesinCuci: "",
        merek: "",
        kapasitas: "",
        tahunPembuatan: "",
        kondisi: "",
        status: "",
      });
      // Atur ulang state validasi
      setIsNamaMesinValid(false);
      setIsMerekValid(false);
      setIsKapasitasValid(false);
      setIsTahunPembuatanValid(false);
      setIsKondisiValid(false);
      setIsStatusValid(false);

      // atur ulang state input
      setIsMesinTouched(false);
      setIsMerekTouched(false);
      setIsKapasitasTouched(false);
      setIsTahunPembuatanTouched(false);
      setIsKondisiTouched(false);
      setIsStatusTouched(false);

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

  // handle cancel
  const handleCancel = () => {
    setIsEditFormVisible(false);
    setIsCreateForm(false);
    setUpdateData({
      namaMesinCuci: "",
      merek: "",
      kapasitas: "",
      tahunPembuatan: "",
      kondisi: "",
      status: "",
    });
    setCreateData({
      namaMesinCuci: "",
      merek: "",
      kapasitas: "",
      tahunPembuatan: "",
      kondisi: "",
      status: "",
    });
    // Atur ulang state validasi
    setIsNamaMesinValid(false);
    setIsMerekValid(false);
    setIsKapasitasValid(false);
    setIsTahunPembuatanValid(false);
    setIsKondisiValid(false);
    setIsStatusValid(false);

    // atur ulang state input
    setIsMesinTouched(false);
    setIsMerekTouched(false);
    setIsKapasitasTouched(false);
    setIsTahunPembuatanTouched(false);
    setIsKondisiTouched(false);
    setIsStatusTouched(false);
  };

  //state memunculkan form update
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  //state update data
  const [updateData, setUpdateData] = useState({
    namaMesinCuci: "",
    merek: "",
    kapasitas: "",
    tahunPembuatan: "",
    kondisi: "",
    status: "",
  });

  // edit data
  const handleClickEdit = (laundryId) => {
    setUpdateData({
      laundryId: laundryId.laundryId,
      namaMesinCuci: laundryId.namaMesinCuci,
      merek: laundryId.merek,
      kapasitas: laundryId.kapasitas,
      tahunPembuatan: laundryId.tahunPembuatan,
      kondisi: laundryId.kondisi,
      status: laundryId.status,
    });
    console.log("Update Data:", updateData);
    setIsEditFormVisible(true);
  };

  const handleEdit = async () => {
    try {
      console.log("Update Data:", updateData);
      // edit data berdasarkan id
      await axios.put(
        `http://localhost:5041/api/MasterLaundry/Edit Data Master Laundry/${updateData.laundryId}`,
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
  const handleDelete = (laundryId) => {
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
            `http://localhost:5041/api/MasterLaundry/Hapus Data MasterLaundry/${laundryId}`
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "rusak":
        return "red";
      case "tersedia":
        return "green";
      case "perbaikan":
        return "yellow";
      default:
        return "black"; // Atau warna default jika status tidak dikenali
    }
  };

  // Fungsi untuk mendapatkan warna berdasarkan kondisi
  const getKondisiColor = (kondisi) => {
    switch (kondisi.toLowerCase()) {
      case "baik":
        return "green";
      case "perbaikan":
        return "orange";
      case "rusak":
        return "red";
      default:
        return "black"; // Atau warna default jika kondisi tidak dikenali
    }
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
                <h1 className="m-0">Unit Mesin Cuci</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to={"/"}>Beranda</Link>
                  </li>
                  <li className="breadcrumb-item">Master Data</li>
                  <li className="breadcrumb-item active">Unit Mesin Cuci</li>
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
                    <h3 className="card-title">Data Unit Mesin Cuci</h3>
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
                                style={{width:'75px'}}
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
                        <div className="col-sm-12 mb-3">
                          <button
                            className="btn bg-gradient-success"
                            onClick={handleFormOpen}
                          >
                            <i class="fas fa-plus"></i> Mesin Cuci
                          </button>
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
                                  Nama Mesin Cuci
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={createData.namaMesinCuci}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        namaMesinCuci: e.target.value,
                                      });
                                      setIsMesinTouched(true);
                                      setIsNamaMesinValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    onBlur={() => setIsMesinTouched(true)}
                                    className={`form-control ${
                                      isMesinTouched && !isNamaMesinValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isMesinTouched && isNamaMesinValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan nama jasa"
                                  />
                                  {isMesinTouched && !isNamaMesinValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan nama mesin cuci.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Merek
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={createData.merek}
                                    onBlur={() => setIsMerekTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        merek: e.target.value,
                                      });
                                      setIsMerekTouched(true);
                                      setIsMerekValid(inputValue.trim() !== "");
                                    }}
                                    className={`form-control ${
                                      isMerekTouched && !isMerekValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isMerekTouched && isMerekValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Deskripsi"
                                  />
                                  {isMerekTouched && !isMerekValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan Merek.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Kapasitas
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={createData.kapasitas}
                                    onBlur={() => setIsKapasitasTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        kapasitas: inputValue,
                                      });
                                      setIsKapasitasTouched(true);
                                      // Validasi menggunakan ekspresi reguler
                                      const isNumeric = /^[0-9]+$/.test(
                                        inputValue
                                      );
                                      setIsKapasitasValid(isNumeric);
                                    }}
                                    className={`form-control ${
                                      isKapasitasTouched && !isKapasitasValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isKapasitasTouched && isKapasitasValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan kapasitas"
                                  />
                                  {isKapasitasTouched && !isKapasitasValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan kapasitas yang valid.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Tahun Pembuatan
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={createData.tahunPembuatan}
                                    onBlur={() =>
                                      setIsTahunPembuatanTouched(true)
                                    }
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        tahunPembuatan: inputValue,
                                      });
                                      setIsTahunPembuatanTouched(true);
                                      const isNumeric = /^[0-9]+$/.test(
                                        inputValue
                                      );
                                      setIsTahunPembuatanValid(isNumeric);
                                    }}
                                    className={`form-control ${
                                      isTahunPembuatanTouched &&
                                      !isTahunPembuatanValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isTahunPembuatanTouched &&
                                      isTahunPembuatanValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Tahun Pembuatan"
                                  />
                                  {isTahunPembuatanTouched &&
                                    !isTahunPembuatanValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan Tahun Pembuatan
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Kondisi
                                </label>
                                <div className="col-sm-10">
                                  <select
                                    value={createData.kondisi}
                                    onBlur={() => setIsKondisiTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        kondisi: e.target.value,
                                      });
                                      setIsKondisiTouched(true);
                                      setIsKondisiValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isKondisiTouched && !isKondisiValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isKondisiTouched && isKondisiValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                  >
                                    <option value="">Pilih Kondisi</option>
                                    <option value="Baik">Baik</option>
                                    <option value="Perbaikan">Perbaikan</option>
                                    <option value="Rusak">Rusak</option>
                                  </select>
                                  {isKondisiTouched && !isKondisiValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap pilih kondisi.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Status
                                </label>
                                <div className="col-sm-10">
                                  <select
                                    value={createData.kondisi}
                                    onBlur={() => setIsStatusTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setCreateData({
                                        ...createData,
                                        kondisi: e.target.value,
                                      });
                                      setIsStatusTouched(true);
                                      setIsStatusValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isStatusTouched && !isStatusValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isStatusTouched && isStatusValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                  >
                                    <option value="">Pilih Status</option>
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Digunakan">Digunakan</option>
                                    <option value="Perbaikan">Perbaikan</option>
                                    <option value="Rusak">Rusak</option>
                                  </select>
                                  {isStatusTouched && !isStatusValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap pilih Status
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
                                disabled={!isNamaMesinValid}
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
                            <h3 className="card-title">Form Edit Mesin Cuci</h3>
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
                                  Nama Mesin Cuci
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={updateData.namaMesinCuci}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        namaMesinCuci: e.target.value,
                                      });
                                      setIsMesinTouched(true);
                                      setIsNamaMesinValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    onBlur={() => setIsMesinTouched(true)}
                                    className={`form-control ${
                                      isMesinTouched && !isNamaMesinValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isMesinTouched && isNamaMesinValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan nama jasa"
                                  />
                                  {isMesinTouched && !isNamaMesinValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan nama mesin cuci.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Merek
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={updateData.merek}
                                    onBlur={() => setIsMerekTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        merek: e.target.value,
                                      });
                                      setIsMerekTouched(true);
                                      setIsMerekValid(inputValue.trim() !== "");
                                    }}
                                    className={`form-control ${
                                      isMerekTouched && !isMerekValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isMerekTouched && isMerekValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Deskripsi"
                                  />
                                  {isMerekTouched && !isMerekValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan Merek.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Kapasitas
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={updateData.kapasitas}
                                    onBlur={() => setIsKapasitasTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        kapasitas: inputValue,
                                      });
                                      setIsKapasitasTouched(true);
                                      // Validasi menggunakan ekspresi reguler
                                      const isNumeric = /^[0-9]+$/.test(
                                        inputValue
                                      );
                                      setIsKapasitasValid(isNumeric);
                                    }}
                                    className={`form-control ${
                                      isKapasitasTouched && !isKapasitasValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isKapasitasTouched && isKapasitasValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan kapasitas"
                                  />
                                  {isKapasitasTouched && !isKapasitasValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap masukkan kapasitas yang valid.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Tahun Pembuatan
                                </label>
                                <div className="col-sm-10">
                                  <input
                                    type="text"
                                    value={updateData.tahunPembuatan}
                                    onBlur={() =>
                                      setIsTahunPembuatanTouched(true)
                                    }
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        tahunPembuatan: inputValue,
                                      });
                                      setIsTahunPembuatanTouched(true);
                                      const isNumeric = /^[0-9]+$/.test(
                                        inputValue
                                      );
                                      setIsTahunPembuatanValid(isNumeric);
                                    }}
                                    className={`form-control ${
                                      isTahunPembuatanTouched &&
                                      !isTahunPembuatanValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isTahunPembuatanTouched &&
                                      isTahunPembuatanValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                    placeholder="Masukkan Tahun Pembuatan"
                                  />
                                  {isTahunPembuatanTouched &&
                                    !isTahunPembuatanValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan Tahun Pembuatan
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Kondisi
                                </label>
                                <div className="col-sm-10">
                                  <select
                                    value={updateData.kondisi}
                                    onBlur={() => setIsKondisiTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        kondisi: e.target.value,
                                      });
                                      setIsKondisiTouched(true);
                                      setIsKondisiValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isKondisiTouched && !isKondisiValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isKondisiTouched && isKondisiValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                  >
                                    <option value="">Pilih Kondisi</option>
                                    <option value="Baik">Baik</option>
                                    <option value="Perbaikan">Perbaikan</option>
                                    <option value="Rusak">Rusak</option>
                                  </select>
                                  {isKondisiTouched && !isKondisiValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap pilih kondisi.
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="form-group row">
                                <label className="col-sm-2 col-form-label">
                                  Status
                                </label>
                                <div className="col-sm-10">
                                  <select
                                    value={updateData.status}
                                    onBlur={() => setIsStatusTouched(true)}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      setUpdateData({
                                        ...updateData,
                                        status: e.target.value,
                                      });
                                      setIsStatusTouched(true);
                                      setIsStatusValid(
                                        inputValue.trim() !== ""
                                      );
                                    }}
                                    className={`form-control ${
                                      isStatusTouched && !isStatusValid
                                        ? "is-invalid"
                                        : ""
                                    } ${
                                      isStatusTouched && isStatusValid
                                        ? "is-valid"
                                        : ""
                                    }`}
                                  >
                                    <option value="">Pilih Status</option>
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Digunakan">Digunakan</option>
                                    <option value="Perbaikan">Perbaikan</option>
                                    <option value="Rusak">Rusak</option>
                                  </select>
                                  {isStatusTouched && !isStatusValid && (
                                    <div className="invalid-feedback">
                                      <i className="fas fa-exclamation-triangle"></i>{" "}
                                      Harap pilih Status
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
                                disabled={!isNamaMesinValid}
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
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  width="150"
                                  aria-label="Position: activate to sort column ascending"
                                >
                                  Nama Mesin Cuci
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Office: activate to sort column ascending"
                                >
                                  Kapasitas
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Age: activate to sort column ascending"
                                >
                                  Kondisi
                                </th>
                                <th
                                  className="sorting"
                                  tabIndex={0}
                                  aria-controls="example"
                                  rowSpan={1}
                                  colSpan={1}
                                  aria-label="Start date: activate to sort column ascending"
                                >
                                  Status
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
                              {currentData.map((item) => (
                                <tr key={item.laundryId}>
                                  <td>{item.no}</td>
                                  <td>{item.namaMesinCuci}</td>
                                  <td>{item.kapasitas} Kg</td>
                                  <td
                                    style={{
                                      color: getStatusColor(item.status),
                                    }}
                                  >
                                    {item.status}
                                  </td>
                                  <td
                                    style={{
                                      color: getKondisiColor(item.kondisi),
                                    }}
                                  >
                                    {item.kondisi}
                                  </td>
                                  <td className="d-flex">
                                    <div className="btn-group mr-1">
                                      <button
                                        className="btn btn-sm bg-gradient-warning"
                                        onClick={() => handleClickEdit(item)}
                                      >
                                        <i className="fas fa-pen"></i> Edit
                                      </button>
                                    </div>
                                    <div className="btn-group">
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleDelete(item.laundryId)
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
                                  Berikutnya
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
    </div>
  );
};

export default UnitMesinCuci;
