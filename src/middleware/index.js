import Campground from "../models/campground";
import Comment from "../models/comment";

const checkCredentials = (req, item) => {
  item.author._id === req.user.id || req.user.isAdmin
    ? (req.item = item)
    : () => {
        throw new Error("User not logged");
      };
};

const handleError = (req, res, message, status = 200) => {
  return res.status(status).json({ message, flash: "danger" });
};

export function isLoggedIn(req, res, next) {
  return req.isAuthenticated()
    ? next()
    : handleError(req, res, "You must be signed in to do that!");
}

export async function checkCampgroundOwner(req, res, next) {
  try {
    const foundCamp = await Campground.findById(req.params.id);
    checkCredentials(req, foundCamp);
    next();
  } catch (e) {
    handleError(req, res, e.message, 403);
  }
}

export async function checkCommentOwner(req, res, next) {
  try {
    const foundComment = await Comment.findById(req.params.commentId);
    checkCredentials(req, foundComment);
    next();
  } catch (e) {
    handleError(req, res, e.message, 403);
  }
}

export function isAdmin(req, res, next) {
  req.user.isAdmin
    ? next()
    : handleError(req, res, "This site is now read only thanks to spam and trolls.", 403);
}
export function isSafe(req, res, next) {
  req.body.image.match(/(^https:\/\/unsplash\.com\/.*)/g) ||
  req.body.image.match(/(^https:\/\/source.unsplash.com\/.*)/g)
    ? next()
    : handleError(
        req,
        res,
        "Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.",
        400
      );
}
