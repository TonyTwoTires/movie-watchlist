import { useState } from 'react';

const EMPTY = { title: '', year: '', genre: '', notes: '' };

// Used for both adding a new movie and editing an existing one.
export default function MovieForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initial
      ? {
          title: initial.title,
          year: initial.year ?? '',
          genre: initial.genre ?? '',
          notes: initial.notes ?? '',
          rating: initial.rating ?? 5,
          watchedOn: initial.watched_on ?? '',
        }
      : EMPTY,
  );
  // Only movies that are already watched have a rating to edit.
  const canEditRating = initial?.status === 'watched';
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return (event) => setValues({ ...values, [field]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    const changes = {
      title: values.title.trim(),
      year: values.year === '' ? null : Number(values.year),
      genre: values.genre.trim() || null,
      notes: values.notes.trim() || null,
    };
    if (canEditRating) {
      changes.rating = Number(values.rating);
      changes.watched_on = values.watchedOn || null;
    }
    const problem = await onSubmit(changes);
    setSaving(false);
    if (problem) {
      setError(problem);
    } else if (!initial) {
      setValues(EMPTY);
    }
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field grow">
          <label htmlFor="title">Title</label>
          <input id="title" value={values.title} onChange={update('title')} maxLength={200} required />
        </div>
        <div className="field small">
          <label htmlFor="year">Release year</label>
          <input
            id="year"
            type="number"
            min="1888"
            max="2100"
            value={values.year}
            onChange={update('year')}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="genre">Genre</label>
        <input id="genre" value={values.genre} onChange={update('genre')} placeholder="Sci-fi, comedy..." />
      </div>

      {canEditRating && (
        <div className="form-row">
          <div className="field small">
            <label htmlFor="rating">Rating</label>
            <select id="rating" value={values.rating} onChange={update('rating')}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="watchedOn">Watched on</label>
            <input id="watchedOn" type="date" value={values.watchedOn} onChange={update('watchedOn')} />
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" rows={2} value={values.notes} onChange={update('notes')} />
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
