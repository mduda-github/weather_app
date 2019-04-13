import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import Welcome from "./components/welcome"
import Main from "./components/main"

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