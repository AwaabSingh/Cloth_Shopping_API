const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

/**
 * @desc  register a user
 * @param {POST} /api/auth/register
 * @param  Private
 **/

const register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * @desc  Login a user
 * @param {POST} /api/auth/login
 * @param  Private
 **/
const login = async (req, res) => {
  try {
    const user = await User.findOne({
      userName: req.body.user_name,
    });

    !user && res.status(401).json('Wrong User Name');

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SECRET
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    const inputPassword = req.body.password;

    originalPassword != inputPassword && res.status(401).json('Wrong Password');

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

module.exports = {
  register,
  login,
};
