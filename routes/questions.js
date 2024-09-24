const express = require("express");
const { add_question } = require("../controllers/question.controller");
const { AuthenticateApi, AuthenticateAdminApi } = require("../middlewares/authenticate");
const router = express.Router();

router.use(AuthenticateApi);
router.use(AuthenticateAdminApi);
router.post("/", add_question);

module.exports = router;
