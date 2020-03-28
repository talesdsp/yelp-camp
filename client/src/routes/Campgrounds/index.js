import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../../api";
import { pagesActions } from "../../store/ducks/page";
export default function AllCampgrounds() {
  const dispatch = useDispatch();
  const [campgrounds, setCampgrounds] = useState([]);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    API.getCamps().then((res) => {
      setCampgrounds(res.data);
      dispatch(pagesActions.campgrounds());
    });
  }, []);

  return (
    <React.Fragment>
      <header className="jumbotron">
        <div className="container">
          <h1>
            <span className="glyphicon glyphicon-tent"></span> Welcome To YelpCamp!
          </h1>
          <p>View our hand-picked campgrounds from all over the world</p>
          <p>
            <a className="btn btn-primary btn-lg" href="/campgrounds/new">
              Add New Campground
            </a>
          </p>
        </div>
      </header>

      <CampContainer campgrounds={campgrounds} />
    </React.Fragment>
  );
}

const CampContainer = ({ campgrounds }) => {
  return campgrounds.length > 1 ? (
    <div className="row text-center flex-wrap" id="campground-grid">
      {campgrounds.map(({ _id, name, image }) => CampChild(_id, name, image))}
    </div>
  ) : null;
};

const CampChild = (_id, name, image) => (
  <div key={_id} className="col-md-3 col-sm-6">
    <div className="thumbnail">
      <img src={image} alt="campsite" />
      <div className="caption">
        <h4>{name}</h4>
      </div>
      <p>
        <a href={`/campgrounds/${_id}`} className="btn btn-primary">
          More Info
        </a>
      </p>
    </div>
  </div>
);
