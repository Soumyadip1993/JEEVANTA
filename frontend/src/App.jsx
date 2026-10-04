import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to Jeevanta backend...");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage("Unable to connect to Jeevanta backend");
      });
  }, []);

  return (
    <div>
      <h1>Jeevanta</h1>
      <h2>Government Hospital Management System</h2>
      <p>{message}</p>
    </div>
  );
}

export default App;
