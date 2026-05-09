'use client';

import { useState, useEffect } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";


export default function Page() {
    const [serial, setSerial] = useState("");
    const [price, setPrice] = useState(0);

    const handleSave = async () => {
        try {
            const payload = { serial: serial, price: price };
            await axios.post(`${config.apiUrl}/sell/create`, payload);
           
            fetchData();
        } catch (error ) {
             Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "Failed to sell product",
            });
        }
    };
    const fetchData = async () => {}
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="content-header">ขายสินค้า</div>
                <div className="flex gap-2 items-end">
                    <div className="w-full">
                        <div>Serial</div>
                        <input type="text"
                        onChange={(e)=>setSerial(e.target.value)}></input>
                    </div>
                    <div className="text-right">
                        <div>Price</div>
                        <input type="number" className="text-right"
                        onChange={(e)=>setPrice(Number(e.target.value))}></input>
                    </div>
                    <div>
                    <button className="btn flex items-center" 
                    onClick={handleSave}>
                        <i className="fa-solid fa-save mr-2"></i>Save</button>
                </div>
            </div>
            </div>
    )}