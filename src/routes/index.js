import { Router } from "express";
import passport from "passport";
import { isLoggedIn } from "../middleware";
import { registerUser } from "../use-cases/create";

const router = Router();

router.get("/", (req, res) => {
  res.render("index.html");
});

const userFound = (req, res) => {
  return res.json({
    id: req.user.id,
    username: req.user.username,
    isAdmin: req.user.isAdmin,
    message: "User logged successfully",
    flash: "success",
  });
};

router.get("/check", isLoggedIn, userFound);

router.post("/register", registerUser, passport.authenticate("local"), userFound);

router.route("/sign_in").post(passport.authenticate("local"), userFound);

router.route("/sign_out").get((req, res) => {
  req.logout();
  res.json({ message: "sign_out" });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get("/auth/google/redirect", passport.authenticate("google"), (req, res) => {
  res.json("Success");
});

export default router;
