'use client';

import { useState, useEffect } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";


export default function Page() {
    const [serial, setSerial] = useState("");
    const [price, setPrice] = useState(0);
    const [sells, setSells] = useState([]);
    const [id, setId] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleSave = async () => {
        try {
            const payload = { serial: serial, price: price };
            await axios.post(`${config.apiUrl}/sell/create`, payload);

            fetchData();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "Failed to sell product",
            });
        }
    };
    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/sell/list`);
            setSells(response.data);
            // Calculate total amount
            let total = 0;
            for (let i = 0; i < response.data.length; i++) {
                total += response.data[i].price;
            }
            setTotalAmount(total);
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "Failed to fetch sell records",
            });
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const button = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/sell/remove/${id}`);
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "Failed to delete sell record",
            });
        }
    };

    const handleConfirmSell = async () => {
        try {
            const button = await Swal.fire({
                title: "Are you sure?",
                text: "You are about to confirm the sell records!",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });
            if (button.isConfirmed) {
                await axios.get(`${config.apiUrl}/sell/confirm`);
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "Failed to confirm sell records",
            });
        }
    };


    return (
        <div>
            <div className="content-header">ขายสินค้า</div>
            <div className="flex gap-2 items-end">
                <div className="w-full">
                    <div>Serial</div>
                    <input type="text"
                        onChange={(e) => setSerial(e.target.value)}></input>
                </div>
                <div className="text-right">
                    <div>Price</div>
                    <input type="number" className="text-right"
                        onChange={(e) => setPrice(Number(e.target.value))}></input>
                </div>
                <div>
                    <button className="btn flex items-center"
                        onClick={handleSave}>
                        <i className="fa-solid fa-save mr-2"></i>Save</button>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Serial</th>
                        <th>รายการสินค้า</th>
                        <th className="text-right">ราคา</th>
                        <th className="w-[50px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {sells.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.product.serial}</td>
                            <td>{item.product.name}</td>
                            <td className="text-right">{item.price.toLocaleString()}</td>
                            <td className="text-center">
                                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                    <i className="fa-solid fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {sells.length > 0 && (
                <>
                    <div className="mt-5 flex justify-between">
                        <div>ยอดรวมทั้งหมด</div>
                        <div className="text-2xl font-bold bg-gray-300 px-4 py-2 rounded-md">
                            {totalAmount.toLocaleString()}

                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <button className="btn" onClick={handleConfirmSell}>
                            <i className="fa-solid fa-check mr-2">ยืนยันการขาย</i>
                        </button>
                    </div>
                </>
            )}
        </div>


    )
}