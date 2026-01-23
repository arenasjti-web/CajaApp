import React from "react";
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Brush
} from "recharts";
import api from "../../lib/axios";

export const RevenueLine = ({filters ={}}) => {
    const [data, setData] = React.useState([]);

        React.useEffect(() => {
            const fetchRevenue = async () => {

                const params = {}
                if(filters?.monthRange){
                    params.monthRangeMin = filters.monthRange.min;
                    params.monthRangeMax = filters.monthRange.max;
                }
                if(filters?.selectedItem) params.selectedItem = filters.selectedItem._id


                try {
                    const {data} = await api.get("/dashboard/revenue",{params})

                    setData(data)
                } catch (error) {
                    console.log("Error fetching revenue", error)
                }
            }

            fetchRevenue()
        }, [filters?.monthRange, filters?.selectedItem])


  return (
    <div className=" flex flex-col bg-white rounded-xl shadow p-4 flex-1 h-80">
      
        <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} width={500} height={300}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="date"
                        tickFormatter={(d) =>
                            new Date(d).toLocaleDateString("es-CL", {
                            month: "short",
                            year: "numeric"
                            })
                        }
                        padding={{ left: 30, right: 30 }}
                    />
                    <YAxis />
                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="totalAmount"
                        stroke="#16a34a"
                        fill="url(#colorRevenue)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>

        </div>

    </div>
  );
};
