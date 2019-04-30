import React from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const Search = (props) => (
    <CSSTransition
        in={true}
        appear={true}
        timeout={450}
        classNames="fade"
        >
        <div className="search">
            <p>Please enter city and country:</p>
            <form onSubmit={props.getData}>
                <input type="text" name="city" placeholder="City..."/>
                <input type="text" name="country" placeholder="Country..."/>
                {props.error && <p>{props.error}</p>}
                <div className="row">
                    <Link to="/"><FontAwesomeIcon icon={faArrowLeft} /></Link>
                    <button><FontAwesomeIcon icon={faArrowRight} /></button>
                </div>
            </form>
        </div>
    </CSSTransition>
);

export default Search;

