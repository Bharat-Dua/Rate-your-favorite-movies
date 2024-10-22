import { useEffect, useState } from "react";
const kEY = "a537d657";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMoviesData() {
      try {
        setIsLoading(true);
        setError("");
        let res = await fetch(
          `https://www.omdbapi.com/?apikey=${kEY}&s=${query}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("something went wrong");

        let data = await res.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          // console.error("Error:", error);
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // handleCloseSelectMovie();
    // callback?.();
    fetchMoviesData();
    return function () {
      controller.abort();
    }; // Invoke the async function
  }, [query]);
  return { movies, isLoading, error };
}
