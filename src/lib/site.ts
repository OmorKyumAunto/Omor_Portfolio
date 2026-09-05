import { portfolio } from "@/data/portfolio";

export const siteUrl = portfolio.seo.siteUrl;

/** Social links with an actual URL configured. Everything else is hidden. */
export const activeSocials = portfolio.socials.filter((s) => s.url.trim().length > 0);

export const hasEmail = portfolio.personal.email.trim().length > 0;

const EMAIL_SUBJECT = "Project inquiry — Portfolio";

/**
 * `mailto:` is the correct semantic link, but it only does anything when the
 * device has a mail client registered as the handler. On desktop browsers
 * where webmail is used instead, clicking it is silently a no-op — so the UI
 * always offers a webmail compose link and a copy action alongside it.
 */
export const mailtoHref = hasEmail
  ? `mailto:${portfolio.personal.email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`
  : "";

/** Opens a pre-filled compose window in the browser, no mail client needed. */
export const webmailComposeHref = hasEmail
  ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      portfolio.personal.email,
    )}&su=${encodeURIComponent(EMAIL_SUBJECT)}`
  : "";

