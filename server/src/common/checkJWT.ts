import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkJWT = (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the head
  const token = <string>req.headers["token"];
  let jwtPayload;
  // 認證 token 並且 get data
  try {
    jwtPayload = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    if (error.message == "invalid token") {
      res.status(401).json({ status: 401, message: "link incorrect" });
    }
    if (error.message == "jwt expired") {
      res.status(401).json({ status: 401, message: "please login" });
    }
    if (error.message == "jwt must be provided") {
      res.status(401).json({ status: 401, message: "please login" });
    }
  }
  next();
};
