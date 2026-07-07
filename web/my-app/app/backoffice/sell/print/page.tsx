'use client'

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import { config } from "@/app/config";

type SellInfo = {
    payDate: string;
    price: number;
    product: {
        name: string;
    };
}

function PrintContent() {
    const [sell, setSell] = useState<SellInfo | null>(null);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

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
                    width: 80mm;
                    height: 100%;
                }
                .content-header {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        setTimeout(() => {
            window.print();
        }, 300);
    }

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const res = await axios.get<SellInfo>(`${config.apiUrl}/sell/info/${id}`);
            setSell(res.data);
            printDocument();
        }

        fetchData();
    }, [id]);

    return (
        <div>
            <div className="content-header flex justify-between">
                <div>พิมพ์บิล</div>
                <div>
                    <button className="btn text-xl" onClick={printDocument}>
                        <i className="fa-solid fa-print"></i>
                        <span>พิมพ์บิล</span>
                    </button>
                </div>
            </div>
            <div id="print-content">
                <div className="text-center text-2xl font-bold">ใบเสร็จรับเงิน</div>
                <div className="text-left">วันที่ {dayjs(sell?.payDate).format("DD/MM/YYYY")}</div>
                <div className="text-left">รายการ: {sell?.product.name}</div>
                <div className="text-left">ราคา: {sell?.price.toLocaleString()}</div>
                <div className="text-left">วันที่ออกบิล: {dayjs(sell?.payDate).format("DD/MM/YYYY")}</div>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div className="text-sm text-slate-500">Loading...</div>}>
            <PrintContent />
        </Suspense>
    )
}
