import debug from "debug";
import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(async () => {
    debug("Database connected");

    // seedDB();
  })
  .catch((err) => debug(`Database connection error: ${err.message}`));
