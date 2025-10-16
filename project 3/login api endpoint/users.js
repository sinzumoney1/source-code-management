const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    username: "testuser",
    password: bcrypt.hashSync("password123", 10), // hashed password
  },
];

module.exports = users;
