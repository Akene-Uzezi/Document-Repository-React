const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.get("/dashboard", adminController.getDashboard);

router.get("/new-user", adminController.getCreateUser);

router.post("/new-user", adminController.createUser);

router.get("/update/:id", adminController.getUpdateUser);

router.post("/update/:id", adminController.updateUser);

router.get("/reset/:id", adminController.getResetUser);

router.post("/reset/:id", adminController.resetPassword);

router.get("/suspend/:id", adminController.suspendUser);

router.get("/restore/:id", adminController.restoreUser);

module.exports = router;
