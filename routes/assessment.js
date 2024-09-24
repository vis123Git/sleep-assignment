const express = require("express");
const { start_assessment, start_answering } = require("../controllers/assessment.controller");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("Assessment");
});

router.post("/start", start_assessment);
router.post("/:assessment_id/question", start_answering);

module.exports = router;
