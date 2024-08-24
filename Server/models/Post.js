import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    picturePath: {
        type: String,
        default: "",
    },
    userPicturePath: {
        type: String,
        default: "",
    },
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: [],
    },
}, {timestamps: true})

const Post = mongoose.model('Post', PostSchema); 
export default Post;