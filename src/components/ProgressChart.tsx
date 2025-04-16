
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ProgressChartProps {
  percentage: number;
  size?: number;
  className?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  percentage,
  size = 100,
  className = ""
}) => {
  // Ensure percentage is between 0 and 100
  const validPercentage = Math.min(100, Math.max(0, percentage));
  
  // Data for the chart
  const data = [
    { name: "Completed", value: validPercentage },
    { name: "Remaining", value: 100 - validPercentage }
  ];
  
  // Colors for the chart
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];
  
  return (
    <div style={{ width: size, height: size }} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.35}
            outerRadius={size * 0.45}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-base font-semibold fill-foreground"
          >
            {Math.round(validPercentage)}%
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
