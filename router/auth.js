const router = require("express").Router();
require("../db/connection");
const { response } = require("express");
const User = require("../model/userSchema");
const Order = require("../model/ordersSchema");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.send("Hello form router");
});

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({
      error: "please fill all fields",
    });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({
        error: "user already exist. please login",
      });
    } else if (password !== cpassword) {
      return res.status(401).json({
        msg: "Password did not match",
      });
    }

    const user = new User({ name, email, password, cpassword });

    const userRegistered = await user.save();
    if (userRegistered) {
      res.status(201).json({
        msg: "user registered sccessfully",
      });
    } else {
      res.sendStatus(201).json({
        msg: "error occured",
      });
    }
  } catch (err) {
    return res.status(400).json({
      err: err,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        msg: "Fill Data properly",
      });
    }

    const userLogin = await User.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (userLogin) {
      if (isMatch) {
        res.status(200).json({ msg: "Login sucessfull" });
      } else {
        res.status(401).json({ msg: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ msg: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.post("/checkLogin", (req, res) => {});
//to logout from existing user by destroying cookie
router.get("/logout", (req, res) => {
  res.status(200).send("User Logout");
});

router.post("/placeorder", async (req, res) => {
  const body = req.body;
  const name = body.name;
  const email = body.email;
  const contact = body.contact;
  const address = body.address;
  const products = body.products;

  const order = new Order({
    name: name,
    email: email,
    contact: contact,
    address: address,
    products: products,
  });

  const placedOrder = await order.save();

  if (placedOrder) {
    res.send("Order placed");
  }
  console.log(body);
});

module.exports = router;
