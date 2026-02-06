import { Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartLegendContent, ChartTooltipContent } from "@/components/application/charts/charts-base";

const pieChartData = [
    {
        name: "Series 1",
        value: 200,
        className: "text-utility-brand-600",
    },
    {
        name: "Series 2",
        value: 350,
        className: "text-utility-brand-500",
    },
    {
        name: "Series 3",
        value: 100,
        className: "text-utility-brand-400",
    },
    {
        name: "Series 4",
        value: 120,
        className: "text-utility-brand-300",
    },
    {
        name: "Series 5",
        value: 230,
        className: "text-utility-gray-200",
    },
];

export type PieChartProps = {
    data?: {
        name: string;
        value: number;
        className: string;
    }[];
}

export const PieChartLg = ({ data = pieChartData }: PieChartProps) => {
    return (
        <ResponsiveContainer height={500} width="100%">
            <RechartsPieChart>
                <Legend verticalAlign="top" align="right" layout="vertical" content={ChartLegendContent} />
                <Tooltip content={<ChartTooltipContent isPieChart />} />

                <Pie
                    isAnimationActive={false}
                    startAngle={-270}
                    endAngle={-630}
                    stroke="none"
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    fill="currentColor"
                    innerRadius={70}
                    outerRadius={140}
                    style={{
                      padding: '10px',
                      margin: '100px'
                    }}
                />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
};