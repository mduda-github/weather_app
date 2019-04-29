import React from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import "./App.scss";

import Welcome from "./components/welcome.jsx"
import Main from "./components/main.jsx"

class App extends React.Component {

  updateDimensions() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  componentDidMount() {
      this.updateDimensions();
      window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  
  render() {
    return (
        <HashRouter>
          <Switch>
            <Route path="/" component={Welcome} exact/>
            <Route path="/main" component={Main}/>
          </Switch>
        </HashRouter>
      );
  }
}

export default App;