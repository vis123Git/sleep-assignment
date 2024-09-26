const { find_user_by_id } = require("../services/user.services");
const { save_new_assessment, find_one_assessment } = require("../services/assessment.services");
const { find_all_questions, find_question_by_id, find_one_question } = require("../services/questions.services");
const { generate_recommendations } = require("../helpers/recommendations");
const { calculate_score } = require("../helpers/score");

exports.start_assessment = async function (req, res) {
  try {
    const { user_id } = req.tokenData;
    const user_exists = await find_user_by_id(user_id);
    if (!user_exists) return res.status(400).json({ status: false, message: "User not found!!" });

    let new_assessment = await find_one_assessment({ user_id });
    if (new_assessment && new_assessment.is_completed) return res.status(200).json({ status: true, message: "Great! You have already submitted assessment of your sleeping schedule!" });
    
    if (!new_assessment) {
      new_assessment = await save_new_assessment({ user_id });
      if (!new_assessment) return res.status(400).json({ status: false, message: "Assessment failed!" });
    }

    const find_ques = await find_all_questions();
    if (!find_ques || !find_ques?.length) return res.status(400).json({ status: false, message: "Question not added yet!" });

    const first_que = find_ques[0];

    const data = {
      assessment_id: new_assessment._id,
      question: first_que._id,
      question_text: first_que.text,
      question_type: first_que.type,
      options: first_que.options,
    };
    return res.status(200).json({ status: true, data: data, message: "Assessment started successfull!" });
  } catch (error) {
    console.log("error===", error);
    return res.status(400).json({ status: false, message: "Something went wrong!" });
  }
};


exports.start_answering = async function (req, res) {
  try {
    const { user_id } = req.tokenData;
    const { assessment_id } = req.params;
    const { answer, question_id } = req.body;

    if (!assessment_id)
      return res.status(400).json({ status: false, message: "Assessment id is required!" });
    if (!question_id)
      return res.status(400).json({ status: false, message: "Question id is required!" });
    if (!answer?.trim())
      return res.status(400).json({ status: false, message: "Answer is required!" });

    const assessment_exists = await find_one_assessment({ _id: assessment_id });
    if (!assessment_exists)
      return res.status(400).json({ status: false, message: "Assessment not found!" });

    if (assessment_exists.is_completed)
      return res.status(200).json({ status: true, message: "Great! You have already submitted assessment of your sleeping schedule!" });
    
    const question_exists = await find_question_by_id(question_id);
    if (!question_exists)
      return res.status(400).json({ status: false, message: "Question not found!" });

    // Check if an answer for this question already exists
    const existingAnswerIndex = assessment_exists.answers.findIndex(
      (a) => a.question.toString() === question_id.toString()
    );

    if (existingAnswerIndex !== -1) {
      // Update existing answer
      assessment_exists.answers[existingAnswerIndex].answer = answer;
    } else {
      // Add new answer
      assessment_exists.answers.push({
        question: question_id,
        answer: answer,
      });
    }

    await assessment_exists.save();

    // Check if the user has completed all the questions
    const next_question = await find_one_question({ order: question_exists.order + 1 });
    if (!next_question) {
      // All questions answered, calculate score
      const score = await calculate_score(assessment_id);
      const recommendations = generate_recommendations(score);

      // Update assessment with score and recommendations
      assessment_exists.score = score;
      assessment_exists.completedAt = new Date();
      assessment_exists.is_completed = true;

      assessment_exists.recommendations = recommendations;

      await assessment_exists.save();

      return res.status(200).json({
        status: true,
        message: "Assessment completed successfully!",
        score: score,
        recommendations: recommendations,
      });
    }

    const data = {
      assessment_id: assessment_exists._id,
      next_question: next_question._id,
      question_text: next_question.text,
      question_type: next_question.type,
      options: next_question.options,
    };

    return res.status(200).json({
      status: true,
      data: data,
      message: "Please select the next question!",
    });
  } catch (error) {
    console.log("error===", error);
    return res.status(400).json({ status: false, message: "Something went wrong!" });
  }
};

