// import { PortfolioSummaryCard } from "../components/portfolio-summary-card";
// import { IndicesCard } from "@/components/indices-card";
// import { StockCard } from "@/components/stock-card";
// import { MarketStatusBanner } from "@/components/market-status-banner";
// import { useLocation } from "wouter";

// export default function Dashboard() {
//   const [, setLocation] = useLocation();

//   const mockIndices = [
//     { name: 'NIFTY 50', value: 22145.50, change: 125.30, changePercent: 0.57 },
//     { name: 'SENSEX', value: 73234.25, change: -89.45, changePercent: -0.12 },
//     { name: 'BANK NIFTY', value: 47823.75, change: 234.60, changePercent: 0.49 },
//     { name: 'NIFTY IT', value: 35421.90, change: 78.20, changePercent: 0.22 },
//   ];

//   const topGainers = [
//     { symbol: 'TCS', companyName: 'Tata Consultancy Services', price: 3845.50, change: 42.30, changePercent: 1.11, volume: 2345000, marketCap: '₹14.1T' },
//     { symbol: 'INFY', companyName: 'Infosys Limited', price: 1523.65, change: 18.90, changePercent: 1.26, volume: 3456000, marketCap: '₹6.4T' },
//     { symbol: 'WIPRO', companyName: 'Wipro Limited', price: 456.75, change: 5.20, changePercent: 1.15, volume: 1234000, marketCap: '₹2.5T' },
//   ];

//   return (
//     <div className="space-y-6">
//       <MarketStatusBanner isOpen={true} />
      
//       <div>
//         <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
//         <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
//       </div>

//       <PortfolioSummaryCard
//         virtualBalance={250000}
//         portfolioValue={385420}
//         totalPL={35420}
//         dailyPL={-2340}
//       />

//       <IndicesCard indices={mockIndices} isLive={true} />

//       <div>
//         <h2 className="text-xl font-semibold mb-4">Top Gainers</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {topGainers.map((stock) => (
//             <StockCard
//               key={stock.symbol}
//               {...stock}
//               onClick={() => setLocation(`/stock/${stock.symbol}`)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
