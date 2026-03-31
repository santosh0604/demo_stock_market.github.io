// async function fetchIndices() {
//   const res = await fetch("/api/indices");
//   const json = await res.json();
//   if (!json.ok) return alert("Failed to load indices");

//   const list = document.getElementById("indicesList");
//   list.innerHTML = "";

//   json.data.forEach(idx => {
//     const li = document.createElement("li");
//     li.className = "p-2 rounded-lg hover:bg-blue-50 cursor-pointer";
//     li.textContent = `${idx.name} (${idx.symbol}) - ${idx.price}`;
//     li.onclick = () => loadIndexDetails(idx.symbol);
//     list.appendChild(li);
//   });
// }

// async function loadIndexDetails(symbol) {
//   const res = await fetch(`/api/index/${symbol}`);
//   const json = await res.json();
//   if (!json.ok) return alert("Failed to load details");

//   const d = json.data;
//   document.getElementById("indexDetails").innerHTML = `
//     <h2 class="text-xl font-bold mb-2">${d.name} (${d.symbol})</h2>
//     <p>Price: ${d.price} ${d.currency}</p>
//     <p>Change: ${d.change} (${d.percentChange}%)</p>
//     <p>Day Low / High: ${d.dayLow} - ${d.dayHigh}</p>
//     <p>52W Low / High: ${d.fiftyTwoWeekLow} - ${d.fiftyTwoWeekHigh}</p>
//     <p>Open: ${d.open}</p>
//     <p>Prev Close: ${d.previousClose}</p>
//     <p>Volume: ${d.volume}</p>
//     <p class="text-sm text-gray-500">Updated: ${new Date(d.time).toLocaleTimeString()}</p>
//   `;
// }

// document.getElementById("refreshBtn").onclick = fetchIndices;




document.addEventListener("DOMContentLoaded", () => {
  const indexDetails = document.getElementById("indexDetails");
  const links = document.querySelectorAll("#indicesList a");

  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const url = link.getAttribute("href");

      indexDetails.innerHTML = `<p class="text-gray-500">Loading...</p>`;

      try {
        const res = await fetch(url);
        const html = await res.text();
        indexDetails.innerHTML = html;
      } catch (err) {
        indexDetails.innerHTML = `<p class="text-red-500">Error loading details.</p>`;
      }
    });
  });
});
