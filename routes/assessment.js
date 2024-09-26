const express = require("express");
const { start_assessment, start_answering } = require("../controllers/assessment.controller");
const { AuthenticateApi } = require("../middlewares/authenticate");
const router = express.Router();

router.use(AuthenticateApi);

router.post("/start", start_assessment);
router.post("/:assessment_id/question", start_answering);

module.exports = router;
