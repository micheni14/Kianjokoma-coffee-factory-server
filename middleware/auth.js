import jwt from "jsonwebtoken";
import dot_env from "dotenv";
dot_env.config();
const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];

    if (token) {
      jwt.verify(token, process.env.LOGIN_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(401).json("Acces denied!..No authorization token");
        } else {
          next();
        }
      });
    }
  } catch (error) {
    res.status(401).json({ message: "Acces denied!..No authorization token" });
  }
};
export default auth;
