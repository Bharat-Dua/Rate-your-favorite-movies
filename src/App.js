import "./index.css";
import StarRating from "./StarRating";
import { useState, useEffect, useRef } from "react";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

// const tempQuery = "rockstar";
const kEY = "a537d657";
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedMovieId((selectedId) => (selectedId === id ? null : id));
  }
  function handleCloseSelectMovie() {
    setSelectedMovieId(null);
  }
  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    // one way to add data into local storage
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar
        query={query}
        setQuery={setQuery}
        onCloseQueryMovie={handleCloseSelectMovie}
      >
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
              onCloseMovie={handleCloseSelectMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedMovieId ? (
            <MovieDetails
              selectedMovieId={selectedMovieId}
              onCloseMovie={handleCloseSelectMovie}
              onAddWatched={handleAddWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const average = (arr) => {
  // arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  if (arr.length === 0) return 0;
  return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
};
function NavBar({ query, setQuery, children, onCloseQueryMovie }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search
        query={query}
        setQuery={setQuery}
        onCloseQueryMovie={onCloseQueryMovie}
      />
      {children}
    </nav>
  );
}
function Search({ query, setQuery, onCloseQueryMovie }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });
  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (document.activeElement === inputEl.current) return;
  //       if (e.code === "Enter") {
  //         inputEl.current.focus();
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);
  //     return () => document.removeEventListener("keydown", callback);
  //   },
  //   [setQuery]
  // );
  return (
    <div className="search-container" style={{ position: "relative" }}>
      <input
        className="search"
        type="text"
        autoFocus
        ref={inputEl}
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          className="clear-button"
          onClick={() => {
            setQuery("");
            onCloseQueryMovie();
          }}
        >
          X
        </button>
      )}
    </div>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetails({
  selectedMovieId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const currentRef = useRef(0);
  useEffect(
    function () {
      if (userRating) currentRef.current += 1;
    },
    [userRating]
  );

  // const isWatched = watched
  //   .map((movie) => movie.imdbID)
  //   .includes(selectedMovieId);
  // const watchedMovieUserRating = watched.find(
  //   (movie) => movie.imdbID === selectedMovieId
  // )?.userRating;
  // --------or -----------

  // let isWatched = false;
  // let watchedMovieUserRating = 0;

  // watched.forEach((movie) => {
  //   if (movie.imdbID === selectedMovieId) {
  //     isWatched = true;
  //     watchedMovieUserRating = movie.userRating;
  //   }
  // });

  const isWatched = watched.some((movie) => movie.imdbID === selectedMovieId);
  const watchedMovieUserRating = watched.find(
    (movie) => movie.imdbID === selectedMovieId
  )?.userRating;

  const {
    // Actor: actor,
    Title: title,
    Year: year,
    Poster: poster,
    imdbRating,
    Plot: plot,
    Genre: genre,
    Released: released,
    Actors: actors,
    Director: director,
    Runtime: runtime,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedMovieId,
      title: title || "No Title",
      year: year || "No Year",
      poster: poster || "No Poster",
      imdbRating: Number(imdbRating) || 0,
      runtime: Number(runtime?.split(" ")[0]) || 0,
      userRating: userRating || 0,
      movieRatingDecision: currentRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  useKey("Escape", onCloseMovie);
  useEffect(
    function () {
      const fetchMovieDetails = async () => {
        setIsLoading(true);
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${kEY}&i=${selectedMovieId}`
        );
        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
        // console.log(data);
      };
      fetchMovieDetails();
    },
    [selectedMovieId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `movie || ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <MovieHeader
            title={title}
            released={released}
            runtime={runtime}
            genre={genre}
            imdbRating={imdbRating}
            poster={poster}
            onCloseMovie={onCloseMovie}
          />
          <MovieBody
            plot={plot}
            actors={actors}
            director={director}
            isWatched={isWatched}
            userRating={userRating}
            watchedMovieUserRating={watchedMovieUserRating}
            handleAdd={handleAdd}
            setUserRating={setUserRating}
          />
        </>
      )}
    </div>
  );
  // return (
  //   // <div className="details">
  //   //   {isLoading ? (
  //   //     <Loader />
  //   //   ) : (
  //   //     <>
  //   //       <header>
  //   //         <button className="btn-back" onClick={onCloseMovie}>
  //   //           &larr;
  //   //         </button>
  //   //         <img src={poster} alt={`poster of ${movie} movie`} />
  //   //         <div className="details-overview">
  //   //           <h2>{title}</h2>
  //   //           <p>
  //   //             {released} &bull; {runtime}
  //   //           </p>
  //   //           <p>{genre}</p>
  //   //           <p>
  //   //             <span>⭐</span>
  //   //             {imdbRating} IMDB rating
  //   //           </p>
  //   //         </div>
  //   //       </header>
  //   //       <section>
  //   //         <div className="rating">
  //   //           {!isWatched ? (
  //   //             <>
  //   //               <StarRating
  //   //                 size={24}
  //   //                 maxRating={10}
  //   //                 onSetRating={setUserRating}
  //   //               />
  //   //               {userRating > 0 && (
  //   //                 <button className="btn-add" onClick={handleAdd}>
  //   //                   + Add to list
  //   //                 </button>
  //   //               )}
  //   //             </>
  //   //           ) : (
  //   //             <p>
  //   //               You rated this movie with: {watchedMovieUserRating}{" "}
  //   //               <span>⭐</span>
  //   //             </p>
  //   //           )}
  //   //         </div>
  //   //         <p>
  //   //           <em>{plot}</em>
  //   //         </p>
  //   //         <p>Starring: {actors}</p>
  //   //         <p>Directed by - {director}</p>
  //   //       </section>
  //   //     </>
  //   //   )}
  //   // </div>
  //   //  break this into components

  // );
}
function MovieHeader({
  title,
  released,
  runtime,
  genre,
  imdbRating,
  poster,
  onCloseMovie,
}) {
  return (
    <header>
      <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      <img src={poster} alt={`poster of ${title} movie`} />
      <div className="details-overview">
        <h2>{title}</h2>
        <p>
          {released} &bull; {runtime}
        </p>
        <p>{genre}</p>
        <p>
          <span>⭐</span>
          {imdbRating} IMDB rating
        </p>
      </div>
    </header>
  );
}

function MovieBody({
  plot,
  actors,
  director,
  isWatched,
  userRating,
  watchedMovieUserRating,
  handleAdd,
  setUserRating,
}) {
  return (
    <section>
      <div className="rating">
        {!isWatched ? (
          <>
            <StarRating size={24} maxRating={10} onSetRating={setUserRating} />
            {userRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                + Add to list
              </button>
            )}
          </>
        ) : (
          <p>
            You rated this movie with: {watchedMovieUserRating} <span>⭐</span>
          </p>
        )}
      </div>
      <p>
        <em>{plot}</em>
      </p>
      <p>Starring: {actors}</p>
      <p>Directed by - {director}</p>
    </section>
  );
}
// function WatchedMovieBox() {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>

//         </>
//       )}
//     </div>
//   );
// }
function WatchedSummery({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedList({ watched, onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onDeleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          onClick={() => onDeleteWatchedMovie(movie.imdbID)}
          className="btn-delete"
        >
          X
        </button>
      </div>
    </li>
  );
}

function Loader() {
  const spinner = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M11 2v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 18v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM4.223 5.637l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM15.533 16.947l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM2 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM18 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5.637 19.777l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM16.947 8.467l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
    </svg>
  );

  return <div className="spinner">{spinner}</div>;
}
function ErrorMessage({ message }) {
  return <div className="error">{message}</div>;
}
