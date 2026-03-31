import { useEffect, useState } from "react";
import axios from "axios";

export default function Trending() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/trending/most")
      .then(res => {
        console.log("Frontend Response:", res.data);

        const list = res.data.finance?.result || [];
        setTrending(list);
      })
      .catch(err => {
        console.error("Frontend Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Trending Stocks</h2>

      {trending.length === 0 && (
        <p style={{color:"red"}}>No trending data found.</p>
      )}

      {trending.map((item, index) => (
        <div key={index} style={{padding:"10px", margin:"10px", border:"1px solid #ddd"}}>
          <h3>{item.symbol}</h3>
          <p>Exchange: {item.exchange}</p>
        </div>
      ))}
    </div>
  );
}
