import { useParams } from 'react-router';
import { Song } from './Music';
import { useEffect, useState } from 'react';
import './songPage.css';
import { ResponsiveContainer } from '../component/ResponsiveContainer';
import SongEditor from './SongEditor';

interface SongEditorPageProps {
  onSongUpdated?: (song: Song) => void;
  onNavigateBack?: () => void;
}

export default function SongPage({
  onSongUpdated,
  onNavigateBack,
}: SongEditorPageProps) {
  const { songId } = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const domain =
    process.env.NODE_ENV === 'production'
      ? 'https://splendid-chaos-server.vercel.app/'
      : '/';
  const apiUrl = 'music';

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      try {
        const response = await fetch(domain + apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch song');
        }
        const json = await response.json();
        const song = json.find((pSong: Song) => pSong.id.toString() === songId);
        setSong(song);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load song');
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchSong();
    }
  }, [domain, apiUrl, songId]);

  const handleSave = (updatedSong: Song) => {
    setSong(updatedSong);
    setSuccessMessage('Song updated successfully!');
    onSongUpdated?.(updatedSong);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    // Clear error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const handleCancel = () => {
    onNavigateBack?.();
  };

  if (loading) {
    return (
      <div className={'songPage-loadingContainer'}>
        <div className={'songPage-spinner'}></div>
        <p>Loading song...</p>
      </div>
    );
  }

  if (error && !song) {
    return (
      <div className={'songPage-errorContainer'}>
        <div className={'songPage-errorIcon'}>⚠️</div>
        <h2>Error Loading Song</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={'songPage-retryButton'}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!song) {
    return (
      <div className={'songPage-errorContainer'}>
        <div className={'songPage-errorIcon'}>🎵</div>
        <h2>Song Not Found</h2>
        <p>The requested song could not be found.</p>
        <button onClick={onNavigateBack} className={'songPage-retryButton'}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={'songPage-container'}>
      {successMessage && (
        <div className={'songPage-successMessage'}>
          <span className={'songPage-successIcon'}>✅</span>
          {successMessage}
        </div>
      )}

      {error && (
        <div className={'songPage-errorMessage'}>
          <span className={'songPage-errorIcon'}>❌</span>
          {error}
        </div>
      )}

      <SongEditor
        song={song}
        onSave={handleSave}
        onCancel={handleCancel}
        onError={handleError}
      />
    </div>
  );
}
