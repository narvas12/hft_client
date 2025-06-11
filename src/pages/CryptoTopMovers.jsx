import React, { useEffect, useState } from "react";
import { fetchCryptoPrices } from "../services/cryptoPriceService";
import { filterTopGainers } from "../../utils/filterCrypto";

const CryptoTopMovers = () => {
  const [topGainers, setTopGainers] = useState([]);

  const loadData = async () => {
    const data = await fetchCryptoPrices();
    const filtered = filterTopGainers(data);
    setTopGainers(filtered);
  };

  useEffect(() => {
    loadData(); 

    const interval = setInterval(() => {
      loadData();
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top 24h Movers</h2>
      <ul className="space-y-2">
        {topGainers.map((coin) => (
          <li
            key={coin.id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <strong>{coin.fullName} ({coin.name})</strong><br />
              <span className="text-sm text-gray-600">Price: {coin.price}</span>
            </div>
            <div className="text-green-600 font-semibold">
              {coin.change24}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoTopMovers;
