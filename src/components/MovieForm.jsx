import { useState } from 'react';

// Today's date as YYYY-MM-DD in the user's own timezone (what a date input expects).
function todayLocal() {
  return new Date().toLocaleDateString('en-CA');
}

function emptyValues() {
  return { title: '', year: '', genre: '', notes: '', rating: 5, watchedOn: todayLocal() };
}

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
      : emptyValues(),
  );
  // When adding, the user can say they have already watched the movie.
  const [alreadyWatched, setAlreadyWatched] = useState(false);
  // Rating and date apply to movies that are watched (when editing) or marked as watched (when adding).
  const showWatchedFields = initial ? initial.status === 'watched' : alreadyWatched;
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
    if (showWatchedFields) {
      changes.rating = Number(values.rating);
      changes.watched_on = values.watchedOn || null;
      if (!initial) changes.status = 'watched';
    }
    const problem = await onSubmit(changes);
    setSaving(false);
    if (problem) {
      setError(problem);
    } else if (!initial) {
      setValues(emptyValues());
      setAlreadyWatched(false);
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

      {!initial && (
        <label className="checkbox-row" htmlFor="alreadyWatched">
          <input
            id="alreadyWatched"
            type="checkbox"
            checked={alreadyWatched}
            onChange={(e) => setAlreadyWatched(e.target.checked)}
          />
          I've already watched this
        </label>
      )}

      {showWatchedFields && (
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
