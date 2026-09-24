# Movie Watchlist: short spec

Movie Watchlist is a small web app where each person signs up, logs in, and keeps a private list of movies they want to watch or have watched. Users can add a movie, mark it as watched with a 1 to 5 star rating, edit its details, and delete it. Each user only ever sees their own movies.

## Data
One table, `movies`: title, year, genre, notes, status (`to_watch` or `watched`), rating (1 to 5, only for watched movies), the date it was watched (`watched_on`, only for watched movies), and the owner (`user_id`).

## Pages
- Register / log in
- My watchlist (view, filter by status, add, edit, mark watched, delete)

## Out of scope
Movie search from an outside database, posters, sharing lists between users.
