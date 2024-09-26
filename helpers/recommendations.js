exports.generate_recommendations = (score) => {
  if (score < 50) {
    return ["Establish a consistent sleep schedule", "Create a relaxing bedtime routine", "Limit screen time before bed"];
  } else if (score < 80) {
    return ["Optimize your sleep environment", "Consider relaxation techniques before bed"];
  } else {
    return ["Maintain your good sleep habits", "Monitor your caffeine intake"];
  }
};
