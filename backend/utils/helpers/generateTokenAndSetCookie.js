import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // not allow js
    maxAge: 15 * 60 * 60 * 24 * 1000, //15 days
    sameSite: "strict", //CSRF
  });
  return token;
};

export default generateTokenAndSetCookie;
