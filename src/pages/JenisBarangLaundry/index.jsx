import React, { useEffect, useState } from "react";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const JenisBarangLaundry = () => {
    const [jenis, setJenis] = useState([]);

    //state validasi
    const [isJenisValid, setIsJenisValid] = useState(false);
    const [isDeskripsiValid, setIsDeskripsiValid] = useState(false);
    const [isBiayaValid, setIsBiayaValid] = useState(false);
  
    // state input touched
    const [isJenisTouched, setIsJenisTouched] = useState(false);
    const [isDeskripsiTouched, setIsDeskripsiTouched] = useState(false);
    const [isBiayaTouched, setIsBiayaTouched] = useState(false);
  
    // state search, filter, dan pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [perPage, setPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
  
    useEffect(() => {
      const filteredData = jenis.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filteredData);
  
      fetchData();
    }, [searchTerm, jenis]);
  
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
        const response = await axios.get("http://localhost:3000/getBarangLaundry");
        const data = response.data;
  
        const usersWithNumber = data.map((jenis, index) => ({
          ...jenis,
          no: index + 1,
        }));
        setJenis(usersWithNumber);
        setTotalData(data.length);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    //state form tambah data
    const [isCreateForm, setIsCreateForm] = useState(false);
  
    // state tambah data
    const [createData, setCreateData] = useState({
      jenisBarang: "",
      deskripsi: "",
      biaya: "",
      estimasi: "",
    });
  
    //handle open form tambah
    const handleFormOpen = () => {
      // Ketika form dibuka, set isFormOpened menjadi true
      setIsCreateForm(true);
    };
  
    // create data
    const handleCreate = async () => {
      try {
        await axios.post(`http://localhost:3000/insertBarangLaundry`, createData);
        fetchData();
        setIsCreateForm(false);
        setCreateData({
          jenisBarang: "",
          deskripsi: "",
          biaya: "",
        });
        // Atur ulang state validasi
        setIsJenisValid(false);
        setIsDeskripsiValid(false);
        setIsBiayaValid(false);

        // atur ulang state input
        setIsJenisTouched(false);
        setIsDeskripsiTouched(false);
        setIsBiayaTouched(false);

  
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
        jenisBarang: "",
        deskripsi: "",
        biaya: "",

      });
      setCreateData({
        jenisBarang: "",
        deskripsi: "",
        biaya: "",

      });
      // Atur ulang state validasi
      setIsJenisValid(false);
      setIsDeskripsiValid(false);
      setIsBiayaValid(false);

  
      // atur ulang state input
      setIsJenisTouched(false);
      setIsDeskripsiTouched(false);
      setIsBiayaTouched(false);

    };
  
    //state memunculkan form update
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  
    //state update data
    const [updateData, setUpdateData] = useState({
      jenisBarang: "",
      deskripsi: "",
      biaya: "",

    });
  
    // edit data
    const handleClickEdit = (jenisId) => {
      setUpdateData({
        jenisId: jenisId.jenisId,
        jenisBarang: jenisId.jenisBarang,
        deskripsi: jenisId.deskripsi,
        biaya: jenisId.biaya,
      });
      console.log("Update Data:", updateData);
      setIsEditFormVisible(true);
    };
  
    const handleEdit = async () => {
      try {
        console.log("Update Data:", updateData);
        // edit data berdasarkan id
        await axios.put(
          `http://localhost:3000/updateBarangLaundry/${updateData.jenisId}`,
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
    const handleDelete = (jenisId) => {
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
              `http://localhost:3000/deleteBarangLaundry/${jenisId}`
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
  
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className="content-wrapper" style={{ minHeight: "431.679px" }}>
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0">Jenis Barang Laundry</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <Link to={"/"}>Beranda</Link>
                    </li>
                    <li className="breadcrumb-item">Master Data</li>
                    <li className="breadcrumb-item active">Jenis Barang Laundry</li>
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
                      <h3 className="card-title">Data Jenis Barang Laundry</h3>
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
                          <div className="col-sm-12 mb-3">
                            <button
                              className="btn bg-gradient-success"
                              onClick={handleFormOpen}
                            >
                              <i class="fas fa-plus"></i> Jenis Barang
                            </button>
                          </div>
                        </div>
                        {/* akhir show header */}
  
                        {/* form create */}
                        {isCreateForm && (
                          <div className="card card-success">
                            <div className="card-header">
                              <h3 className="card-title">Form Jenis Barang</h3>
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
                                    Nama Barang
                                  </label>
                                  <div className="col-sm-10">
                                    <input
                                      type="text"
                                      value={createData.jenisBarang}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setCreateData({
                                          ...createData,
                                          jenisBarang: e.target.value,
                                        });
                                        setIsJenisTouched(true);
                                        setIsJenisValid(inputValue.trim() !== "");
                                      }}
                                      onBlur={() => setIsJenisTouched(true)}
                                      className={`form-control ${
                                        isJenisTouched && !isJenisValid
                                          ? "is-invalid"
                                          : ""
                                      } ${
                                        isJenisTouched && isJenisValid
                                          ? "is-valid"
                                          : ""
                                      }`}
                                      placeholder="Masukkan nama jenis"
                                    />
                                    {isJenisTouched && !isJenisValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan nama jenis.
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-sm-2 col-form-label">
                                    Deskripsi
                                  </label>
                                  <div className="col-sm-10">
                                    <textarea
                                      type="password"
                                      value={createData.deskripsi}
                                      onBlur={() => setIsDeskripsiTouched(true)}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setCreateData({
                                          ...createData,
                                          deskripsi: e.target.value,
                                        });
                                        setIsDeskripsiTouched(true);
                                        setIsDeskripsiValid(
                                          inputValue.trim() !== ""
                                        );
                                      }}
                                      className={`form-control ${
                                        isDeskripsiTouched && !isDeskripsiValid
                                          ? "is-invalid"
                                          : ""
                                      } ${
                                        isDeskripsiTouched && isDeskripsiValid
                                          ? "is-valid"
                                          : ""
                                      }`}
                                      placeholder="Masukkan Deskripsi"
                                    />
                                    {isDeskripsiTouched && !isDeskripsiValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan deskripsi.
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-sm-2 col-form-label">
                                    Biaya
                                  </label>
                                  <div className="col-sm-10">
                                    <input
                                      type="text"
                                      value={createData.biaya}
                                      onBlur={() => setIsBiayaTouched(true)}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setCreateData({
                                          ...createData,
                                          biaya: inputValue,
                                        });
                                        setIsBiayaTouched(true);
                                        // Validasi menggunakan ekspresi reguler
                                        const isNumeric = /^[0-9]+$/.test(
                                          inputValue
                                        );
                                        setIsBiayaValid(isNumeric);
                                      }}
                                      className={`form-control ${
                                        isBiayaTouched && !isBiayaValid
                                          ? "is-invalid"
                                          : ""
                                      } ${
                                        isBiayaTouched && isBiayaValid
                                          ? "is-valid"
                                          : ""
                                      }`}
                                      placeholder="Masukkan Biaya"
                                    />
                                    {isBiayaTouched && !isBiayaValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan biaya yang valid.
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
                                  disabled={!isJenisValid}
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
                              <h3 className="card-title">Form Edit Jenis Barang</h3>
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
                                    Nama Jenis
                                  </label>
                                  <div className="col-sm-10">
                                    <input
                                      type="text"
                                      value={updateData.jenisBarang}
                                      onBlur={() => setIsJenisTouched(true)}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setUpdateData({
                                          ...updateData,
                                          jenisBarang: e.target.value,
                                        });
                                        setIsJenisTouched(true);
                                        setIsJenisValid(inputValue.trim() !== "");
                                      }}
                                      className={`form-control ${
                                        isJenisTouched && !isJenisValid
                                          ? "is-invalid"
                                          : ""
                                      } ${
                                        isJenisTouched && isJenisValid
                                          ? "is-valid"
                                          : ""
                                      }`}
                                      placeholder="Masukkan nama barang"
                                    />
                                    {isJenisTouched && !isJenisValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan nama barang.
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-sm-2 col-form-label">
                                    Deskripsi
                                  </label>
                                  <div className="col-sm-10">
                                    <textarea
                                      type="password"
                                      value={updateData.deskripsi}
                                      onBlur={() => setIsDeskripsiTouched(true)}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setUpdateData({
                                          ...updateData,
                                          deskripsi: e.target.value,
                                        });
                                        setIsDeskripsiTouched(true);
                                        setIsDeskripsiValid(
                                          inputValue.trim() !== ""
                                        );
                                      }}
                                      className={`form-control ${
                                        isDeskripsiTouched && !isDeskripsiValid
                                          ? "is-invalid"
                                          : ""
                                      } ${
                                        isDeskripsiTouched && isDeskripsiValid
                                          ? "is-valid"
                                          : ""
                                      }`}
                                      placeholder="Masukkan Deskripsi"
                                    />
                                    {isDeskripsiTouched && !isDeskripsiValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan Deskripsi.
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label className="col-sm-2 col-form-label">
                                    Biaya
                                  </label>
                                  <div className="col-sm-10">
                                    <input
                                      type="text"
                                      value={updateData.biaya}
                                      onBlur={() => setIsBiayaTouched(true)}
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        setUpdateData({
                                          ...updateData,
                                          biaya: inputValue,
                                        });
                                        setIsBiayaTouched(true);
                                        // Validasi menggunakan ekspresi reguler
                                        const isNumeric = /^[0-9]+$/.test(
                                          inputValue
                                        );
                                        setIsBiayaValid(isNumeric);
                                      }}
                                      className={`form-control ${
                                        isBiayaTouched && !isBiayaValid
                                          ? "is-invalid"
                                          : ""
                                      } ${
                                        isBiayaTouched && isBiayaValid
                                          ? "is-valid"
                                          : ""
                                      }`}
                                      placeholder="Masukkan Biaya"
                                    />
                                    {isBiayaTouched && !isBiayaValid && (
                                      <div className="invalid-feedback">
                                        <i className="fas fa-exclamation-triangle"></i>{" "}
                                        Harap masukkan Biaya yang valid.
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
                                    Nama Barang
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="example"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Office: activate to sort column ascending"
                                  >
                                    Deskripsi
                                  </th>
                                  <th
                                    className="sorting"
                                    tabIndex={0}
                                    aria-controls="example"
                                    rowSpan={1}
                                    colSpan={1}
                                    aria-label="Age: activate to sort column ascending"
                                  >
                                    Biaya
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
                                  <tr key={item.jenisId}>
                                    <td>{item.no}</td>
                                    <td>{item.jenisBarang}</td>
                                    <td>{item.deskripsi}</td>
                                    <td>Rp {item.biaya}</td>
                                    <td className="d-flex justify-content-center">
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
                                            handleDelete(item.jenisId)
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
      </div>
    );
  };

export default JenisBarangLaundry
