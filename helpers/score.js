const Assessment = require("../models/assessment.model");


async function calculateScore(assessmentId) {
  const assessment = await Assessment.findById(assessmentId).populate('answers.question');
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (let answer of assessment.answers) {
    const question = answer.question;
    let answerScore = 0;

    switch (question.type) {
      case 'multiple-choice':
      case 'boolean':
      case 'scale':
        answerScore = question.scoring.get(answer.answer) || 0;
        maxPossibleScore += Math.max(...question.scoring.values());
        break;
      case 'checkbox':
        for (let option of answer.answer) {
          answerScore += question.scoring.get(option) || 0;
        }
        maxPossibleScore += 0; // No points deducted for not selecting any option
        break;
      case 'numeric':
        if (question.text.includes('hours of sleep')) {
          answerScore = calculateSleepHoursScore(answer.answer);
          maxPossibleScore += 3; // Max score for ideal sleep duration
        }
        break;
      // Add more cases for other question types as needed
    }

    answer.score = answerScore;
    totalScore += answerScore;
  }

  // Calculate percentage score
  const percentageScore = (totalScore / maxPossibleScore) * 100;

  // Update assessment with scores
  assessment.score = Math.round(percentageScore);
  await assessment.save();

  return assessment.score;
}

function calculateSleepHoursScore(hours) {
  if (hours >= 7 && hours <= 9) return 3; // Ideal sleep duration
  if (hours >= 6 && hours < 7) return 2; // Slightly less than ideal
  if (hours > 9 && hours <= 10) return 2; // Slightly more than ideal
  if (hours >= 5 && hours < 6) return 1; // Too little sleep
  if (hours > 10) return 1; // Too much sleep
  return 0; // Less than 5 hours or more than 11 hours
}

module.exports = { calculateScore };