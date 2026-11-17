import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getMeetingLinkError } from './meetingLinkValidator.js'

test('accepts HTTPS meeting URLs from supported platforms', () => {
  const validLinks = [
    'https://meet.google.com/abc-defg-hij',
    'https://us04web.zoom.us/j/123456789',
    'https://teams.microsoft.com/l/meetup-join/123',
    'https://company.webex.com/meet/alex',
    'https://sub.region.webex.com/meet/alex',
  ]

  for (const link of validLinks) {
    assert.equal(getMeetingLinkError(link), null, link)
  }
})

test('rejects empty, malformed, insecure, unsupported, and lookalike URLs', () => {
  const invalidLinks = [
    '',
    '   ',
    'not a URL',
    'https:meet.google.com/abc',
    'https:////meet.google.com/abc',
    'https:///meet.google.com/abc',
    'https://meet.google.com\\@evil.example/abc',
    'http://meet.google.com/abc',
    'https://example.com/meeting',
    'https://meet.google.com.evil.example/abc',
    'https://sub.meet.google.com/abc',
    'https://zoom.us.evil.example/j/123',
    'https://webex.com.evil.example/meet/alex',
    'https://fakezoom.us/j/123',
    'https://teams.microsoft.com.evil.example/meet',
    'https://sub.teams.microsoft.com/meet',
    'https://user@meet.google.com/abc',
    'https://@meet.google.com/abc',
    'https://meet.google.com:8443/abc',
    'https://meet.google.com/%',
  ]

  for (const link of invalidLinks) {
    assert.notEqual(getMeetingLinkError(link), null, link)
  }
})
