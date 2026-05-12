'use client'

import { useState, useEffect, use } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

export default function Page() {
    //รับค่า id จาก query string
    const [sell, setSell] = useState<any>(null);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
            const res = await axios.get(`${config.apiUrl}/sell/info/${id}`);
            setSell(res.data);
            printDocument(res.data);
        }

        const printDocument = () => {
            const style = document.createElement("style");
            style.textContent = `
            @media print {
            body * {
                visibility: hidden;
            }
            #print-content, #print-content * {
                visibility: visible;
            }
            #print-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 80mm; //80mm
                height: 100%;
            }
            .content-header{
            display: none;}
        }
}
        `
        document.head.appendChild(style);
        setTimeout(() => {
            window.print();
        },300);
    }

    return (
        <div>
            <div className="content-header flex justify-between">
                <div>พิมพ์บิล</div>
                <div>
                    <button className="btn btn-primary text-xl" 
                    onClick={printDocument}>
                        <i className="fa-solid fa-print mr-3">
                            พิมพ์บิล
                        </i>
                    </button>
                </div>
            </div>
            <div id="print-content">
                <div className="text-center font-bold text-2xl">ใบเสร็จรับเงิน</div>
                <div className="text-left">วันที่ {dayjs(sell?.payDate).format("DD/MM/YYYY")}</div>
                <div className="text-left">รายการ: {sell?.product.name}</div>
                <div className="text-left">ราคา: {sell?.price.toLocaleString()}</div>
                <div className="text-left">วันที่ออกบิล: {dayjs(sell?.payDate).format("DD/MM/YYYY")}</div>
            </div>
        </div>
    )
}