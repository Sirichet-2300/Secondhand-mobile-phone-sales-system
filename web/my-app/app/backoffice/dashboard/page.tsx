'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { config } from "@/app/config";
import Swal from "sweetalert2";
import axios from "axios";

type DashboardData = {
    totalIncome?: number | null;
    totalRepair?: number | null;
    totalSale?: number | null;
    totalSell?: number | null;
}

type ChartData = {
    name: string;
    income: number;
}

const createChartData = (): ChartData[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month) => ({
        name: month,
        income: Math.floor(Math.random() * 10000)
    }))
}

export default function Page() {
    const [data, setData] = useState<ChartData[]>(createChartData)
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalRepair, setTotalRepair] = useState(0)
    const [totalSale, setTotalSale] = useState(0)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const listYears = useMemo(() => {
        const prevYear = new Date().getFullYear() - 5;
        return Array.from({ length: 6 }, (_, index) => prevYear + index);
    }, [])

    const applyDashboardData = (responseData: DashboardData) => {
        setTotalIncome(Number(responseData.totalIncome ?? 0));
        setTotalRepair(Number(responseData.totalRepair ?? 0));
        setTotalSale(Number(responseData.totalSale ?? responseData.totalSell ?? 0));
    }

    const showLoadError = (error: unknown) => {
        Swal.fire({
            icon: "error",
            title: "โหลดข้อมูลล้มเหลว",
            text: axios.isAxiosError(error)
                ? error.response?.data?.message ?? error.message
                : "ไม่สามารถโหลดข้อมูล dashboard ได้",
        });
    }

    const fetchData = useCallback(async (year: number) => {
        try {
            const res = await axios.get<DashboardData>(`${config.apiUrl}/sell/dashboard/${year}`);
            applyDashboardData(res.data);
        } catch (error: unknown) {
            showLoadError(error);
        }
    }, [])

    const refreshChart = useCallback(() => {
        setData(createChartData())
    }, [])

    useEffect(() => {
        let isActive = true;

        axios.get<DashboardData>(`${config.apiUrl}/sell/dashboard/${currentYear}`)
            .then((res) => {
                if (!isActive) return;
                applyDashboardData(res.data);
            })
            .catch((error: unknown) => {
                if (!isActive) return;
                showLoadError(error);
            });

        return () => {
            isActive = false;
        }
    }, [currentYear])

    const statCards = [
        {
            color: "from-teal-700 to-cyan-700",
            icon: "fa-sack-dollar",
            title: "ยอดขายทั้งหมด",
            value: `${totalIncome.toLocaleString()} บาท`,
        },
        {
            color: "from-amber-600 to-orange-600",
            icon: "fa-screwdriver-wrench",
            title: "งานรับซ่อม",
            value: `${totalRepair.toLocaleString()} งาน`,
        },
        {
            color: "from-blue-700 to-indigo-700",
            icon: "fa-receipt",
            title: "รายการขาย",
            value: `${totalSale.toLocaleString()} รายการ`,
        },
    ]

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="content-header mb-2 border-b-0 pb-0">Dashboard</h1>
                    <p className="text-sm text-slate-500">ภาพรวมยอดขายและงานบริการประจำปี</p>
                </div>
            </div>

            <div className="dashboard-toolbar">
                <div className="text-sm font-semibold text-slate-700">เลือกปี</div>
                <select
                    className="form-control max-w-[200px]"
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                >
                    {listYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <button
                    className="btn"
                    onClick={() => {
                        fetchData(currentYear);
                        refreshChart();
                    }}
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>แสดงรายการ</span>
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {statCards.map((card) => (
                    <div key={card.title} className={`rounded-lg bg-gradient-to-br ${card.color} p-5 text-white shadow-lg shadow-slate-900/10`}>
                        <div className="mb-5 flex items-center justify-between">
                            <div className="text-sm font-medium text-white/80">{card.title}</div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15">
                                <i className={`fa-solid ${card.icon}`}></i>
                            </div>
                        </div>
                        <div className="text-3xl font-bold tracking-normal">{card.value}</div>
                    </div>
                ))}
            </div>

            <div className="chart-panel">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <div className="text-lg font-bold text-slate-950">รายได้แต่ละเดือน</div>
                        <div className="text-sm text-slate-500">เปรียบเทียบรายได้รายเดือนในปีที่เลือก</div>
                    </div>
                </div>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                            <Tooltip formatter={(value)=> `รายได้ ${Number(value ?? 0).toLocaleString()} บาท`} />
                            <Legend />
                            <Bar dataKey="income" fill="#0f766e" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
