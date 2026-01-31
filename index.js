require("./service/redis");
const rateLimiter = require("./middlewares/rateLimit");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const redisClient = require("./service/redis");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8002;

connectToMongoDB(process.env.MONGODB ?? "mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId",rateLimiter, async (req, res) => {
  const shortId = req.params.shortId;


   // 1️⃣ Check Redis cache first
  const cachedUrl = await redisClient.get(shortId);
  if (cachedUrl) {
    console.log("redis hit");
    return res.redirect(cachedUrl);
  }
  console.log("redis miss");
  // now mongodb
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
   if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  // 3️⃣ Store in Redis
  await redisClient.set(shortId, entry.redirectURL, {
    EX: 60 * 60, // 1 hour TTL
  });

  return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
