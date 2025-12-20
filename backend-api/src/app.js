import express from "express";
import cors from "cors";
import morganMiddleware from "./logger/indexLog.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";


const app = express();
app.use(morganMiddleware()); 
app.use(
     cors({
          origin: "http://localhost:8080",
          credentials: true,
     })
);

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(cookieParser()); 
app.use(express.static('public'));

// Importing routes
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import resourceRouter from "./routes/resource.routes.js"
import roomRouter from "./routes/room.routes.js"

// Routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/resources", resourceRouter)

app.use("/api/v1/rooms", roomRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)


app.use(errorHandler)

export {app};