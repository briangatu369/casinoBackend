const Joi = require("joi");
const { generateJwt } = require("../../utils/generateJwt");
const bcrypt = require("bcrypt");
const CustomError = require("../../utils/customErrors");
const User = require("../../models/User.model");

const loginValidationSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = loginValidationSchema.validate(req.body);

  if (error) {
    throw new CustomError(400, "Please provide all required fields");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return CustomError(404, "user does not exist");
  }

  const hashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordValid) {
    CustomError(404, "wrong password");
  }

  const { password: p, betList, ...rest } = user._doc;
  const secretkey = process.env.JWTSECRET;
  const accessToken = generateJwt(rest, secretkey, { expiresIn: "30d" });
  res.cookie("accessToken", accessToken, { httpOnly: true }).json(rest);
};

module.exports = { signin };
