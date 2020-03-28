import { Router } from "express";
import { checkCommentOwner, isAdmin, isLoggedIn } from "../middleware";
import Campground from "../models/campground";
import Comment from "../models/comment";

const router = Router({ mergeParams: true });

//Comments Create
router
  .route("/")
  //Comments New
  .get(isLoggedIn, async (req, res) => {
    try {
      const campground = await Campground.findById(req.params.id);
      return res.json(campground);
    } catch (err) {
      console.log(err);
      res.status(404).json(err);
    }
  })
  .post(isLoggedIn, async (req, res) => {
    // lookup actual campground
    try {
      console.log(req.body);
      const campground = await Campground.findById(req.params.id);
      const comment = await Comment.create({
        ...req.body,
        author: req.user.id,
      });

      //save comment
      await campground.comments.push(comment);
      await campground.save();
      return res.status(201).json(campground);
    } catch (err) {
      console.log(err);
      res.status(404).json(err);
    }
  });

router
  .route("/:commentId")
  .put(isAdmin, async (req, res) => {
    try {
      const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body.comment);
      res.status(204).json(comment);
    } catch (err) {
      res.status(500).json({ message: "comment did not update" });
    }
  })
  .delete(isLoggedIn, checkCommentOwner, async (req, res) => {
    // find campground, remove comment from comments array, delete comment in db
    try {
      const campground = await Campground.findByIdAndUpdate(req.params.id, {
        $pull: {
          comments: req.params.commentId,
        },
      });
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(204).json(campground);
    } catch (err) {
      res.status(500).json({ message: "comment not deleted", flash: "danger" });
    }
  });

router.route("/:commentId/edit").get(isLoggedIn, checkCommentOwner, async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  console.log(comment);
  return res.json({ text: comment.text });
});

export default router;
