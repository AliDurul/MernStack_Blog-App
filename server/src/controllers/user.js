"use strict";
/* -------------------------------------------------------
    EXPRESS_JS - BLOG-API Controller
------------------------------------------------------- */
// User Controller:
const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(User);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },

  create: async (req, res) => {
    const userExists = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (userExists) {
      if (userExists.email === req.body.email) {
        throw new Error("Email is already in used!");
      } else if (userExists.username === req.body.username) {
        throw new Error("Username is already in used!");
      }
    }

    // register
    let user;
    if (!isExist && !isUsernameExist) {
      user = await User.create(req.body);
      const tokenData = await Token.create({
        user_id: user._id,
        token: passwordEncrypt(user._id + Date.now()),
      });
      user._doc.id = user._id;
      user._doc.token = tokenData.token;
    }

    res.status(201).send(user);
  },

  read: async (req, res) => {
    const data = await User.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const data = await User.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
    });
  },
  delete: async (req, res) => {
    const data = await User.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
