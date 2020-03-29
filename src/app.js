import compression from "compression";
import cookieSession from "cookie-session";
import cors from "cors";
import Debug from "debug";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import "./config/passport-setup";
import "./db";
import campgroundRoutes from "./routes/campgrounds";
import commentRoutes from "./routes/comments";
import indexRoutes from "./routes/index";

const debug = Debug("http");
debug("booting now");

const app = express();

app.disable("X-Powered-By");

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: true,
    keys: [process.env.COOKIE_KEYS],
  })
);

app.use(compression());
app.use(helmet());

app.use(express.static(path.resolve(__dirname, "../frontend/build/")));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", indexRoutes);
app.use("/api/campgrounds", campgroundRoutes);
app.use("/api/campgrounds/:id/comments", commentRoutes);

app.get("*", function(request, response) {
  response.sendFile(path.resolve(__dirname, "../frontend/build/", "index.html"));
});
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 9876;
app.listen(PORT, HOST, () => {
  debug(`The YelpCamp Server Has Started on /${HOST}:${PORT}`);
});
