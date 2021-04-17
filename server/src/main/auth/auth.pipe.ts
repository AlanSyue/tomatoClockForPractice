import { body, validationResult } from "express-validator";
const myValidationResult = validationResult.withDefaults({
  formatter: error => {
    if(error.msg == "密碼需包含英文大小寫和數字，長度超過8位數"){
      return {password: error.msg}
    }
    if(error.msg == "email is required"){
      return {email: error.msg}
    }
    if(error.msg == "email format is invalid"){
      return {email: error.msg}
    }
  },
});
export const registerPipe = [
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email format is invalid"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
    .withMessage("密碼需包含英文大小寫和數字，長度超過8位數"),
  (req, res, next) => {
    const errors = validationResult(req);
    const errorArr = errors.array();
    const error = myValidationResult(req).array();
    let errorObj = {};
    errorArr.forEach((error) => {
      const { param, msg } = error;
      if (errorObj[param]) {
        return;
      }
      errorObj[param] = msg;
    });
    console.log(errorArr);
    if (!errors.isEmpty()) {
      return res.status(401).json({ status: 401, errors: error[0] });

    }
    next();
  },
];
