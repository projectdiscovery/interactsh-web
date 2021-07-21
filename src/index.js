import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import "./styles.scss";
import ReactGA from "react-ga";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import HomePage from "./pages/homePage";
import TermsPage from "./pages/termsPage";

const trackingId = "UA-165996103-1";
ReactGA.initialize(trackingId);
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({
  config: trackingId,
  js: new Date(),
});

const AnimatedSwitch = withRouter(({ location }) => {
  window.scrollTo(0, 0);
  document.getElementsByTagName("html")[0].style.overflow = "visible";
  return (
    <div style={{ color: "#AAA" }}>
      <TransitionGroup>
        <CSSTransition
          key={location.pathname}
          classNames="slide slide"
          timeout={100}
        >
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/terms" component={TermsPage} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
});
ReactDOM.render(
  <Router>
    <AnimatedSwitch />
  </Router>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
