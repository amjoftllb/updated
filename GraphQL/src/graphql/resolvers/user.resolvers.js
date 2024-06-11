const user = require("../../models/user.models.js")

const userResolver = {
  Query: {
    getUser: async () => {
      try {
        const User = await user.findOne({ email }).select("-password");
        return User;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    registerUser: async (
      _,
      { fullName, email, password, zipcode, gender, country, phoneNumber }
    ) => {
      try {
        const existingUser = await user.findOne({ email });
console.log(existingUser);
      if (existingUser) {
        console.log(",,,,,,,,,,,,,,,,,,");
        throw new Error("User already exists with this email");
      }

      const User = new user({
        fullName,
        email,
        password,
        zipcode,
        gender,
        country,
        phoneNumber,
      });
      await User.save();
console.log("done.................");
console.log({
  fullName: User.fullName,
  email: User.email,
  password: User.password,
  zipcode: User.zipcode,
  gender: User.gender,
  country: User.country,
  phoneNumber: User.phoneNumber,
});
      return {
        fullName: User.fullName,
        email: User.email,
        password: User.password,
        zipcode: User.zipcode,
        gender: User.gender,
        country: User.country,
        phoneNumber: User.phoneNumber,
      };
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = userResolver;
