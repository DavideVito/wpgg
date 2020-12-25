import React from "react";

import Compose from "./Compose/Compose";
import ListaCampioni from "./Helpers/ListaCampioni";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Campione from "./Helpers/Campione/Campione";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/:id">
            <Campione />
          </Route>

          <Route exact path="/gui/edit">
            <Compose />
          </Route>

          <Route path="/">
            <ListaCampioni />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
