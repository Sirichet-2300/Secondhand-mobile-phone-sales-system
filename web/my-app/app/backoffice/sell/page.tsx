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
        } catch (error:any) {
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
            await axios.delete(`${config.apiUrl}/sell/remove/${id}`);
            fetchData();
        } catch (error :any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "Failed to delete sell record",
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
                            <td className="text-right">{item.price}</td>
                            <td className="text-center">
                                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                    <i className="fa-solid fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


    )
}