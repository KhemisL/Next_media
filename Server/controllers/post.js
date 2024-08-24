import Post from "../models/Post.js";
import User from "../models/User.js";
export const createPost = async (req, res) => {
    try {
        const {
            userId,
            picturePath,
            description
        } = req.body;
        const user = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstname: user.firstname,
            lastName: user.lastName,
            location: user.location,
            userPicturePath: user.picturePath,
            picturePath,
            description,
            likes: {},
            comments: []
        })
        
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = res.body;
        const post = await Post.findById(id);
        const liked = await Post.findById(userId);

        if(liked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await post.findByIdAnUpdate(id, { likes: post.likes}, {new: true})
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}