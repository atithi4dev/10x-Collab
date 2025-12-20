import {app} from "./app.js";
import dotenv from "dotenv";
import logger from "./logger/logger.js";
import connectDB from "./db/index.js";

dotenv.config({
     path: './.env'
});
const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
     app.listen(PORT, () => {
          logger.info(`Server is running on port ${PORT}`);
     });
})
.catch((err) => {
     logger.error("Database connection failed:", err);
     process.exit(1);
})