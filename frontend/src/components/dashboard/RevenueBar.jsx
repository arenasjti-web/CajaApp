import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList
} from "recharts";
import api from '../../lib/axios';


export const RevenueBar = ({ filters }) => {
    const [data, setData] = React.useState([]);
    const CATEGORY_COLORS = {
        Bebidas: "#3b82f6",        // azul sobrio (agua, bebidas)
        Alcohol: "#7c3aed",        // violeta oscuro (vino/licores)
        Dulces: "#eab308",         // amarillo mostaza (no chillón)
        Ferreteria: "#6b7280",     // gris acero
        Charcutería: "#dc2626",    // rojo profundo (carnes)
        Higiene: "#10b981",        // verde menta oscuro
        Otros: "#9ca3af"           // gris neutro
    };


    React.useEffect(() => {
        const fetchData = async () => {
        const params = { category: true };

        try {
            const { data } = await api.get("/dashboard/revenue", { params });
            setData(data);
        } catch (error) {
            console.log("error fetching data", error);
        }
        };

        fetchData();
    }, []);

    const categories = [...new Set(data.map(d => d.category))];

    const chartData = Object.values(
        data.reduce((acc, { date, category, totalAmount }) => {
        if (!acc[date]) acc[date] = { date };
        acc[date][category] = totalAmount;
        return acc;
        }, {})
    );

    return (
        <div className=" flex flex-col bg-white rounded-xl shadow p-4 flex-1 h-80">
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d) =>
                            new Date(d).toLocaleDateString("es-CL", {
                            month: "short",
                            year: "numeric"
                            })
                        }/>
                    <YAxis />
                    <Tooltip />

                    {categories.map(category => (
                    <Bar
                        key={category}
                        dataKey={category}
                        fill={CATEGORY_COLORS[category] || "#6b7280"}
                        radius={[4, 4, 0, 0]}
                        label={({ x, y, width, height }) => (
                            <text
                            x={x + width / 2}
                            y={y + height / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#ffffff"
                            fontSize={11}
                            fontWeight={500}
                            >
                            {category}
                            </text>
                        )}
                    >
                    </Bar>
                    ))}
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
