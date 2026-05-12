'use client';
import Link from "next/link";
import { useState, useEffect, } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Modal from "@/app/backoffice/modal";

export default function Sidebar() {
  const [name, setName] = useState("");
  const router = useRouter();
  const [level, setLevel] = useState("");
  const [isShow, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false);
  }
  
  
  const fetchData = async () => {
    
    const token = localStorage.getItem("token");
    
    const headers = {
      'Authorization': `Bearer ${token}`,
    }
    const res = await axios.get(`${config.apiUrl}/user/info`, { 
      headers:headers });
    setName(res.data.name);
    setLevel(res.data.level);
    setUsername(res.data.username);
  }

useEffect(() => {
  fetchData();
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  }

  const handleSave = async () => {
    if(password !== confirmPassword){
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'password ไม่ตรงกัน'
      });
      return;
    }
    //save data
    const payload = {
      name: name,
      username: username,
      password: password,
      level: level
    }
    const token = localStorage.getItem("token");
    const headers = {'Authorization': `Bearer ${token}`}
    await axios.put(`${config.apiUrl}/user/update`, payload, { headers })
      fetchData()
      handleCloseModal()
    }


  return (
    <div className="bg-teal-600 h-screen w-64 ">
      <div className="p-5 bg-teal-800 text-white text-xl">
        <h1>Mobileshop Version 1.0</h1>
        <div className="flex items-center gap-2 mt-3">
          <i className="fa fa-user"></i>
          <span className="w-full">{name}:{level}</span>
          <button onClick={handleShowModal} className="bg-blue-500 rounded-full px-2 py-1">
            <i className="fa fa-pencil"></i>
          </button>
          <button onClick={handleLogout}className="bg-red-500 rounded-full px-2 py-1">
            <i className="fa fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
      <div className="p-5 text-white text-xl flex flex-col gap-2">
        {level === "admin" && (
          <>
        <div>
          <Link href="/backoffice/dashboard">
            <i className="fa fa-tachometer-alt nr-2 w -[25px] text-center"></i>
          Dashboard
          </Link>
        </div>
        <div>
          <Link href="/backoffice/buy">
            <i className="fa fa-shopping-cart nr-2 w -[25px] text-center"></i>
          ซื้อสินค้า
          </Link>
          
        </div>
        </>
          )}
        <div>
          <Link href="/backoffice/sell">
            <i className="fa fa-dollar-sign nr-2 w -[25px] text-center"></i>
          ขายสินค้า
          </Link>
          
        </div>
        <div>
          <Link href="/backoffice/repair">
            <i className="fa fa-wrench nr-2 w -[25px] text-center"></i>
          รับซ่อม
          </Link>
          
        </div>
        {level === "admin" && (
          <>
        <div>
          <Link href="/backoffice/company">
            <i className="fa fa-building nr-2 w -[25px] text-center"></i>
          ข้อมูลร้าน
          </Link>
          
        </div>
        <div>
          <Link href="/backoffice/user">
            <i className="fa fa-users nr-2 w -[25px] text-center"></i>
          ผู้ใช้งาน
          </Link>
          
        </div>
        </>
        )}
      </div>
      <Modal title="แก้ไขข้อมูลผู้ใช้งาน"isOpen={isShow} onClose={handleCloseModal}>
        <div>
          <div>ชื่อผู้ใช้งาน</div>
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} 
          className="form-control"/>

          <div className="mt-3">username</div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
          className="form-control"/>

          <div className="mt-3">password</div>
          <input type="password"  onChange={(e) => setPassword(e.target.value)} 
          className="form-control"/>

          <div className="mt-3">confirm password</div>
          <input type="password"  onChange={(e) => setConfirmPassword(e.target.value)} 
          className="form-control"/>

          <div className="mt-3">
            <button className="btn" onClick={handleSave}>
              <i className="fa-solid fa-save mr-2"> บันทึก</i>
            </button>
          </div>
        </div>

      </Modal>
    </div>
  );
}