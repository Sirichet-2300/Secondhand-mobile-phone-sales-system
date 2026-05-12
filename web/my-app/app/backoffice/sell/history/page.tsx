'use client'

import { useState, useEffect } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function Page() {
    const [sellsList, setSellsList] = useState<any[]>([]);
    const router = useRouter();

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/sell/history`);
            setSellsList(res.data);
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "Failed to fetch sell history",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="content-header">
                <div>ประวัติการขาย</div>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="text-left w-[120px]">วันที่</th>
                        <th className="text-left">รายการสินค้า</th>
                        <th className="text-right w-[120px]">ราคา</th>
                        <th className="text-center w-[140px]">พิมพ์บิล</th>
                    </tr>
                </thead>
                <tbody>
                    {sellsList.map((item: any,index: number) => (
                        <tr key={index}>
                            <td>{dayjs(item.payDate).format("DD/MM/YYYY")}</td>
                            <td>{item.product.name}</td>
                            <td className="text-right">{item.price.toLocaleString()}</td>
                            <td className="text-center">
                                <a target="_blank" className="btn btn-sm btn-primary"
                                href={`/backoffice/sell/print/?id=${item.id}`}>
                                    <i className="fa-solid fa-print mr-2"></i>
                                    พิมพ์
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}