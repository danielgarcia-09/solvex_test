const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const formatError = require("../helpers/formatError");
const formatPwd = require("../helpers/formatPwd");
const db = require("../db/db");

let authController = {};

authController.getUserById = (req, res) => {
  const { id } = req.params;

  const user = db.prepare(`SELECT * FROM users WHERE id = ${id}`).get();

  if (!user)
    return res.status(404).json({
      error: {
        message: "User not found",
      },
    });

  return res.status(200).json({ user });
};

authController.createUser = async (req, res) => {
  const { user } = req.body;

  user.password = await formatPwd(user.password);

  try {
    const newUser = db
      .prepare(
        `INSERT INTO users 
        (name,user_name,password,email,address,telephone,role)
        values (@name,@user_name,@password,@email,@address,@telephone, @role)
    `
      )
      .run(user);

    if (!newUser || newUser.changes === 0)
      return res.status(400).json({
        error: {
          message: "Check your data format",
        },
      });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({
      error: {
        message: formatError(error.message),
      },
    });
  }
};

authController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //* Check for user
    const isUser = db.prepare(`SELECT * FROM USERS WHERE email = @email`).get({email});
    if (!isUser)
      return res.status(404).json({ error: { message: "User not found" } });

    //* Check user's password
    const isPassword = await bcryptjs.compare(password,isUser.password);
    if (!isPassword)
      return res.status(404).json({ error: { message: "Wrong password" } });

    //* Create token
    const payload = {
      user: {
        id: isUser.id,
      },
    };

    //* Sign JWT
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

authController.authUser = async(req, res) => {
    try {
        const user = db.prepare(`SELECT * FROM users WHERE id = ${req.user.id}`).get();
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: {message: 'Error'}});
    }
}

authController.editUser = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  try {
    const query = db
      .prepare(
        `UPDATE USERS SET 
            name = @name,
            user_name = @user_name, 
            password = @password,
            address = @address,
            telephone = @telephone
        WHERE id = ${id}`
      )
      .run(user);

    if (query.changes === 0)
      return res.status(400).json({
        error: {
          message: "BAD PETITION, check your data format",
        },
      });

    const updatedUser = db
      .prepare(`SELECT * FROM USERS WHERE id = ${id}`)
      .get();
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
};

authController.deleteUser = (req, res) => {
  const { id } = req.params;

  const query = db.prepare(`DELETE FROM USERS WHERE id = ${id}`);

  if (query.changes === 0)
    return res.status(404).json({
      error: {
        message: "User not found",
      },
    });

  return res.status(200).json(query);
};

module.exports = authController;