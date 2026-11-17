const test = require("node:test");
const assert = require("node:assert/strict");
const Booking = require("../models/Booking");
const { getMeetingLinkError } = require("../utils/meetingLinkValidator");

function makeBooking(overrides = {}) {
  return new Booking({
    student: "507f1f77bcf86cd799439011",
    mentor: "507f1f77bcf86cd799439012",
    date: new Date("2026-01-01T10:00:00.000Z"),
    time: "10:00",
    topic: "Mentorship session",
    meetingMode: "online",
    status: "Approved",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    ...overrides,
  });
}

test("accepts HTTPS meeting URLs from supported platforms", () => {
  const validLinks = [
    "https://meet.google.com/abc-defg-hij",
    "https://us04web.zoom.us/j/123456789",
    "https://teams.microsoft.com/l/meetup-join/123",
    "https://company.webex.com/meet/alex",
    "https://sub.region.webex.com/meet/alex",
  ];

  for (const link of validLinks) {
    assert.equal(getMeetingLinkError(link), null, link);
  }
});

test("booking validation requires a supported link for online approvals", async () => {
  await assert.doesNotReject(() => makeBooking().validate());
  await assert.doesNotReject(() =>
    makeBooking({ status: "Pending", meetingLink: undefined }).validate()
  );
  await assert.rejects(
    makeBooking({ meetingLink: "https://example.com/meeting" }).validate(),
    (error) => Boolean(error.errors.meetingLink)
  );
  await assert.rejects(
    makeBooking({ meetingLink: undefined }).validate(),
    (error) => Boolean(error.errors.meetingLink)
  );
});

test("rejects empty, malformed, insecure, unsupported, and lookalike URLs", () => {
  const invalidLinks = [
    "",
    "   ",
    "not a URL",
    "https:meet.google.com/abc",
    "https:////meet.google.com/abc",
    "https:///meet.google.com/abc",
    "https://meet.google.com\\@evil.example/abc",
    "http://meet.google.com/abc",
    "https://example.com/meeting",
    "https://meet.google.com.evil.example/abc",
    "https://sub.meet.google.com/abc",
    "https://zoom.us.evil.example/j/123",
    "https://webex.com.evil.example/meet/alex",
    "https://fakezoom.us/j/123",
    "https://teams.microsoft.com.evil.example/meet",
    "https://sub.teams.microsoft.com/meet",
    "https://user@meet.google.com/abc",
    "https://@meet.google.com/abc",
    "https://meet.google.com:8443/abc",
    "https://meet.google.com/%",
  ];

  for (const link of invalidLinks) {
    assert.notEqual(getMeetingLinkError(link), null, link);
  }
});
