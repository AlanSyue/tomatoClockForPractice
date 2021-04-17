import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import * as nodemailer from "nodemailer";
import * as moment from "moment";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

export const verify = async function (req: Request, res: Response) {
  const userRepo = getRepository(User);
  const { id, verifiedCode } = req.query;
  const user = await userRepo.findOne({ where: { id: id } });
  if (!user || verifiedCode != user.verifiedCode)
    return res
      .status(401)
      .json({ status: 401, auth: false, message: "link incorrect" });
  user.verified = true;
  user.verifiedAt = moment(moment().valueOf()).format(
    "YYYY-MM-DDTHH:mm:ss.SSS"
  );
  const results = userRepo.save(user);
  res.status(200).json({ status: 200, message: "signup success" });
};
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.USEREMAIL,
    pass: process.env.PASSWORD,
  },
});

export const register = async function (req: Request, res: Response) {
  const { name, email, password } = req.body;
  const emailRepo = await getRepository(User).find({
    where: { email: req.body.email },
  });
  if (emailRepo.length != 0) {
    return res.status(401).json({ status: 401, errors: "email has been used" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verifiedCode = "ABCD12345";
  const newUser = getRepository(User).create({
    name: name,
    email: email,
    password: hashedPassword,
    verifiedCode: verifiedCode,
  });
  const results = await getRepository(User).save(newUser);
  let mailOptions = {
    from: '"Michelle" smtp.ethereal.email', // sender address
    to: email, // list of receivers
    subject: "Email Verification", // Subject line
    text: ` Your verifiedCode is: ${verifiedCode} `, // plain text body
  };

  transporter.sendMail(mailOptions, function (err, response) {
    if (err) {
    } else {
      res.status(200).json({ status: 200, messgae: "please verify email" });
    }
  });
};

export const signin = async function (req: Request, res: Response) {
  const { email, password } = req.body;
  const userRepo = getRepository(User);
  const user = await getRepository(User).findOne({ email: email });
  if (!user) {
    return res.status(401).json({ status: 401, errors: "email doesn't exist" });
  }
  if (user.verified == false) {
    return res
      .status(401)
      .json({ status: 401, errors: "please verify your email" });
  }
  const validPassword = await bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ status: 401, errors: "password incorrect" });
  }
  const payload = {
      id: user.id,
      name: user.name,
      email: user.email
  }
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
  res.status(200).json({ status: 200, data: token });
  
};