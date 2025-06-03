import { useEffect, useState } from "react";
import { getAllAccounts } from "../services/AccountServices";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAllAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err.detail || "Failed to load accounts");
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div>
      <h2>Accounts</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {accounts.map((acc) => (
          <li key={acc.id}>{acc.name} - {acc.exchange_name}</li>
        ))}
      </ul>
    </div>
  );
};
export default AccountList;