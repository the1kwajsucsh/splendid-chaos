import { useEffect, useState } from 'react';
import { Song } from './Music';
import { ResponsiveContainer } from '../component/ResponsiveContainer';

interface SongEditorProps {
  song: Song;
  onSave?: (updatedSong: Song) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

export default function SongEditor({
  song,
  onSave,
  onCancel,
  onError,
}: SongEditorProps) {
  const [formData, setFormData] = useState({
    name: song.name || '',
    category: song.category || '',
    instruments: song.instruments || '',
    playtime: song.playtime || '',
    performance_ready: song.performance_ready || false,
    genre_mood: song.genre_mood || '',
    tempo: song.tempo?.toString() || '',
    link: song.link || '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const domain =
    process.env.NODE_ENV === 'production'
      ? 'https://splendid-chaos-server.vercel.app/'
      : '/';
  const apiUrl = 'music';

  // Track if form has changes
  useEffect(() => {
    const hasFormChanges =
      formData.name !== (song.name || '') ||
      formData.category !== (song.category || '') ||
      formData.instruments !== (song.instruments || '') ||
      formData.playtime !== (song.playtime || '') ||
      formData.performance_ready !== (song.performance_ready || false) ||
      formData.genre_mood !== (song.genre_mood || '') ||
      formData.tempo !== (song.tempo?.toString() || '') ||
      formData.link !== (song.link || '');

    setHasChanges(hasFormChanges);
  }, [formData, song]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Song name is required';
    }

    if (
      formData.tempo &&
      (isNaN(Number(formData.tempo)) || Number(formData.tempo) < 0)
    ) {
      newErrors.tempo = 'Tempo must be a positive number';
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        category: formData.category || null,
        instruments: formData.instruments || null,
        playtime: formData.playtime || null,
        performance_ready: formData.performance_ready,
        genre_mood: formData.genre_mood || null,
        tempo: formData.tempo ? Number(formData.tempo) : null,
        link: formData.link || null,
      };

      const response = await fetch(`${domain}${apiUrl}/${song.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update song');
      }

      const updatedSong = await response.json();
      onSave?.(updatedSong);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update song';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm(
          'You have unsaved changes. Are you sure you want to cancel?'
        )
      ) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  const lastModifiedDate = new Date(song.date_modified);

  let currentHour = lastModifiedDate.getHours();
  currentHour -= 4;
  lastModifiedDate.setHours(currentHour);

  return (
    <ResponsiveContainer>
      <div className={'songEditor-container'}>
        <div className={'songEditor-header'}>
          <h1 className={'songEditor-title'}>Edit Song</h1>
          <p className={'songEditor-subtitle'}>
            Update the details for "{song.name}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className={'songEditor-form'}>
          <div className={'songEditor-formGroup'}>
            <label htmlFor="name" className={'songEditor-label'}>
              Song Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${'songEditor-input'} ${errors.name ? 'songEditor-inputError' : ''}`}
              placeholder="Enter song name"
              required
            />
            {errors.name && (
              <span className={'songEditor-errorText'}>{errors.name}</span>
            )}
          </div>

          <div className={'songEditor-formRow'}>
            <div className={'songEditor-formGroup'}>
              <label htmlFor="category" className={'songEditor-label'}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={'songEditor-select'}
              >
                <option value="">Select category</option>
                <option value="Core">Core</option>
                <option value="Speciality">Speciality</option>
                <option value="Active Practice">Active Practice</option>
                <option value="To Try Next">To Try Next</option>
                <option value="Library">Library</option>
                <option value="Didn't Work">Didn't Work</option>
              </select>
            </div>

            <div className={'songEditor-formGroup'}>
              <label htmlFor="genre_mood" className={'songEditor-label'}>
                Genre/Mood
              </label>
              <input
                type="text"
                id="genre_mood"
                name="genre_mood"
                value={formData.genre_mood}
                onChange={handleInputChange}
                className={'songEditor-input'}
                placeholder="e.g., Upbeat, Melancholy"
              />
            </div>
          </div>

          <div className={'songEditor-formGroup'}>
            <label htmlFor="instruments" className={'songEditor-label'}>
              Instruments to Sound
            </label>
            <input
              type="text"
              id="instruments"
              name="instruments"
              value={formData.instruments}
              onChange={handleInputChange}
              className={'songEditor-input'}
              placeholder="e.g., Trumpet, Tenor Sax, Drums"
            />
          </div>

          <div className={'songEditor-formRow'}>
            <div className={'songEditor-formGroup'}>
              <label htmlFor="playtime" className={'songEditor-label'}>
                Playtime
              </label>
              <input
                type="text"
                id="playtime"
                name="playtime"
                value={formData.playtime}
                onChange={handleInputChange}
                className={'songEditor-input'}
                placeholder="e.g., 3:45, 4 minutes"
              />
            </div>

            <div className={'songEditor-formGroup'}>
              <label htmlFor="tempo" className={'songEditor-label'}>
                Tempo (BPM)
              </label>
              <input
                type="number"
                id="tempo"
                name="tempo"
                value={formData.tempo}
                onChange={handleInputChange}
                className={`${'songEditor-input'} ${errors.tempo ? 'songEditor-inputError' : ''}`}
                placeholder="120"
                min="0"
              />
              {errors.tempo && (
                <span className={'songEditor-errorText'}>{errors.tempo}</span>
              )}
            </div>
          </div>

          <div className={'songEditor-formGroup'}>
            <label htmlFor="link" className={'songEditor-label'}>
              Link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className={`${'songEditor-input'} ${errors.link ? 'songEditor-inputError' : ''}`}
              placeholder="https://example.com/song"
            />
            {errors.link && (
              <span className={'songEditor-errorText'}>{errors.link}</span>
            )}
          </div>

          <div className={'songEditor-checkboxGroup'}>
            <label className={'songEditor-checkboxLabel'}>
              <input
                type="checkbox"
                name="performance_ready"
                checked={formData.performance_ready}
                onChange={handleInputChange}
                className={'songEditor-checkbox'}
              />
              <span className={'songEditor-checkboxText'}>
                Performance Ready
              </span>
            </label>
          </div>

          <div className={'songEditor-formActions'}>
            <button
              type="button"
              onClick={handleCancel}
              className={'songEditor-cancelButton'}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={'songEditor-saveButton'}
              disabled={loading || !hasChanges}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {song.date_modified && (
          <div className={'songEditor-metadata'}>
            <p className={'songEditor-lastModified'}>
              Last modified: {lastModifiedDate.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
}
