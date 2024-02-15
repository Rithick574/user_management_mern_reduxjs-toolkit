const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const User = require("../models/user");



//post signup
const postSignup = async (req, res) => {
  try {
    // console.log(req.body);
    const Existuser = await User.findOne({ email: req.body.email });
    if (Existuser) {
      return res.json({ error: "user already exists" });
    } else {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      const hashedPassword = await bcrypt.hash(req.body.Password, salt);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        role: "user",
        password: hashedPassword,
        profile: "./src/assets/profileimg.jpg",
      });

      const savedUser = await newUser.save();
      const JWT_SECRET = process.env.JWT_SECRET;

      const token = jwt.sign({ user: savedUser._id }, JWT_SECRET);

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json({ success: true });
    }
  } catch (error) {
    console.error("error while signup:", error);
  }
};

//fetch data
const fetchData = async (req, res) => {
  try {
    console.log("Here in backend");

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized1" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ error: "Unauthorized2" });
    }
    const data = await User.findById(verified.user);
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data);
  } catch (error) {
    console.error("error while fetch data:", error);
  }
};

//post login
const login = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    console.log(existingUser);
    if (!existingUser) {
      return res.json({ emailerr: "User not found" });
    }

    const passwordCorrect = bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!passwordCorrect) {
      return res.json({ passworderr: "Wrong password" });
    } else {
      const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.JWT_SECRET
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json({ success: true });
    }
    console.log("done");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//edit profile
const editprofile = async (req, res) => {
  try {
    const name = req.body.name;
    const orgpassword = req.body.password;
    const currentPassword = req.body.currentpassword;
    const newPassword = req.body.newpassword;

    let updateFields = { name };
    let passwordCorrect;
    if (currentPassword.length && newPassword.length) {
      passwordCorrect = await bcrypt.compare(currentPassword, orgpassword);
      if (passwordCorrect) {
        const salt = await bcrypt.genSalt();
        const hashedNewPass = await bcrypt.hash(newPassword, salt);
        updateFields.password = hashedNewPass;
      }
    } else {
      passwordCorrect = true;
    }

    await User.updateOne({ _id: req.body._id }, { $set: updateFields });

    if (passwordCorrect) {
      res.json({ success: true });
    } else {
      res.json({ error: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.json({ error: "Internal Server Error" });
  }
};

//upload image
const uploadImage=async(req,res)=>{
    try {
        const token = req.cookies.token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: verified.user })
        const imageUrl = user.profile;

        //deleting existin profile image
        if (imageUrl !== "./src/assets/profileimg.jpg") {

            const parsedUrl = new URL(imageUrl);
            const imageName = path.basename(parsedUrl.pathname);

            const folderPath = './public/assets';
            const imagePath = path.join(folderPath, imageName);
            if (fs.existsSync(imagePath)) {

                fs.unlinkSync(imagePath);
                console.log(`${imageName} has been deleted successfully.`);
            } else {
                console.log(`${imageName} does not exist in the folder.`);
            }
        }
        const path_image = process.env.IMAGE_PATH + `profileimages/${req.file.filename}`
        const data = await User.updateOne({ _id: verified.user }, { $set: { profile: path_image } });
        res.json(data)

    } catch (error) {
        console.log(error);
    }
}

//logout
const logout = (req, res) => {
  res.clearCookie("token").send({ something: "here" });
};

module.exports = { postSignup, fetchData, login, logout, editprofile,uploadImage };