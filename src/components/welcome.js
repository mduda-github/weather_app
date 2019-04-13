import React from "react";
import { NavLink } from "react-router-dom";


const Welcome = () => (
    <div>
        <h1>Welcome to WeatherApp</h1>
        <p>To check the weather click search button below:</p>
        <NavLink to="/main">Search</NavLink>
    </div>
);


export default Welcome;