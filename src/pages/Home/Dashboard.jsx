import React from "react";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import Footer from "../../component/Footer";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newJasa, setnewJasa] = useState(0);
  const [newJenis, setnewJenis] = useState(0);
  const [newUsers, setnewUsers] = useState(0);
  const [newMesin, setnewMesin] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        const data = response.data;
        const pelanggan = data.filter((user) => user.role === "pelanggan");
        setNewOrdersCount(pelanggan.length);
      } catch (error) {
        console.error("Error fetching new orders:", error);
      }
    };

    const dataJasa = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getJasaLaundry"
        );
        const data = response.data;
        setnewJasa(data.length);
      } catch (error) {
        console.error("Error fetching new orders:", error);
      }
    };

    const dataJenis = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/getBarangLaundry"
        );
        const data = response.data;
        setnewJenis(data.length);
      } catch (error) {
        console.error("Error fetching new orders:", error);
      }
    };

    const dataUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users"
        );
        const data = response.data;
        setnewUsers(data.length);
      } catch (error) {
        console.error("Error fetching new orders:", error);
      }
    };
    const dataMesin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5041/api/MasterLaundry/Get Data Master Laundry"
        );
        const data = response.data.data;
        setnewMesin(data.length);
      } catch (error) {
        console.error("Error fetching new orders:", error);
      }
    };

    // Panggil fungsi fetchData
    dataMesin();
    dataUsers();
    dataJasa();
    dataJenis();
    fetchData();
  }, []);
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper" style={{ minHeight: "431.679px" }}>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Beranda</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Beranda</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>{newOrdersCount}</h3>
                    <p>Jumlah Pelanggan</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-users" />
                  </div>
                  <Link to={"/users"} className="small-box-footer">
                    Selengkapnya <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>{newJasa}</h3>
                    <p>Jumlah Jasa</p>
                  </div>
                  <div className="icon">  
                    <i className="fas fa-shopping-basket" />
                  </div>
                  <Link to={"/jasaLaundry"} className="small-box-footer">
                    Selengkapnya <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-6">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>{newJenis}</h3>
                    <p>Jenis Barang Laundry</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-tshirt" />
                  </div>
                  <Link to={"/jenisBarang"}  className="small-box-footer">
                    Selengkapnya <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div> 
            </div>
            <div className="row">
            <div className="col-lg-4 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>{newUsers}</h3>
                    <p>Jumlah Pengguna</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-user" />
                  </div>
                  <Link to={"/users"} className="small-box-footer">
                    Selengkapnya <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-4 col-6">
                <div className="small-box bg-primary">
                  <div className="inner">
                    <h3>{newMesin}</h3>
                    <p>Mesin Cuci & Setrika</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-cog" />
                  </div>
                  <Link to={"/unitMesinCuci"} className="small-box-footer">
                    Selengkapnya <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
