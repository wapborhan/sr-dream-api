const router = require("express").Router();

const {
  getAllUsers,
  createUsers,
  getSingleUser,
  editSingleUser,
} = require("../controllers/users");

const verifyToken = require("../middlewares/auth");

// Public routes
router.route("/").get(getAllUsers).post(createUsers);

// User-specific routes
// router.route("/:username").get(getSingleUser).put(verifyToken, editSingleUser);
router.route("/:username").get(getSingleUser).put(editSingleUser);

module.exports = router;
