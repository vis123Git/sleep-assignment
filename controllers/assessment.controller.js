const { find_user_by_id } = require("../services/user.services");
const { save_new_assessment, find_one_assessment } = require("../services/assessment.services");
const { find_all_questions, find_question_by_id, find_one_question } = require("../services/questions.services");

exports.start_assessment = async function (req, res) {
  try {
    const { user_id } = req.tokenData;
    const user_exists = await find_user_by_id(user_id);
    if (!user_exists) return res.status(400).json({ status: false, message: "User not found!!" });

    let new_assessment = await find_one_assessment({ user_id });
    if (!new_assessment) {
      new_assessment = await save_new_assessment({ user_id });
      if (!new_assessment) return res.status(400).json({ status: false, message: "Assessment failed!" });
    }

    const find_ques = await find_all_questions();
    if (!find_ques || !find_ques?.length) return res.status(400).json({ status: false, message: "Question not added yet!" });

    const first_que = find_ques[0];

    const data = {
      assessment_id: new_assessment._id,
      next_question: first_que._id,
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

    if (!assessment_id) return res.status(400).json({ status: false, message: "Assessment id is required!" });
    if (!question_id) return res.status(400).json({ status: false, message: "Question id is required!" });
    if (!answer?.trim()) return res.status(400).json({ status: false, message: "Assessment id is required!" });

    const assessment_exists = await find_one_assessment(assessment_id);
    if (!assessment_exists) return res.status(400).json({ status: false, message: "Assessment not found!!" });

    const question_exists = await find_question_by_id(question_id);
    if (!question_exists) return res.status(400).json({ status: false, message: "Question not found!!" });

    assessment_exists.answers.push({
      question: question_id,
      answer: answer,
    });
    await assessment_exists.save();

    const next_question = await find_one_question({ order: question_exists.order + 1 });
    if (!next_question) {
      return res.status(200).json({ status: true, message: "Analyzed results!" });
    }

    const data = {
      assessment_id: assessment_exists._id,
      next_question: next_question._id,
      question_text: next_question.text,
      question_type: next_question.type,
      options: next_question.options,
    };
    return res.status(200).json({ status: false, data: data, message: "Please select next question!!" });
  } catch (error) {
    console.log("error===", error);
    return res.status(400).json({ status: false, message: "Something went wrong!" });
  }
};
