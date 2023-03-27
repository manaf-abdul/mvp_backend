import jwt from "jsonwebtoken";

export const validateAccessToken = (req, res, next) => {  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const accessToken = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_PRIVATE_KEY);
    req.body.userEmail = decoded.email;
    req.body.userId = decoded._id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
