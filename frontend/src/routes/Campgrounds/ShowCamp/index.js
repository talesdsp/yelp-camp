import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import API from "../../../api";

export default function ShowCamp({ match }) {
  const { id, username, isAdmin } = useSelector((state) => state.users);
  const [campground, setCampground] = useState({});
  const history = useHistory();

  useEffect(() => {
    API.showCamp(match)
      .then((res) => {
        setCampground(res.data);
      })
      .catch((err) => err);
  }, []);

  const CanIEditThisCamp = ({ campground }) => {
    async function handleSubmit(e) {
      e.preventDefault();
      API.deleteCamp(campground)
        .then(() => {
          window.flash("Camp deleted successfully", "success");
          history.push("/campgrounds");
        })
        .catch((err) => {
          console.log(err);
          window.flash("An error occurred", "danger");
        });
    }
    const isOwnerOrAdmin = campground.author ? campground.author._id === id || isAdmin : false;
    return isOwnerOrAdmin ? (
      <React.Fragment>
        <a className="btn btn-warning" href={`/campgrounds/${campground._id}/edit`}>
          Edit
        </a>
        <form onSubmit={handleSubmit} className="delete-form">
          <button className="btn btn-danger">Delete</button>
        </form>
      </React.Fragment>
    ) : null;
  };

  const CommentsSection = ({ campground: { _id, comments } }) => (
    <div className="well">
      <div className="text-right">
        <a className="btn btn-success" href={`/campgrounds/${_id}/comments/new`}>
          Add New Comment
        </a>
      </div>
      <hr />
      {comments
        ? comments.length > 0 &&
          comments.map((comment) => (
            <div className="row">
              <div className="col-md-12">
                <strong>{comment.author.username}</strong>
                <span className="pull-right">{moment(comment.createdAt).fromNow()}</span>
                {comment.text}
                <CanIEditThisComment comment={comment} />
                <hr />
              </div>
            </div>
          ))
        : null}
    </div>
  );

  const CanIEditThisComment = ({ comment }) => {
    async function handleSubmit(e) {
      e.preventDefault();
      API.deleteComment(campground, comment)
        .then((res) => {
          window.flash("Deleted comment successfully", "success");
        })
        .catch((err) => {
          window.flash("Error occurred", "error");
          window.location.reload();
        });
    }

    const isOwnerOrAdmin = comment.author._id === id || isAdmin;

    return isOwnerOrAdmin ? (
      <div className="pull-right">
        <a
          href={`/campgrounds/${campground._id}/comments/${comment._id}/edit`}
          className="btn btn-xs btn-warning"
        >
          EDIT
        </a>
        <form onSubmit={handleSubmit} className="delete-form">
          <button className="btn btn-xs btn-danger">DELETE</button>
        </form>
      </div>
    ) : null;
  };

  return (
    <div className="row">
      <div className="col-md-3">
        <p className="lead">YelpCamp</p>
        <div className="list-group">
          <li className="list-group-item active">Info 1</li>
          <li className="list-group-item">Info 2</li>
          <li className="list-group-item">Info 3</li>
        </div>
        <div id="map">
          {/* <iframe
            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14800.079225593716!2d-${campground.lng}!3d-${campground.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1584689667297!5m2!1spt-BR!2sbr`}
            width="400"
            height="300"
            frameborder="0"
            style="border:0;"
            allowfullscreen=""
            aria-hidden="false"
            tabindex="0"
          ></iframe> */}
        </div>
      </div>
      <div className="col-md-9">
        <figure className="thumbnail">
          <img className="img-responsive" src={campground.image} alt="campsite" />
          <figcaption className="caption-full">
            <h4 className="pull-right">${campground.cost}/night</h4>
            <h4>{campground.name}</h4>
            <p>{campground.description}</p>
            <p>
              <em>
                Submitted by: {campground.author && campground.author.username},{" "}
                {moment(campground.createdAt).fromNow()}
              </em>
            </p>
            <CanIEditThisCamp campground={campground} />
          </figcaption>
        </figure>
        <CommentsSection campground={campground} />
      </div>
    </div>
  );
}

// {
/* function initMap() {
    var lat = <%= campground.lat %>;
    var lng = <%= campground.lng %>;
    var center = {lat: lat, lng: lng };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: center,
        scrollwheel: false
    });
    var contentString = `
      <strong><%= campground.name %><br />
      <%= campground.location %></strong>
      <p><%= campground.description %></p>
    `
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    var marker = new google.maps.Marker({
        position: center,
        map: map
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }

 */
// }
