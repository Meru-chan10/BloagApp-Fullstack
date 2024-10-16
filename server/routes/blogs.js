// Dependencies
const express = require("express");
const blogController = require("../controllers/blog");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Blog routes
router.post("/addPost", verify, verifyAdmin,  blogController.addPost);

router.get("/all", verify, verifyAdmin, blogController.getAllPosts);

router.get("/activePosts", blogController.getActivePosts)

router.get("/getPost/:postId", blogController.getPost);

router.patch("/updatePost/:postId", verify, verifyAdmin, blogController.updatePost);

router.patch("/setActivePost/:postId", verify, verifyAdmin,  blogController.setActivePost);

router.patch("/setDeactivePost/:postId", verify, verifyAdmin,  blogController.setDeactivePost);

router.delete("/deletePost/:postId", verify, verifyAdmin,  blogController.deletePost);

router.patch("/addComment/:postId", verify, blogController.addComment);

router.get("/getComments/:postId", blogController.getComments);

router.delete("/deleteComment/:postId", verify, verifyAdmin, blogController.deleteComment)

module.exports = router;