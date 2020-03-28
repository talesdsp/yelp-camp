import faker from "faker";
import fs from "fs";
import createFakeData from "../fakeAPI";
import Campground from "./models/campground";
import Comment from "./models/comment";
import User from "./models/user";

async function seedDB() {
  try {
    const {campground, comment} = await createFakeData(faker, fs);
    await User.deleteMany({});
    await Comment.deleteMany({});
    await Campground.deleteMany({});

    campground.map((camp) => createCampground(camp, comment));
  } catch (err) {
    console.log(err);
  }
}

// async function createUser(u) {
//   try {
//     await User.create(u);
//   } catch (err) {
//     console.log(err);
//   }
// }

async function createCampground(camp, comment) {
  try {
    const created = await Campground.create(camp);
    comment.map((c) => createComment(c, created));
  } catch (err) {
    console.log(err);
  }
}

async function createComment(c, camp) {
  try {
    const created = await Comment.create(c);

    const desire = await Campground.findById(camp._id);

    await desire.comments.push(created);

    await desire.save();
  } catch (err) {
    console.log(err);
  }
}

export default seedDB;
