# Movie Watchlist

A small web app where each person registers, logs in, and keeps a private list of movies they want to watch or have already watched. Built for the Engineering Design 2 "Build Software with Practice" assignment at Florida Atlantic University.

- **Live app:** https://my-movie-watchlist-tracker.netlify.app
- **Demo video (unlisted YouTube, 3-5 minutes):** _link will be added here_

## What the app does

- **Register, log in, and log out** with an email and password.
- **Add a movie** with a title, release year, genre, and notes, either to the "To watch" list or, by checking "I've already watched this", straight to Watched with a rating and date.
- **Mark a movie as watched**, give it a rating from 1 to 5 stars, and record the date you watched it, or move it back to the watchlist.
- **Edit** a movie's details (and the rating and watched date of a watched movie).
- **Delete** a movie.
- **Filter** the list by All, To watch, or Watched.
- **Private data:** each user only ever sees their own movies. This is enforced in the database itself (see Row Level Security below), not just in the screens.

## Technologies used

| Part | Technology |
|---|---|
| Frontend | React 18 with Vite |
| Database and authentication | Supabase (PostgreSQL, Supabase Auth) |
| Hosting | Netlify |
| Version control | Git and GitHub |
| Built with | AI coding assistance (Claude Code), directed and tested by the author |

## How it works

```
Browser (React app)  <->  Supabase (login + PostgreSQL database)
        ^
   Hosted on Netlify
```

- `src/App.jsx` decides whether to show the login form or the movie list, based on whether someone is logged in.
- `src/components/AuthForm.jsx` handles registering and logging in.
- `src/components/MovieList.jsx` loads the user's movies and handles adding, updating, and deleting them.
- `src/components/MovieForm.jsx` and `src/components/MovieItem.jsx` are the add/edit form and a single movie card.
- `src/supabaseClient.js` connects the app to Supabase using the project URL and publishable key from environment variables.
- `supabase/schema.sql` creates the `movies` table and its security rules.

### Database

One table, `movies`, with these columns: `id`, `user_id` (the owner), `title`, `year`, `genre`, `notes`, `status` (`to_watch` or `watched`), `rating` (1 to 5), `watched_on` (the date it was watched), and `created_at`.

**Row Level Security** is turned on, with policies so a logged-in user can only view, add, update, and delete rows where `user_id` matches their own account.

## Setup instructions

You need [Node.js](https://nodejs.org/) (version 18 or newer) and a free [Supabase](https://supabase.com/) account.

1. **Clone the repository**
   ```
   git clone https://github.com/TonyTwoTires/movie-watchlist.git
   cd movie-watchlist
   ```

2. **Create a Supabase project**, then open **SQL Editor**, paste in the contents of `supabase/schema.sql`, and run it.

3. **Turn off email confirmation** (optional, but makes testing easier): Authentication, then Sign In / Providers, then Email, and switch off "Confirm email".

4. **Add your project settings.** Copy `.env.example` to `.env` and fill in the two values from your Supabase project (Project Settings, then API):
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-key
   ```
   Use the **publishable** key only. Never put a secret key in this app. The `.env` file is ignored by Git and is not committed.

5. **Install and run**
   ```
   npm install
   npm run dev
   ```
   Then open the local address that the terminal prints (usually http://localhost:5173).

6. **Build for production** (optional)
   ```
   npm run build
   ```

## Deployment

The app is deployed on Netlify from the `main` branch, with build command `npm run build` and publish directory `dist`. The two environment variables above are set in the Netlify project settings.

## Reflection: tradeoffs and future improvements

- Supabase was chosen so authentication and the database come from one free service, which kept the project small.
- The "watched on" date was added after the first version, as a new column on the existing table, which is how a real database changes over time.
- Possible improvements: searching movies from an outside movie database, posters, and sharing lists between users.
