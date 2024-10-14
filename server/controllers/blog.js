const Blog = require("../models/Blog")
const User = require("../models/User")
const Comment = require("../models/Comment")
const { errorHandler } = require('../auth');


// Add Posts
module.exports.addPost = (req,res) =>{

    let newBlog = new Blog({ 
        image: req.body.image,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
    })

    Blog.findOne({title:req.body.name}).then(existingPost =>{
        if(existingPost){
            return res.status(404).send({message: "Title Already exist"})
        }
        else
        {
            return newBlog.save()
            .then(blog => res.status(200).send(blog))
        }
    }).catch(error => errorHandler(error, req, res))



}

// Retrieve all posts (Admin only)
module.exports.getAllPosts = (req, res) => {
    Blog.find({})
      .then(blog => {
        if (blog.length === 0) {
          return res.status(404).send({ message: 'No posts found' });
        } else {
          return res.status(200).send(blog);
        }
      })
      .catch(error => errorHandler(error, req, res));
  };




// Retrieve Active Posts
module.exports.getActivePosts = (req, res) => {
    Blog.find({isActive: true})
    .then(blog => {
        if(blog.length >= 0)
            {
                return res.status(200).send(blog)
            }
            else
            {
                return res.status(404).send({message: 'No posts found'})
            }

    }).catch(error => errorHandler(error, req, res))
}

// Retrieve single Post
module.exports.getPost = (req, res) => {
    const blogId = req.params.postId
    Blog.findById(blogId)
    .then(blog => { 
        if(blog)
        {
            return res.status(200).send(blog)
        }
        else
        {
            return res.status(404).send({message: "Blog not found"})
        }
    }).catch(error => errorHandler(error,req,res))
}

// Update Post
module.exports.udpatePost = (req, res) => {
    
    const blogId = req.params.postId
    const title = req.body.title
    const content = req.body.content
    const author = req.body.author
    const image = req.body.image

    if(title === "" || title === " " || title === null || title === undefined || content === "" || content === " " || content === null || content === undefined || author === "" || author === " " || author === null || author === undefined)
    {
        return res.status(404).send({message: "All fields are required"})
    }

    else{
        let updatePost = {
            title: title,
            content: content,
            author: author,
            image: image
        }


        return Blog.findByIdAndUpdate(blogId, updatePost)
        .then(blog => {
            if(blog)
            {
                res.status(200).send({success: true, message:"Post udpated successfully"})
            }
            else
            {
                res.status(404).send({error: 'Post not successfully updated'})
            }
        })
        .catch(error => errorHandler(error,req,res))
    }

}

// Activate Post
module.exports.setActivePost = (req, res) =>{
    const blogId = req.params.postId

    let updateActiveField = {
            isActive: true
    }

    Blog.findByIdAndUpdate(blogId, updateActiveField)
    .then(blog => {
        if(blog)
        {
            if(blog.isActive)
            {
                return res.status(200).send({
                    message: "Post already activated",
                    activatePost: blog   
                })
            }
            return res.status(200).send({
                success: true,
                message: "Post activated successfully",
                activatePost: blog
            })
        } else {
            return res.status(404).send({error: "Post not found"})
        }
    }).catch(error => errorHandler(error,req.res))
}

// Deactivate Post
module.exports.setDeactivePost =(req,res) => {
    const blogId = req.params.postId

    let updateActiveField = {
        isActive: false
    }

    Blog.findByIdAndUpdate(blogId, updateActiveField)
    .then(blog => {
        if(blog)
        {
            if(!blog.isActive)
            {
                return res.status(200).send({
                    message: "Post already deactivated",
                    deactivatePost: blog
                })
            }
            return res.status(200).send({
                success: true,
                message: "Post deactivated successfully",
                deactivatePost: blog
            })
        }
        else {
            return res.status(404).send({error: "Post not found"})
        }
    }).catch(error => errorHandler(error,req,res))
}

// Delete Post
module.exports.deletePost = (req,res) =>{
    const blogId = req.params.postId
    Blog.findByIdAndDelete(blogId)
    .then(blog => {
        if(!blog){
            return res.status(404).send({message: "Post not Deleted"})
        }
        else
        {
            return res.status(200).send({message: "Post Deleted Successfully"})
        }
    }).catch(error => errorHandler(error,req,res))
}

// Add comments
module.exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;
        const { comment } = req.body;

        // Ensure user is authenticated
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        if (!comment) return res.status(400).json({ message: 'Comment is required' });

        // Fetch the user’s name from the User schema (if not present in req.user)
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Create a new comment with the user's name
        const newComment = new Comment({
            postId,
            userId,
            name: user.name, // Get the name from the User schema
            comment,
        });

        const savedComment = await newComment.save();

        // Find the post and push the new comment’s ID into the comments array
        const post = await Blog.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push(savedComment._id);
        await post.save();

        res.status(200).json({ success: true, message: 'Comment added successfully' ,  comment: savedComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


 // get Comments
 module.exports.getComments = async (req, res) => {
    try {
      const postId = req.params.postId;
      const blog = await Blog.findById(postId).populate('comments');
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      const comments = blog.comments;
      res.json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching comments' });
    }
  };



  // Delete comment
module.exports.deleteComment = async (req, res) => {
    try {
      const { postId } = req.params;
      const { commentId } = req.body; 

      const blog = await Blog.findById(postId);
  
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      const comment = blog.comments.id(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      blog.comments.pull(commentId);
      await blog.save();
  
      res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting comment' });
    }
  };