const express = require("express");
const { start_assessment, start_answering } = require("../controllers/assessment.controller");
const { AuthenticateApi, AuthenticateAdminApi } = require("../middlewares/authenticate");
const { add_question } = require("../controllers/question.controller");
const router = express.Router();

router.use(AuthenticateApi);
/**
 * @swagger
 * /assessment-start:
 *   post:
 *     summary: Start the assessment for the user
 *     description: This endpoint starts the assessment for the logged-in user. It will fetch the questions and provide the first question for answering. If the user has already completed the assessment, it will return a success message.
 *     tags:
 *       - Assessment
 *     security:
 *       - BearerAuth: []  # For protected routes that need a token
 *     responses:
 *       200:
 *         description: Assessment started successfully, or the assessment is already completed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     assessment_id:
 *                       type: string
 *                       example: "61f9b0e2f344210021abc123"
 *                     question:
 *                       type: string
 *                       example: "61f9b0e2f344210021abc456"
 *                     question_text:
 *                       type: string
 *                       example: "How often do you sleep late?"
 *                     question_type:
 *                       type: string
 *                       example: "multiple_choice"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Never", "Sometimes", "Often", "Always"]
 *                 message:
 *                   type: string
 *                   example: "Assessment started successfully!"
 *       400:
 *         description: Error while starting assessment, such as user not found or no questions added yet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found!!"
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/assessment-start", start_assessment);

/**
 * @swagger
 * /answer-assessment/{assessment_id}/question:
 *   post:
 *     summary: Submit an answer to a question in the assessment
 *     description: Submit the answer for a specific question during the assessment. The system will check if the question has already been answered, and if not, it will save the answer. It also handles completing the assessment and providing a score and recommendations once all questions are answered.
 *     tags:
 *       - Assessment
 *     security:
 *       - BearerAuth: []  # Use this if you need a token to access this route
 *     parameters:
 *       - in: path
 *         name: assessment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assessment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: string
 *                 description: The ID of the question being answered
 *                 example: "61f9b0e2f344210021abc123"
 *               answer:
 *                 type: string
 *                 description: The answer to the question
 *                 example: "Often"
 *     responses:
 *       200:
 *         description: Answer submitted successfully or assessment completed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Assessment completed successfully!"
 *                 score:
 *                   type: number
 *                   description: The user's score after completing the assessment.
 *                   example: 85
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Sleep earlier", "Reduce screen time before bed"]
 *                 data:
 *                   type: object
 *                   properties:
 *                     assessment_id:
 *                       type: string
 *                       example: "61f9b0e2f344210021abc123"
 *                     next_question:
 *                       type: string
 *                       description: The ID of the next question (if available)
 *                       example: "61f9b0e2f344210021abc124"
 *                     question_text:
 *                       type: string
 *                       example: "How often do you have trouble falling asleep?"
 *                     question_type:
 *                       type: string
 *                       example: "multiple_choice"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Never", "Sometimes", "Often", "Always"]
 *       400:
 *         description: Error submitting the answer, such as missing assessment or question ID, or answer already submitted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Assessment ID is required!"
 */
router.post("/answer-assessment/:assessment_id/question", start_answering);

router.use(AuthenticateAdminApi);
router.post("/question", add_question);
module.exports = router;
