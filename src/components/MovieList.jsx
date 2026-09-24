import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
import MovieForm from './MovieForm.jsx';
import MovieItem from './MovieItem.jsx';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'to_watch', label: 'To watch' },
  { value: 'watched', label: 'Watched' },
];

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMovies = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });
    if (loadError) {
      setError(loadError.message);
    } else {
      setError('');
      setMovies(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  // Each function below returns an error message (or nothing) so the form can show it.
  async function addMovie(fields) {
    const { error: insertError } = await supabase.from('movies').insert(fields);
    if (insertError) return insertError.message;
    await loadMovies();
    return undefined;
  }

  async function updateMovie(id, changes) {
    const { error: updateError } = await supabase.from('movies').update(changes).eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return updateError.message;
    }
    await loadMovies();
    return undefined;
  }

  async function deleteMovie(id) {
    const { error: deleteError } = await supabase.from('movies').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await loadMovies();
  }

  const visible = filter === 'all' ? movies : movies.filter((movie) => movie.status === filter);

  return (
    <>
      <section className="card">
        <h2>Add a movie</h2>
        <MovieForm submitLabel="Add movie" onSubmit={addMovie} />
      </section>

      <section className="list-section">
        <div className="list-header">
          <h2>My movies ({visible.length})</h2>
          <div className="filters" role="group" aria-label="Filter movies">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={filter === option.value ? 'filter active' : 'filter'}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        {loading && <p>Loading your movies...</p>}
        {!loading && visible.length === 0 && (
          <p className="empty">
            {movies.length === 0 ? 'No movies yet. Add your first one above.' : 'No movies match this filter.'}
          </p>
        )}

        <ul className="movie-list">
          {visible.map((movie) => (
            <MovieItem key={movie.id} movie={movie} onUpdate={updateMovie} onDelete={deleteMovie} />
          ))}
        </ul>
      </section>
    </>
  );
}
