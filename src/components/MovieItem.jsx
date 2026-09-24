import { useState } from 'react';
import MovieForm from './MovieForm.jsx';

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function MovieItem({ movie, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(movie.rating ?? 5);
  const [markingWatched, setMarkingWatched] = useState(false);

  const watched = movie.status === 'watched';

  async function saveEdits(changes) {
    const problem = await onUpdate(movie.id, changes);
    if (!problem) setEditing(false);
    return problem;
  }

  async function markWatched() {
    await onUpdate(movie.id, { status: 'watched', rating: Number(rating) });
    setMarkingWatched(false);
  }

  function moveBackToWatchlist() {
    return onUpdate(movie.id, { status: 'to_watch', rating: null });
  }

  if (editing) {
    return (
      <li className="card movie">
        <MovieForm
          initial={movie}
          submitLabel="Save changes"
          onSubmit={saveEdits}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="card movie">
      <div className="movie-main">
        <h3>
          {movie.title}
          {movie.year && <span className="year"> ({movie.year})</span>}
        </h3>
        <p className="meta">
          <span className={`badge ${watched ? 'watched' : 'to-watch'}`}>
            {watched ? 'Watched' : 'To watch'}
          </span>
          {movie.genre && <span>{movie.genre}</span>}
          {watched && movie.rating && <Stars rating={movie.rating} />}
        </p>
        {movie.notes && <p className="notes">{movie.notes}</p>}
      </div>

      <div className="movie-actions">
        {watched ? (
          <button type="button" className="secondary" onClick={moveBackToWatchlist}>
            Move back to watchlist
          </button>
        ) : markingWatched ? (
          <span className="rate-row">
            <label htmlFor={`rating-${movie.id}`}>Rating</label>
            <select id={`rating-${movie.id}`} value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <button type="button" onClick={markWatched}>Save</button>
            <button type="button" className="secondary" onClick={() => setMarkingWatched(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setMarkingWatched(true)}>
            Mark watched
          </button>
        )}
        <button type="button" className="secondary" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => {
            if (window.confirm(`Delete "${movie.title}"?`)) onDelete(movie.id);
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
