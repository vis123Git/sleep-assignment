const Assessment = require("../models/assessment.model");

async function calculate_score(assessmentId) {
  const assessment = await Assessment.findById(assessmentId).populate("answers.question");
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (let answer of assessment.answers) {
    const question = answer.question;
    let answerScore = 0;

    switch (question.type) {
      case "multiple-choice":
      case "boolean":
      case "scale":
        // Use Map's get method to retrieve the score
        answerScore = question.scoring.get(answer.answer) || 0;
        maxPossibleScore += Math.max(...Array.from(question.scoring.values())); // Get max possible score from Map values
        break;
      case "checkbox":
        for (let option of answer.answer) {
          answerScore += question.scoring.get(option) || 0; // Default to 0 for undefined scoring
        }
        // Max possible score should be based on the worst-case scenario (sum of all negative scores)
        maxPossibleScore += Math.abs(Math.min(...Array.from(question.scoring.values())) * question.options.length);
        break;
      case "numeric":
        if (question.text.toLowerCase().includes("hours of sleep")) {
          answerScore = calculateSleepHoursScore(answer.answer, question.scoring);
          maxPossibleScore += Math.max(...Array.from(question.scoring.values()));
        }
        break;
      default:
        answerScore = 0; // Ensure unknown types do not throw errors
        break;
    }

    // Ensure that answerScore is a valid number, otherwise set to 0
    if (isNaN(answerScore)) answerScore = 0;

    answer.score = answerScore;
    totalScore += answerScore;
  }

  // Ensure maxPossibleScore is not zero to avoid division by zero
  if (maxPossibleScore === 0) {
    maxPossibleScore = 1; // Avoid division by zero in percentage calculation
  }

  // Calculate percentage score
  const percentageScore = (totalScore / maxPossibleScore) * 100;

  // Update assessment with scores
  assessment.score = Math.round(percentageScore);
  assessment.completedAt = Date.now();
  await assessment.save();

  return assessment.score;
}

function calculateSleepHoursScore(hours, scoring) {
  for (let [range, score] of scoring) {
    let [min, max] = range.split('-').map(Number);
    if (hours >= min && hours <= max) {
      return score;
    }
  }
  return 0; // Default score if no range matches
}

module.exports = { calculate_score };
