'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { config } from "@/app/config";
import Modal from "@/app/backoffice/modal";

export default function Sidebar() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [isShow, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const applyUserData = (data: { name: string; level: string; username: string }) => {
    setName(data.name);
    setLevel(data.level);
    setUsername(data.username);
  };

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchData = async () => {
    const headers = getHeaders();
    const res = await axios.get(`${config.apiUrl}/user/info`, { headers });
    applyUserData(res.data);
  };

  useEffect(() => {
    let isActive = true;

    axios.get(`${config.apiUrl}/user/info`, { headers: getHeaders() })
      .then((res) => {
        if (!isActive) return;
        applyUserData(res.data);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "password ไม่ตรงกัน",
      });
      return;
    }

    const payload = {
      name,
      username,
      password,
      level,
    };
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    await axios.put(`${config.apiUrl}/user/update`, payload, { headers });
    fetchData();
    handleCloseModal();
  };

  const navClass = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-teal-500 text-white shadow-sm"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500 text-lg shadow-lg shadow-teal-950/30">
            <i className="fa fa-mobile-screen-button"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Mobileshop</h1>
            <p className="text-xs font-medium text-slate-400">Backoffice v1.0</p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-slate-200">
              <i className="fa fa-user"></i>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{name || "User"}</div>
              <div className="text-xs uppercase tracking-wide text-teal-300">{level || "staff"}</div>
            </div>
            <button onClick={handleShowModal} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/10 hover:text-white">
              <i className="fa fa-pencil"></i>
            </button>
            <button onClick={handleLogout} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-rose-300 transition hover:bg-rose-500/15 hover:text-rose-200">
              <i className="fa fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {level === "admin" && (
          <>
            <Link href="/backoffice/dashboard" className={navClass("/backoffice/dashboard")}>
              <i className="fa fa-tachometer-alt w-5 text-center"></i>
              <span>Dashboard</span>
            </Link>
            <Link href="/backoffice/buy" className={navClass("/backoffice/buy")}>
              <i className="fa fa-shopping-cart w-5 text-center"></i>
              <span>ซื้อสินค้า</span>
            </Link>
          </>
        )}

        <Link href="/backoffice/sell" className={navClass("/backoffice/sell")}>
          <i className="fa fa-dollar-sign w-5 text-center"></i>
          <span>ขายสินค้า</span>
        </Link>
        <Link href="/backoffice/repair" className={navClass("/backoffice/repair")}>
          <i className="fa fa-wrench w-5 text-center"></i>
          <span>รับซ่อม</span>
        </Link>

        {level === "admin" && (
          <>
            <Link href="/backoffice/company" className={navClass("/backoffice/company")}>
              <i className="fa fa-building w-5 text-center"></i>
              <span>ข้อมูลร้าน</span>
            </Link>
            <Link href="/backoffice/user" className={navClass("/backoffice/user")}>
              <i className="fa fa-users w-5 text-center"></i>
              <span>ผู้ใช้งาน</span>
            </Link>
          </>
        )}
      </nav>

      <Modal title="แก้ไขข้อมูลผู้ใช้งาน" isOpen={isShow} onClose={handleCloseModal}>
        <div>
          <div>ชื่อผู้ใช้งาน</div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />

          <div className="mt-3">username</div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" />

          <div className="mt-3">password</div>
          <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" />

          <div className="mt-3">confirm password</div>
          <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" />

          <div className="mt-5">
            <button className="btn" onClick={handleSave}>
              <i className="fa-solid fa-save"></i>
              <span>บันทึก</span>
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
}
