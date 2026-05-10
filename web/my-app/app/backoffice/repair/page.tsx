"use client";
import { useState, useEffect } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../modal";
import dayjs from "dayjs";

export default function Page() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [remark, setRemark] = useState("");
  const [id, setId] = useState('');
  const [repairs, setRepairs] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const res = await axios.get(`${config.apiUrl}/service/list`);
        setRepairs(res.data);
    } catch (error: any) {
        Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
        });
    }
  };
  const handleOpenModal = () => {
    setIsShowModal(true);
  };
  const handleCloseModal = () => {
    setIsShowModal(false);
  };
  const handleSave = async () => {
    try {
        const payload ={
            name: name,
            price: price,
            remark: remark
        }

        if(id !== ''){
            await axios.put(`${config.apiUrl}/service/update/${id}`, payload);
        }else{
            await axios.post(`${config.apiUrl}/service/create`, payload);
        }
        handleClearForm();
        handleCloseModal()
        fetchData();
    } catch (error :any) {
        Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
        });
    }
  };
  const handleClearForm = () => {
    setName("");
    setPrice(0);
    setRemark("");
  };

  const handleDelete = async (id: number) => {
    try {
        const button = await Swal.fire({
            icon: "warning",
            title: "ยืนยันการลบ",
            showCancelButton: true,
            showConfirmButton: true,        });
        if (button.isConfirmed) {
            await axios.delete(`${config.apiUrl}/service/remove/${id}`);
            fetchData();
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบงานบริการได้",
        });
    }
  };

  const handleEdit = (id: number) => {
    const repair = repairs.find((repair: any) => repair.id === id) as any;

    if(repair){
        setId(repair.id);
        setName(repair.name);
        setPrice(repair.price);
        setRemark(repair.remark);
        handleOpenModal();
    }}

  return (
    <div>
      <h1 className="content-header">งานบริการ</h1>
      <div>
        <button className="btn" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus mr-2">บันทึกงานบริการ</i>
        </button>
        <table className="table mt-4">
            <thead>
              <tr>
                <th className="text-left">ชื่องานบริการ</th>
                <th className="text-right">ราคา</th>
                <th className="text-left">หมายเหตุ</th>
                <th className="text-left">วันที่บันทึก</th>
                <th className="w-[120px]"></th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair: any) => (
                <tr key={repair.id}>
                  <td>{repair.name}</td>
                  <td className="text-right">{repair.price.toLocaleString()}</td>
                  <td>{repair.remark}</td>
                  <td>{dayjs(repair.payDate).format("DD/MM/YYYY")}</td>
                  <td className="text-center">
                    <button className="btn-edit mr-1" onClick={() => handleEdit(repair.id)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(repair.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      <Modal
        isOpen={isShowModal}
        title="บันทึกงานบริการ"
        onClose={handleCloseModal}
      >
        <div className="modal-content">
          <div>ชื่องานบริการ</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-4">ราคา</div>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <div className="mt-4">หมายเหตุ</div>
        <input
          type="text"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <div className="mt-4">
          <button className="btn" onClick={handleSave}>
            <i className="fa-solid fa-save mr-2"></i>
            บันทึก
          </button>

          

        </div>
      </Modal>
    </div>
  );
}
