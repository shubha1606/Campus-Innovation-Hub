const test = require("node:test");
const assert = require("node:assert/strict");
const Project = require("../models/Project");
const ProjectApplication = require("../models/ProjectApplication");
const ProjectComment = require("../models/ProjectComment");
const ProjectUpdate = require("../models/ProjectUpdate");
const {
  createProjectApplication,
  reviewProjectApplication,
} = require("../controllers/projectApplicationController");
const { createProjectComment } = require("../controllers/projectDiscussionController");
const { createProjectUpdate } = require("../controllers/projectUpdateController");
const {
  canContributeToProject,
  canManageProject,
} = require("../utils/projectAccess");

const response = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test("project permissions separate owners, team members, admins, and other users", () => {
  const project = {
    createdBy: "owner-id",
    teamMembers: ["member-id"],
  };

  assert.equal(canManageProject(project, { _id: "owner-id", role: "student" }), true);
  assert.equal(canManageProject(project, { _id: "member-id", role: "student" }), false);
  assert.equal(canContributeToProject(project, { _id: "member-id", role: "student" }), true);
  assert.equal(canContributeToProject(project, { _id: "other-id", role: "student" }), false);
  assert.equal(canManageProject(project, { _id: "admin-id", role: "admin" }), true);
});

test("approving a join request adds the applicant to the project team", async () => {
  const originalFindProject = Project.findById;
  const originalFindApplication = ProjectApplication.findOne;
  let projectSaved = false;
  let applicationSaved = false;
  const project = {
    _id: "project-id",
    createdBy: "owner-id",
    teamMembers: [],
    async save() {
      projectSaved = true;
    },
  };
  const application = {
    _id: "application-id",
    project: "project-id",
    applicant: "student-id",
    status: "Pending",
    async save() {
      applicationSaved = true;
    },
  };
  Project.findById = async () => project;
  ProjectApplication.findOne = async () => application;

  try {
    const res = response();
    await reviewProjectApplication(
      {
        params: { projectId: "project-id", applicationId: "application-id" },
        body: { status: "Approved" },
        user: { _id: "owner-id", role: "student" },
      },
      res
    );

    assert.equal(res.statusCode, 200);
    assert.deepEqual(project.teamMembers, ["student-id"]);
    assert.equal(application.status, "Approved");
    assert.ok(application.reviewedAt instanceof Date);
    assert.equal(projectSaved, true);
    assert.equal(applicationSaved, true);
  } finally {
    Project.findById = originalFindProject;
    ProjectApplication.findOne = originalFindApplication;
  }
});

test("students can apply to group projects and project members can create milestones", async () => {
  const originalFindProject = Project.findById;
  const originalFindApplication = ProjectApplication.findOne;
  const originalCreateApplication = ProjectApplication.create;
  const originalCreateUpdate = ProjectUpdate.create;
  const project = {
    _id: "project-id",
    createdBy: "owner-id",
    teamMembers: ["member-id"],
    projectType: "Group",
  };
  Project.findById = async () => project;
  ProjectApplication.findOne = async () => null;
  let applicationData;
  let updateData;
  ProjectApplication.create = async (data) => {
    applicationData = data;
    return { ...data, status: "Pending" };
  };
  ProjectUpdate.create = async (data) => {
    updateData = data;
    return data;
  };

  try {
    const applicationRes = response();
    await createProjectApplication(
      {
        params: { projectId: "project-id" },
        body: { message: "I can help with React" },
        user: { _id: "student-id", role: "student" },
      },
      applicationRes
    );
    assert.equal(applicationRes.statusCode, 201);
    assert.equal(applicationData.project, "project-id");
    assert.equal(applicationData.applicant, "student-id");

    const updateRes = response();
    await createProjectUpdate(
      {
        params: { projectId: "project-id" },
        body: { type: "milestone", title: "Prototype", body: "Build the first demo" },
        user: { _id: "member-id", role: "student" },
      },
      updateRes
    );
    assert.equal(updateRes.statusCode, 201);
    assert.equal(updateData.type, "milestone");
    assert.equal(updateData.status, "planned");
  } finally {
    Project.findById = originalFindProject;
    ProjectApplication.findOne = originalFindApplication;
    ProjectApplication.create = originalCreateApplication;
    ProjectUpdate.create = originalCreateUpdate;
  }
});

test("students and mentors can post questions and comments", async () => {
  const originalFindProject = Project.findById;
  const originalCreateComment = ProjectComment.create;
  Project.findById = async () => ({ _id: "project-id" });
  let commentData;
  ProjectComment.create = async (data) => {
    commentData = data;
    return { ...data, populate: async () => {} };
  };

  try {
    const res = response();
    await createProjectComment(
      {
        params: { projectId: "project-id" },
        body: { kind: "question", body: "Can I contribute to the design?" },
        user: { _id: "mentor-id", role: "mentor" },
      },
      res
    );
    assert.equal(res.statusCode, 201);
    assert.equal(commentData.authorModel, "Mentor");
    assert.equal(commentData.kind, "question");
  } finally {
    Project.findById = originalFindProject;
    ProjectComment.create = originalCreateComment;
  }
});
