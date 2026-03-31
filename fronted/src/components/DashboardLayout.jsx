// src/layouts/DashboardLayout.jsx
// import React from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// import { Outlet } from "react-router-dom"; // this renders nested routes
// import MainContent from "./MainContent";

// export default function DashboardLayout({user={user} , handleLogout={handleLogout}}) {
//   return (
//     <div className="d-flex" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
//       <Sidebar user={user} handleLogout={handleLogout} />
//       <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
//         <Navbar user={user} />
//         <div className="container-fluid py-3">
//           <MainContent user={user}/>
//         </div>
//       </div>
//     </div>
//   );
// }





import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom"; // this renders nested routes
import MainContent from "./MainContent";
import Layout from "./Layout";

export default function DashboardLayout({user={user} , handleLogout={handleLogout}}) {
  return (
    <Layout/>
  );
}