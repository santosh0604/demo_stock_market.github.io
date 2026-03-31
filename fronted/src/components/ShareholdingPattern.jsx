import React from "react";
import { Card } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function ShareholdingPattern({ data }) {
  // ✅ Safely compute sdata only when data.shareholding exists
  const sdata = Array.isArray(data?.shareholding)
    ? data.shareholding.map((item) => {
        if (!item.categories?.length) return null; // skip invalid entries
        const latest = item.categories[item.categories.length - 1];
        return {
          categoryName: item.displayName || item.categoryName,
          percentage: parseFloat(latest?.percentage || 0),
        };
      }).filter(Boolean) // remove nulls
    : [];

  return (
    <Card className="shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
      <h5 className="fw-semibold text-primary mb-3">Shareholding Pattern</h5>

      {sdata.length > 0 ? (
        <>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sdata}
                  dataKey="percentage"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {sdata.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#e6f0ff" }}>
                <th style={{ padding: "10px" }}>Category</th>
                <th style={{ padding: "10px" }}>Holding (%)</th>
              </tr>
            </thead>
            <tbody>
              {sdata.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {item.categoryName}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {item.percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-muted">No shareholding data available</p>
      )}
    </Card>
  );
}

export default ShareholdingPattern;
