import bcryptjs from "bcryptjs";
import { escape } from "sanitizer";
import User from "../../models/user";

const generateHash = (password) => bcryptjs.hashSync(escape(password), 8);

export async function registerUser(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const exist = await User.findOne({ email: email });
    if (exist) {
      return res.status(400).json({ message: "User already exists", flash: "danger" });
    }

    const user = new User({
      username: escape(username),
      email: escape(email),
      password: generateHash(password),
    });

    await User.create(user);
    next();
  } catch (err) {
    console.log(err);
  }
}
