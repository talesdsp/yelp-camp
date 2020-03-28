import { Router } from "express";
import { checkCampgroundOwner, isLoggedIn, isSafe } from "../middleware";
import Campground from "../models/campground";
import Comment from "../models/comment";
import User from "../models/user";

const router = Router({ mergeParams: false });
// Define escapeRegex function for search feature
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//INDEX - show all campgrounds
router.get("/", async (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    // Get searched camp from DB
    const data = await Campground.find({ name: regex });
    return res.status(200).json(data);
  } else {
    // Get all campgrounds from DB
    const data = await Campground.find({});
    res.json(data);
  }
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, isSafe, async (req, res) => {
  // get data from form and add to campgrounds array
  try {
    const author = {
      _id: req.user.id,
      username: req.user.username,
    };

    // geocode(req.body.location, async (err, results) => {
    //   if (err) throw new ReferenceError("Location is wrong");
    //   const lat = results[0].geometry.location.lat;
    //   const lng = results[0].geometry.location.lng;
    //   const location = results[0].formatted_address;

    const image = req.body.image.replace(
      /(^https:\/\/unsplash.com\/photos\/)/g,
      "https://source.unsplash.com/"
    );
    const newCampground = {
      ...req.body,
      author,
      image,
    };

    const newlyCreated = await Campground.create(newCampground);

    return res.status(201).json(newlyCreated);

    // Create a new campground and save to DB
  } catch (err) {
    return res.status(400).json({ err, message: "camp not created" });
  }
});

// SHOW - shows more info about one campground
router.get("/:id", async (req, res) => {
  try {
    const foundCampground = await Campground.findById(req.params.id)
      .populate("comments")
      .populate("author");

    foundCampground.comments = await User.populate(foundCampground.comments, { path: "author" });

    if (!foundCampground) throw Error;

    return res.json(foundCampground);
  } catch (err) {
    res.status(404).json("Error");
  }
});

router
  .put("/:id", isSafe, async (req, res) => {
    try {
      // const data = await geocode(req.body.location);
      // const lat = data.results[0].geometry.location.lat;
      // const lng = data.results[0].geometry.location.lng;
      // const location = data.results[0].formatted_address;

      const skip = req.body.image.match(/(^https:\/\/source.unsplash.com\/.*)/g);
      let image = req.body.image;

      if (!skip) {
        image = req.body.image.replace(
          /(^https:\/\/unsplash.com\/photos\/)/g,
          "https://source.unsplash.com/"
        );
      }
      console.log(req.params);
      const newData = {
        ...req.body,
        _id: req.params.id,
        image,
        author: req.user.id,
      };

      const up = await Campground.findOneAndUpdate({ _id: req.params.id }, newData, { new: true });
      return res.status(204).json({ message: "updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "camp did not update" });
    }
  })

  // DELETE - removes campground and its comments from the database
  .delete(isLoggedIn, checkCampgroundOwner, async function DeleteCampground(req, res) {
    try {
      const camp = await Campground.findById(req.params.id);
      await Comment.remove({
        _id: {
          $in: camp.comments,
        },
      });
      await Campground.findByIdAndDelete(req.params.id);
      res.status(204).json({ message: "deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

// EDIT - shows edit form for a campground
router.get("/:id/edit", isLoggedIn, checkCampgroundOwner, (req, res) => {
  res.json();
});

export default router;
