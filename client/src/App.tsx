import React, { useEffect, useState } from "react";
import "./App.css";
import { ResponsiveContainer } from "./component/ResponsiveContainer";

type MusicType = {
  id: number;
  category: string;
  instruments: string;
  playtime: string;
  performance_ready: boolean;
  name: string;
  genre_mood: string;
  tempo: number;
  date_modified: Date;
  link: string;
};

function App() {
  const [music, setMusic] = useState<MusicType[]>([]);
  const [loading, setLoading] = useState(true);

  const domain =
    process.env.NODE_ENV === "production"
      ? "https://splendid-chaos-server.vercel.app/"
      : "/";
  const apiUrl = "music";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(domain + apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setMusic(json);
      } catch (e) {
        console.error("Failed to fetch music data:", e);
        setMusic([]);
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
    <ResponsiveContainer>
      <div className={"pageContainer"}>
        <header className={"header"}>
          <h1 className={"title"}>Splendid Chaos</h1>
          <p className={"subtitle"}>Subtitle</p>
        </header>
        <section className={"section"}>
          <div className={"infoBox"}>
            <h2 className={"infoTitle"}>Welcome!</h2>
            <p className={"infoText"}>
              This is a work-in-progress application to help manage the data of
              Splendid Chaos.
            </p>
          </div>

          <div className={"grid"}>
            <div className={"gridItem"}>
              <span className={"gridItemText"}>Music</span>
            </div>
            <div className={"gridItem"}>
              <span className={"gridItemText"}>Players</span>
            </div>
            <div className={"gridItem"}>
              <span className={"gridItemText"}>Set Lists</span>
            </div>
          </div>
          <div className={"featuresBox"}>
            <h2 className={"featuresTitle"}>Song List</h2>
            <ul className={"featuresList"}>
              {music?.length > 0 &&
                music.map((song: MusicType) => (
                  <li key={song.name} className={"featuresItem"}>
                    <span className={"featuresBullet"}></span>
                    <span>{song.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        </section>
        <footer className={"footer"}>&copy; 2025 Splendid Chaos</footer>
      </div>
    </ResponsiveContainer>
  );
}

export default App;
