import React from "react";

import {inject} from "@vercel/analytics";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { HashRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import "./styles.scss";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import HomePage from "./pages/homePage";
import TermsPage from "./pages/termsPage";
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';

const trackingId = "UA-165996103-1";
ReactGA.initialize(trackingId);
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.set({
  config: trackingId,
  js: new Date(),
});
inject()

const AnimatedSwitch = withRouter(({ location }) => {
  window.scrollTo(0, 0);
  document.getElementsByTagName("html")[0].style.overflow = "visible";
  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames="slide slide" timeout={10}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/terms" component={TermsPage} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
});
ReactDOM.render(
  <Router>
    <AnimatedSwitch />
  </Router>,
  document.getElementById("root")
);

reportWebVitals(sendToVercelAnalytics);

if (module.hot) {
  module.hot.accept();
}
