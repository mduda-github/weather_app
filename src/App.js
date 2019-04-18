import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "./App.scss";

import Welcome from "./components/welcome.jsx"
import Main from "./components/main.jsx"

class App extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Welcome} exact/>
            <Route path="/main" component={Main}/>
          </Switch>
        </BrowserRouter>
      );
  }
}

export default App;