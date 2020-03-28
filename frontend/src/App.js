import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import API from "./api";
//  Components
import Flash from "./components/Flash";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
//  Routes
import AllCampgrounds from "./routes/Campgrounds";
import EditComment from "./routes/Campgrounds/Comments/EditComment";
import NewComment from "./routes/Campgrounds/Comments/NewComment";
import EditCamp from "./routes/Campgrounds/EditCamp";
import NewCamp from "./routes/Campgrounds/NewCamp";
import ShowCamp from "./routes/Campgrounds/ShowCamp";
import Home from "./routes/Home";
import Register from "./routes/Register";
import SignIn from "./routes/SignIn";
import { usersActions } from "./store/ducks/user";
import Bus from "./Utils/Bus";

export default function App() {
  window.flash = (message, type = "success") => Bus.emit("flash", { message, type });
  const dispatch = useDispatch();
  useEffect(() => {
    API.checkUser().then((res) => {
      if (res.data.username) dispatch(usersActions.signIn(res.data));
    }, []);
  });

  return (
    <BrowserRouter>
      <Nav />
      <div style={{ position: "absolute", top: "1rem", left: "0" }}>
        <Flash />
      </div>

      <Switch>
        <Route exact path="/" component={Home} />

        <Route exact path="/register" component={Register} />
        <Route exact path="/sign_in" component={SignIn} />
        <Route exact path="/sign_out" component={SignIn} />
        <Route exact path="/campgrounds/" component={AllCampgrounds} />

        {/* privateRoute */}
        <PrivateRoute exact path="/campgrounds/new" component={NewCamp} />
        <PrivateRoute exact path="/campgrounds/:id/edit" component={EditCamp} />
        <PrivateRoute exact path="/campgrounds/:id/comments/new" component={NewComment} />
        <PrivateRoute
          exact
          path="/campgrounds/:id/comments/:commentId/edit"
          component={EditComment}
        />
        {/* endprivate */}

        <Route exact path="/campgrounds/:id" component={ShowCamp} />

        <Route component={PageNotFound} />
      </Switch>

      <Footer />
    </BrowserRouter>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const [state, setState] = useState(null);
  const history = useHistory();
  useEffect(() => {
    (async function() {
      const res = await API.checkUser();
      res.data.message === "User logged successfully" ? setState(true) : setState(false);
      return;
    })();
  }, [setState]);

  const iffer = (props) => {
    if (state === true) {
      return <Component {...props} />;
    }
    if (state === false) {
      history.replace("/sign_in");
    }
  };

  return <Route {...rest} render={(props) => iffer(props)} />;
}

function PageNotFound() {
  return <pre>Err Page not found Redirect back please</pre>;
}
