const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWTKEY = process.env.JWTKEY;
const { find_one_user, save_new_user, update_one_user } = require("../services/user.services");

exports.signup = async function (req, res) {
  try {
    const { nickname, password } = req.body;
    if (!nickname) return res.status(400).json({ status: false, message: "Nickname is required!" });
    if (nickname.length < 3) return res.status(400).json({ status: false, message: "Nickname length must be greater than 3!" });
    if (!password) return res.status(400).json({ status: false, message: "Password is required!" });

    //CHECK THE USER BY NICKNAME IF IT IS ALREADY EXITS
    const checkuser = await find_one_user({ nickname });
    if (checkuser) return res.status(400).json({ status: false, message: "Nickname already exists!!" });

    const hash = await bcrypt.hash(password, 10);
    //SAVE THE USER DATA TO THE DATABASE
    const new_user = await save_new_user({ nickname, password: hash });
    if (!new_user) return res.status(400).json({ status: false, message: "Registration failed! Please try again later!" });

    //GENERATE TOKEN
    const token = jwt.sign({ user_id: new_user._id }, JWTKEY, {
      expiresIn: "1d",
    });

    // SAVE THE USER TOKEN TO THE DATABASE
    const updatetoken = await update_one_user(new_user._id, { token });
    return res.status(201).json({ status: true, data: new_user, message: "Registration successfull!" });
  } catch (error) {
    console.log("error===", error);
    return res.status(400).json({ status: false, message: "Something went wrong!" });
  }
};

exports.login = async function (req, res) {
  try {
    const { nickname, password } = req.body;
    if (!nickname) return res.status(400).json({ status: false, message: "Nickname is required!" });
    if (!password) return res.status(400).json({ status: false, message: "Password is required!" });

    //CHECK THE USER BY NICKNAME IF IT IS ALREADY EXITS
    const checkuser = await find_one_user({ nickname });
    if (!checkuser) return res.status(400).json({ status: false, message: "User not found!!" });

    const pass_check = await bcrypt.compare(password, checkuser.password);
    if (!pass_check) return res.status(400).json({ status: false, message: "Invalid username or password!!" });


    //GENERATE TOKEN
    const token = jwt.sign({ user_id: checkuser._id }, JWTKEY, {
      expiresIn: "1d",
    });

    // SAVE THE USER TOKEN TO THE DATABASE
    const updatetoken = await update_one_user(checkuser._id, { token });
    return res.status(200).json({ status: true, token: token, message: "Login successfull!" });
  } catch (error) {
    console.log("error===", error);
    return res.status(400).json({ status: false, message: "Something went wrong!" });
  }
};
