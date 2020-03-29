import Axios from "axios";
import qs from "querystring";
const baseURL = "http://0.0.0.0:9876/api";

const user = {
  checkUser: () => Axios.get(baseURL + "/check"),

  createUser: (user) => Axios.post(`${baseURL}/register`, qs.stringify(user)),

  signIn: (user) => Axios.post(`${baseURL}/sign_in`, qs.stringify(user)),

  signOut: () => Axios.get(`${baseURL}/sign_out`),
};

const camp = {
  getCamps: () => Axios.get(baseURL + "/campgrounds/"),

  createCamp: (campState) => Axios.post(`${baseURL}/campgrounds/`, qs.stringify(campState)),

  showCamp: (match) => Axios.get(`${baseURL}/campgrounds/${match.params.id}`),

  updateCamp: (match, camp) =>
    Axios.put(`${baseURL}/campgrounds/${match.params.id}`, qs.stringify(camp)),

  deleteCamp: (campground) => Axios.delete(`${baseURL}/campgrounds/${campground._id}`),
};

const comment = {
  addComment: (campground, comment) =>
    Axios.post(`${baseURL}/campgrounds/${campground._id}/comments`, qs.stringify(comment)),

  updateComment: (match, comment) =>
    Axios.put(
      `/campgrounds/${match.params.id}/comments/${match.params.commentId}`,
      qs.stringify(comment)
    ),

  showComment: (match) =>
    Axios.get(`${baseURL}/campgrounds/${match.params.id}/comments/${match.params.commentId}/edit`),

  deleteComment: (campground, comment) =>
    Axios.delete(`${baseURL}/campgrounds/${campground._id}/comments/${comment._id}`),
};

const API = {
  ...user,

  ...camp,

  ...comment,
};

export default API;
