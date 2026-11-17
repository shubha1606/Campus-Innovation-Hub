const normalizeTerm = (value) => String(value || "").trim().toLowerCase();

function getProjectMentorMatches(project, student, mentors) {
  const projectTerms = [...new Set(
    [project.category, ...(project.technologies || [])]
      .map(normalizeTerm)
      .filter(Boolean)
  )];
  const studentGoals = [...new Set(
    [...(student.skills || []), ...(student.interests || [])]
      .map(normalizeTerm)
      .filter(Boolean)
  )];

  return mentors.map((mentor) => {
    const mentorTerms = new Set(
      [...(mentor.expertise || []), ...(mentor.skills || [])]
        .map(normalizeTerm)
        .filter(Boolean)
    );
    const matchingProjectSkills = projectTerms.filter((term) => mentorTerms.has(term));
    const matchingStudentGoals = studentGoals.filter((term) => mentorTerms.has(term));
    return {
      mentor,
      score: matchingProjectSkills.length * 2 + matchingStudentGoals.length,
      matchingProjectSkills,
      matchingStudentGoals,
    };
  }).filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.mentor.name.localeCompare(b.mentor.name))
    .slice(0, 6);
}

module.exports = { getProjectMentorMatches };
