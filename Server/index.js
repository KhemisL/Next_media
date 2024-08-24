import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/user.js";
import postRoute from "./routes/posts.js"
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/post.js";
import User from "./models/User.js"
import Post from "./models/Post.js"
import { users, posts } from "./data/index.js"


// configuration
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyparser.json({limit : "30mb", extended : true}));
app.use(bodyparser.urlencoded({limit : "30mb", extended : true}));
app.use(cors());
app.use("/assets", express.static(path.join(dirName, "public/assets")));

// file storage
const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename : function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route with file
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost)

// Route
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/posts", postRoute );

// Mongoose setup
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Server Port : ${PORT}`));

    // // Vérifier si les utilisateurs existent déjà
    // const existingUsers =  User.find({});
    // if (existingUsers.length === 0) {
    //      User.insertMany(users);
    //     console.log("Users inserted");
    // } else {
    //     console.log("Users already exist in the database");
    // }

    // // Vérifier si les posts existent déjà
    // const existingPosts = Post.find({});
    // if (existingPosts.length === 0) {
    //      Post.insertMany(posts);
    //     console.log("Posts inserted");
    // } else {
    //     console.log("Posts already exist in the database");
    // }
}).catch((err) => console.log(`Connexion échoué: ${err}`)
)