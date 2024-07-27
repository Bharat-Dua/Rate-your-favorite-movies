import React from "react";
// import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating maxRating={10} onSetRating={setMovieRating} color="blue" />
//       <p style={{ fontSize: "30px" }}>
//         `The rating of the movie is {movieRating}`{" "}
//       </p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={1} /> */}
    {/* <h1 className="center">Give us ⭐</h1>

    <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating color="purple" size={30} />
    <Test /> */}
  </React.StrictMode>
);
