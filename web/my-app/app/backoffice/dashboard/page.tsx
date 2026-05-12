'use client'

import { useState, useEffect } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { config } from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";


export default function Page() {
    const [data, setData] = useState<any[]>([])
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalRepair, setTotalRepair] = useState(0)
    const [totalSale, setTotalSale] = useState(0)
    const [listYears, setListYears] = useState<any[]>([])
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

    useEffect(() => {
        const prevYear = new Date().getFullYear() - 5;
        const years = Array.from({ length: 6 }, (_, index) => prevYear + index);
        setListYears(years);
        fetchData();
        renderChart();
    }, [])

    const fetchData = async () => {
        try {
            const res = await axios.get(`${config.apiUrl}/sell/dashboard/${currentYear}`);
            setTotalIncome(Number(res.data.totalIncome ?? 0));
            setTotalRepair(Number(res.data.totalRepair ?? 0));
            setTotalSale(Number(res.data.totalSale ?? res.data.totalSell ?? 0));
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error.message,
            });
        }
    }
    const renderChart = async () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const data = months.map((month) => ({
            name: month,
            income: Math.floor(Math.random() * 10000)
        }))
        setData(data)
    }

    const box = (color: string, title: string, value: string) => {
        return (
            <div className={`flex flex-col gap-4 items-end w-full ${color} p-4 rounded-lg text-white`}>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-4xl font-bold">${value}</p>
            </div>
        )
    }

    return (
        <div>
            <h1 className="content-header">Dashboard</h1>

            <div className="flex gap-4 mb-3 items-center">
                <div className="w-[50px] text-right">เลือกปี</div>
                <select
                    className="form-control"
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    style={{width:'200px'}}>
                    {listYears.map((year,index) => (
                        <option key={index} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <button className="btn flex items-center w-[161px]"
                onClick={()=>{
                    fetchData(); 
                    renderChart();
                }}>
                    <i className="fa-solid fa-magnifying-glass mr-3"></i>แสดงรายการ</button>
            </div>

            <div className="flex gap-4">
                {box('bg-purple-600','ยอดขายทั้งหมด', totalIncome.toLocaleString() + ' บาท')}
                {box('bg-orange-500', 'งานรับซ่อม', totalRepair.toLocaleString() + ' งาน')}
                {box('bg-blue-500', 'รายการขาย', totalSale.toLocaleString() + ' รายการ')}
            </div>
            <div className="text-center mb-4 mt-5 text-xl font-bold">รายได้แต่ละเดือน</div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value:number)=> 'รายได้ ${value.toLocaleString()} บาท'}/>
                        <Legend />
                        <Bar dataKey="income" fill="teal" opacity={0.5} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
