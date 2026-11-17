const test = require("node:test");
const assert = require("node:assert/strict");
const { getProjectMentorMatches } = require("../utils/mentorMatching");

test("ranks mentors by project requirements and student profile goals", () => {
  const mentors = [
    { name: "Goal Match", expertise: ["Web"], skills: ["Accessibility"] },
    { name: "Project Match", expertise: ["React", "Web"], skills: [] },
    { name: "No Match", expertise: ["Finance"], skills: ["Accounting"] },
  ];

  const matches = getProjectMentorMatches(
    { category: "Web", technologies: ["React"] },
    { skills: ["Accessibility"], interests: ["React"] },
    mentors
  );

  assert.deepEqual(matches.map(({ mentor }) => mentor.name), ["Project Match", "Goal Match"]);
  assert.deepEqual(matches[0].matchingProjectSkills, ["web", "react"]);
  assert.deepEqual(matches[0].matchingStudentGoals, ["react"]);
});

test("returns no recommendations when neither project nor student terms match", () => {
  assert.deepEqual(
    getProjectMentorMatches(
      { category: "Robotics", technologies: ["ROS"] },
      { skills: ["Design"], interests: ["Robotics"] },
      [{ name: "Mentor", expertise: ["Finance"], skills: ["Accounting"] }]
    ),
    []
  );
});
