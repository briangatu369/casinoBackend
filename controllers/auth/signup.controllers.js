const Joi = require("joi");
const { generateJwt } = require("../../utils/generateJwt");
const hashPassword = require("../../utils/hashPassword");
const CustomError = require("../../utils/customErrors");
const User = require("../../models/User.model");

//registration schema
const registerValidationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const { error } = registerValidationSchema.validate(req.body);
  const validationError = error?.details[0]?.message;

  // input validation error
  if (error) {
    throw new CustomError(400, validationError);
  }

  const user = await User.findOne({ $and: [{ username }, { email }] });

  if (user) {
    throw new CustomError(409, "User already exist");
  }

  const hashedPassword = hashPassword(password);
  const newUser = new User({ username, email, password: hashedPassword });

  const { password: p, ...rest } = newUser._doc;
  const secretkey = process.env.JWTSECRET;
  const accessToken = generateJwt(rest, secretkey, { expiresIn: "1h" });

  await newUser.save();

  res
    .cookie("accessToken", accessToken, { httpOnly: true })
    .status(200)
    .json(rest);
};

module.exports = signup;
