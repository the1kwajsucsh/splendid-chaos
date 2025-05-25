import React from 'react';
import { ResponsiveContainer } from '../component/ResponsiveContainer';
import { useNavigate } from 'react-router';

export default function Home() {
  let navigate = useNavigate();

  return (
    <ResponsiveContainer>
      <div className={'pageContainer'}>
        <header className={'header'}>
          <h1 className={'title'}>Splendid Chaos</h1>
          <p className={'subtitle'}>Community Street Band</p>
        </header>
        <section className={'section'}>
          <div className={'infoBox'}>
            <h2 className={'infoTitle'}>Welcome!</h2>
            <p className={'infoText'}>
              This is a work-in-progress application to help manage the data of
              Splendid Chaos.
            </p>
          </div>

          <div className={'grid'}>
            <div className={'gridItem'} onClick={() => navigate('/music')}>
              <span className={'gridItemText'}>Music</span>
            </div>
            <div className={'gridItem'}>
              <span className={'gridItemText'}>Players</span>
            </div>
            <div className={'gridItem'}>
              <span className={'gridItemText'}>Set Lists</span>
            </div>
          </div>
        </section>
        <footer className={'footer'}>&copy; 2025 Splendid Chaos</footer>
      </div>
    </ResponsiveContainer>
  );
}
