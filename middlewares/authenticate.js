const JWTKEY = process.env.JWTKEY;
const { verify } = require("jsonwebtoken");
const { find_user_by_id } = require("../services/user.services");

exports.AuthenticateApi = async (req, res, next) => {
  try {
    const auth_header = req.get("authorization");
    if (!auth_header || auth_header === "") {
      return res.status(401).json({
        status: false,
        message: "You are not authorized to perform this operation!",
      });
    }

    //if token is available,
    //then split
    const values = auth_header.split(" ");
    //This way it works with or without "Bearer"
    const token = values[0].length > 20 ? values[0] : values[1];

    //Decode that token using verify
    let decoded_token = verify(token, JWTKEY);

    if (!decoded_token) {
      return res.status(401).json({ status: false, message: "Invalid or expired token!" });
    }

    //FOR USER TOKEN AND VALIATION
    if (decoded_token.user_id) {
      let user = await find_user_by_id(decoded_token.user_id);
      if (!user) {
        return res.status(401).json({ status: false, message: "Token expired! Please login again." });
      }
      if (!user.token) {
        return res.status(401).json({ status: false, message: "You are logged out! Please login again." });
      }
      //FOR USER VERIFICATION
      req.user = user;
    }

    req.tokenData = decoded_token;
    console.log(req.tokenData);
    return next();
  } catch (err) {
    console.log("err============", err);
    if (err.message == "jwt expired") err.message = "Please re-login your account!!";
    return res.status(401).json({ status: false, message: err.message });
  }
};
