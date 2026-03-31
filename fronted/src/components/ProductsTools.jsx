import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


const IpoIcon = () => (
  <div className="d-flex align-items-center justify-content-center bg-success bg-opacity-25 text-success rounded-3"
    style={{ width: "45px", height: "45px", fontSize: "22px" }}>
    📣
  </div>
);

const EventIcon = () => (
  <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-25 text-primary rounded-3"
    style={{ width: "45px", height: "45px", fontSize: "22px" }}>
    📅
  </div>
);

const MfIcon = () => (
  <div className="d-flex align-items-center justify-content-center bg-purple bg-opacity-25 text-purple rounded-3"
    style={{ width: "45px", height: "45px", fontSize: "22px" }}>
    📘
  </div>
);

export default function ProductsTools({ columnLayout, cardStyle }) {
  const navigate = useNavigate();

  const items = [
    { title: "IPO", subtitle: "2 open", icon: <IpoIcon />, route: "/user/market-overview/ipo" },
    { title: "Mutual Funds", subtitle: "Top performing funds", icon: <MfIcon />, route: "/user/market-overview/mutualfunds" },
    { title: "Exchnage Traded fund ", subtitle: "Top performing funds", icon: <MfIcon />, route: "/user/market-overview/etf" },
  
  ];

  return (
    <div className="products-tools-container " style={cardStyle}>
      <h2 className="products-tools-title" style={{ fontSize: 22, marginBottom: 18, color: '#1E40AF', fontWeight: 800, letterSpacing: 0.5 }}>Products & Tools</h2>
      <div className="products-tools-list grid-layout">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="products-tools-card animate-card h-150"
            style={{ aspectRatio: '1/1', minWidth: 0, minHeight: 0, padding: 18, borderRadius: 16, background: 'rgba(236,245,255,0.85)', boxShadow: '0 1.5px 6px rgba(30,64,175,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}
            onClick={() => navigate(item.route)}
          >
            <div className="products-tools-card-header" style={{ gap: 12 }}>
              {item.icon}
              <div>
                <p className="products-tools-card-title " style={{ fontSize: 17, marginBottom: 2 }}>{item.title}</p>
                <p className="products-tools-card-subtitle d-none d-md-block"  style={{ fontSize: 13 }}>{item.subtitle}</p>
              </div>
            </div>
            <div className="products-tools-chevron">
              <ChevronRight color="#999" />
            </div>
          </div>
        ))}
      </div>
      <style>
        {`
        /* Modern glassmorphism and animation styles for ProductsTools */
.products-tools-container {
  max-width: 1100px;
  margin: 0 auto 40px auto;
  padding: 8px 20px 24px 20px;
  background: linear-gradient(120deg, #f0f4ff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(2,6,23,0.08);
}
.products-tools-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 32px;
  color: #0f172a;
  letter-spacing: 0.5px;
  text-align: left;
}
.products-tools-list {
  display: flex;
  gap: 32px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.products-tools-list.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  overflow-x: unset;
  padding-bottom: 0;
}
.products-tools-card {
  max-width: 210px;
  max-height: 210px;
  /* max-width: fit-content; */
  background: rgba(255,255,255,0.7);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(34,197,94,0.08), 0 1.5px 8px rgba(2,6,23,0.08);
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(120,120,255,0.08);
  padding: 24px 18px;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(.4,2,.3,1), box-shadow 0.25s;
  display: flex;
  flex-direction: row;
  justify-content:Start;
  position: relative;
  animation: cardFadeIn 0.7s cubic-bezier(.4,2,.3,1);
}
.products-tools-card:hover {
  transform: scale(1.07) translateY(-6px);
  box-shadow: 0 8px 32px rgba(34,197,94,0.18), 0 2px 12px rgba(2,6,23,0.12);
  background: linear-gradient(120deg, #e0f7fa 0%, #f8fafc 100%);
}
.products-tools-card-header {
  display: flex;
  align-items: center;
  gap: 18px;
}
.products-tools-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 2px;
  color: #0369a1;
}
.products-tools-card-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 0;
}
.products-tools-chevron {
  text-align: right;
  margin-top: 18px;
}
@keyframes cardFadeIn {
  0% { opacity: 0; transform: scale(0.85) translateY(30px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-card {
  animation: cardFadeIn 0.7s cubic-bezier(.4,2,.3,1);
}
`}
      </style>
    </div>
  );
}
