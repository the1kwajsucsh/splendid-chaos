import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const domain = process.env.NODE_ENV === "production" ? 'https://splendid-chaos-server.vercel.app/' : '/'
  const apiUrl = 'data';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(domain + apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json.data);
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [domain, apiUrl]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
        <p>Hello world here is my app</p>
        {data && (
        <ul>
          {data.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
