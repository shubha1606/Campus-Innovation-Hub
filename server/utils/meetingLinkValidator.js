const EXACT_HOSTS = ["meet.google.com", "teams.microsoft.com"];
const SUBDOMAIN_HOSTS = ["zoom.us", "webex.com"];

function isOfficialHost(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function getMeetingLinkError(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return "Meeting link is required.";
  }

  const link = value.trim();
  if (/\s/.test(link)) {
    return "Meeting URL must not contain spaces.";
  }
  if (/%(?![0-9a-f]{2})/i.test(link)) {
    return "Meeting URL contains invalid percent encoding.";
  }
  if (!/^https:\/\//i.test(link)) {
    return "Meeting URL must start with https://.";
  }

  const authorityMatch = link.match(/^https:\/\/([^/?#]+)/i);
  if (!authorityMatch || authorityMatch[1].includes("\\")) {
    return "Enter a valid meeting URL.";
  }

  let url;
  try {
    url = new URL(link);
  } catch {
    return "Enter a valid meeting URL.";
  }

  if (url.protocol !== "https:") {
    return "Meeting URL must use HTTPS.";
  }
  const authority = authorityMatch[1];
  if (authority.includes("@") || url.username || url.password) {
    return "Meeting URL cannot contain a username or password.";
  }
  if (url.port) {
    return "Meeting URL must use the standard HTTPS port.";
  }

  const hostname = url.hostname.toLowerCase();
  const isAllowed =
    EXACT_HOSTS.includes(hostname) ||
    SUBDOMAIN_HOSTS.some((domain) =>
    isOfficialHost(hostname, domain)
  );

  if (!isAllowed) {
    return "Use a Google Meet, Zoom, Microsoft Teams, or Cisco Webex URL.";
  }

  return null;
}

module.exports = { getMeetingLinkError };
