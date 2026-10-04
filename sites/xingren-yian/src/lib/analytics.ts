const reportUrl = 'https://xingrenyian.com/api/omega/report';

export function reportRequirementSummary(content: string): void {
  // Best-effort reporting must not block the local summary or retry into duplicate events.
  void fetch(reportUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    keepalive: true,
    body: JSON.stringify({
      name: 'xingrenyian_website_submit_ck',
      attr: { content },
    }),
  }).catch(() => {
    // Network failures leave the user's summary and contact actions available.
  });
}
