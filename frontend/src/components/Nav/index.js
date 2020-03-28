import React from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import API from "../../api";
import { pagesActions } from "../../store/ducks/page";
import { usersActions } from "../../store/ducks/user";

export default function Nav() {
  const { page } = useSelector((state) => state.pages);

  const Button = () => <></>;

  const HelloUserOrRegister = () => {
    const { username } = useSelector((state) => state.users);
    const history = useHistory();
    const dispatch = useDispatch();

    const handleClick = (e) => {
      API.signOut().then((res) => {
        history.push("/sign_in");
        batch(() => {
          dispatch(pagesActions.signIn());
          dispatch(usersActions.signOut());
        });
      });
    };

    return username ? (
      <React.Fragment>
        <li>
          <a href="#nav">Hello {username}!</a>
        </li>
        <li>
          <a onClick={handleClick}>Sign Out</a>
        </li>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <li className={page === "sign_in" ? "active" : ""}>
          <a href="/sign_in">Sign In</a>
        </li>
        <li className={page === "register" ? "active" : ""}>
          <a href="/register">Register</a>
        </li>
      </React.Fragment>
    );
  };

  return (
    <nav id="nav" className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <Button />
          <a className="navbar-brand" href="/">
            YelpCamp
          </a>
        </div>
        <div id="navbar" className="collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li className={page === "campgrounds" ? "active" : ""}>
              <a href="/campgrounds">Home</a>
            </li>
            <HelloUserOrRegister />
          </ul>
        </div>
      </div>
    </nav>
  );
}
