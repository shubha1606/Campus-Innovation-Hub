function getUserId(user) {
  return (user?._id || user?.id)?.toString();
}

function isProjectOwner(project, user) {
  return project.createdBy.toString() === getUserId(user);
}

function isProjectMember(project, user) {
  const userId = getUserId(user);
  return project.teamMembers.some((member) => member.toString() === userId);
}

function canManageProject(project, user) {
  return user?.role === "admin" || isProjectOwner(project, user);
}

function canContributeToProject(project, user) {
  return canManageProject(project, user) || isProjectMember(project, user);
}

module.exports = {
  canContributeToProject,
  canManageProject,
  getUserId,
  isProjectMember,
  isProjectOwner,
};
