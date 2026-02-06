"use client"
import Image from "next/image";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Lun',
        presente: 60,
        ausente: 40,

    },
    {
        name: 'Mar',
        presente: 70,
        ausente: 60,

    },
    {
        name: 'Mie',
        presente: 90,
        ausente: 75,

    },
    {
        name: 'Jue',
        presente: 90,
        ausente: 75,

    },
    {
        name: 'Vie',
        presente: 65,
        ausente: 55,

    },
];


const AttendanceChart = () => {
    return (
        <div className="bg-white round-lg p-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Asistencia</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart width={500} height={300} data={data} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                    <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
                    <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "Lightgray" }} />
                    <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
                    <Bar dataKey="presente"
                        fill="#FAE27C"
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                    <Bar dataKey="ausente"
                        fill="#C3EBFA"
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AttendanceChart