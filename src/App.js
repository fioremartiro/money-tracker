import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const [price, ...nameParts] = name.split(" ", 2);
    const newName = nameParts.join(" ");
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: newName,
        description,
        datetime,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("result", json);
        setName("");
        setDatetime("");
        setDescription("");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  return (
    <main>
      <h1>{balance}</h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder={"name"}
          />
          <input
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            type="text"
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div className="transaction" key={index}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">2023-04-19 11:01</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
