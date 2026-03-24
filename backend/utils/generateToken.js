import jwt from "jsonwebtoken";

// a reusable tool for setting cookies
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", // <--- allows browser to send cookie on same-origin & localhost
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
