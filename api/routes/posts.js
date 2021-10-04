
const router = require('express').Router()
// const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post')
ObjectID = require('mongodb').ObjectID
// const User = require('../models/User');


//create post 
router.post('/',async(req,res) => {
  console.log('hello world');
    console.log(req.body);

    const newPost =await new Post(req.body)
    try {
        const post=await newPost.save()
        if(post){
            res.status(200).json({message:'post successfully saved'})
        }else{
            res.status(404).json({message:'something went wrong'})
        }
    }catch (err) {
        res.status(500).json({message:err})
    }

})
//update post 
router.put('/:id',async(req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    try {
        const post = await Post.findById(req.params.id)
        // console.log(post);
        if(post.userid === req.body.userid){
            const updatepost = await post.updateOne(req.body)
            if(updatepost){
                res.status(200).json({message:'post successfully updated'})
            }else{
                res.status(404).json({message:'updattion went wrong'})
            }
        }else{
            res.status(404).json({message:'updattion went wrong at finding'})
        }
    }catch (err) {
        res.status(500).json({message:err})
    }
})



//delete post 
router.delete('/:id',async(req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    try {
        const post = await Post.findById(req.params.id)
        // console.log(post);
        if(post.userid === req.body.userid){
            try{
                const user = await post.deleteOne()
                res.status(200).json({message:'post Deleted successfully'})
            }catch(err) {
                res.status(500).json({message: err})
            }
        }else{
            res.status(404).json({message:'deletion went wrong at finding'})
        }
    }catch (err) {
        res.status(500).json({message:err})
    }
})


//like and dislike post 
router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userid)) {
        let like=await post.updateOne({ $push: { likes: req.body.userid } });
        res.status(200).json("The post has been liked");
      } else {
        let unlike = await post.updateOne({ $pull: { likes: req.body.userid } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });



//get post(search post)
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//get timeline post
router.get("/timeline/:userId", async (req, res) => {
    // console.log(req.params);
    // console.log('timeline post');
    try {
      const currentUser = await User.findById(req.params.userId);
      // console.log(currentUser);
      // console.log('currentUser');
      const userPosts = await Post.find({ userid: currentUser._id });
      // console.log(userPosts);
      // console.log('hello world');
      const friendPosts = await Promise.all(
          currentUser.following.map((friendsid)=>{
              return Post.find({userid: friendsid})
          })
      )
      // console.log(friendPosts);
      res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  }); 


//get users all post
  router.get("/profile/:username", async (req, res) => {
    // console.log(req.params);
    // console.log('timeline post'); 
    try {
    const user = await User.findOne({username:req.params.username});
    const posts = await Post.find({userid:user._id});
    res.status(200).json(posts)
    } catch (err) {
      res.status(500).json(err);
    }
  });





module.exports = router
