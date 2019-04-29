import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const Search = (props) => (
    <div className="search">
        <p>Please enter city and country:</p>
        <form onSubmit={props.getData}>
            <input type="text" name="city" placeholder="City..."/>
            <input type="text" name="country" placeholder="Country..."/>
            {props.error && <p>{props.error}</p>}
            <button><FontAwesomeIcon icon={faArrowRight} /></button>
        </form>
    </div>
);

export default Search;

