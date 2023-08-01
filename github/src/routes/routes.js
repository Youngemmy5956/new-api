import express from "express";
import User_model from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Post_model from "../model/post.js";
import Comment_model from "../model/comment.js";
// import auth from "../middleware/auth.js";

const router = express.Router();

// auth create  user

router.post("/auth/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "password is less than 8 characters" });
  }
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (email.indexOf("@") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (email.indexOf(".") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User_model.create({
        firstName,
        lastName,
        email,
        password: hash,
      }).then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email },
          process.env.JWT_SECRECT_KEY,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ message: "User successfully created", user });
      });
    });
  } catch (err) {
    res.status(400).json({
      message: "User not successfully created",
      error: err.message,
    });
  }
});

// auth login user

router.post("/auth/login", async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({ message: "email or password not provided " });
  }
  try {
    const user = await User_model.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "Login not successful", error: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );

          // user.token = token;

          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "Login successful", user, token });
        } else {
          res.status(400).json({ message: "Invalid Credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
});

// auth logout user

router.get("/logoutUser", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logout successful" });
});

// auth followers

router.put("/follow", async (req, res) => {
  User_model.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, _result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

// auth unfollowers

router.put("/unfollow", async (req, res) => {
  User_model.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, _result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

// auth update profile pic

router.put("/updatepic", async (req, res) => {
  User_model.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Update failed" });
      }
      res.json(result);
    }
  );
});

// auth get userById

router.get("/user/:id", async (req, res) => {
  User_model.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

// auth search users

router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

// feed create post
router.post("/createPost", async (req, res) => {
  const { title, body, image } = req.body;
  if (!title || !body || !image) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const post = new Post_model({
    title,
    body,
    image,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//feed get post
router.get("/getPost", async (req, res) => {
  Post_model.find({ postedBy: req.user._id })
    .populate("postedBy", "_id firstName lastName")
    .then((posts) => {
      res.json({ posts });
    });
});

//feed get all post

router.get("/getAllPost", async (req, res) => {
  Post_model.find()
    .populate("postedBy", "_id firstName lastName")
    .then((posts) => {
      res.json({ posts });
    });
});

//feed put likes to post

router.put("/like", async (req, res) => {
  Post_model.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id firstName lastName")
    .populate("comments.postedBy", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// feed put unlike to post

router.put("/unlike", async (req, res) => {
  Post_model.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id firstName lastName")
    .populate("comments.postedBy", "_id firstName lastName")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// feed put comments to post

router.post("/comment", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "all fields are required" });
  }
  //   try {
  //     const comment = await Comment_model.create({ name, upvotes, comments });
  //     res.status(201).json({ comment });
  //   }
  //   catch (err) {
  //     res.status(400).json({ message: err.message });
  //   }
  // });
  const comment = new Comment_model({
    text,
    postedBy: req.user,
  });
  comment
    .save()
    .then((result) => {
      res.json({ comment: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// feed to get comment by id

router.get("/comment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Comment_model.findById(id).then((comments) => {
      res
        .status(201)
        .json({ message: "comment successfully updated", comments });
    });
  } catch (err) {
    res.status(400).json({
      message: "comment not successfully listed",
      error: err.message,
    });
  }
});

// feed to get comment and update by id

router.put("/commentUpdate/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    await Comment_model.findByIdAndUpdate(id, { text }).then((comments) => {
      res
        .status(201)
        .json({ message: "comment successfully updated", comments });
    });
  } catch (err) {
    res.status(400).json({
      message: "comment not successfully updated",
      error: err.message,
    });
  }
});

// router.put("/comment", async (req, res) => {
//   const comment = {
//     text: req.body.text,
//     postedBy: req.user._id,
//   };
//   Post_model.findByIdAndUpdate(
//     req.body.postId,
//     {
//       $push: { comments: comment },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("postedBy", "_id firstName lastName")
//     .populate("comments.postedBy", "_id firstName lastName")
//     .exec((err, result) => {
//       if (err) {
//         return res.status(422).json({ error: err });
//       } else {
//         res.json(result);
//       }
//     });
// });

// feed delete post

router.delete("/deletePost/:postId", async (req, res) => {
  Post_model.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id firstName lastName")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.get("/feed", async (req, res) => {
  Post_model.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/explore", async (req, res) => {
  Post_model.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
