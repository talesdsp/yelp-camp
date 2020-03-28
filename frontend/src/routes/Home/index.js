import React from "react";
import "./landing.css";
import "./main.css";

export default function Home() {
  return (
    <React.Fragment>
      <div id="landing-header">
        <h1>Welcome to YelpCamp!</h1>
        <a href="/campgrounds" className="btn btn-lg btn-default">
          Get Started
        </a>
      </div>

      <ul className="slideshow">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </React.Fragment>
  );
}
