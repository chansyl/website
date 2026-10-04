export const reportUrl = 'https://xingrenyian.com/api/omega/report';

// Keep local and CI browser checks from producing real business analytics.
export async function mockOmegaReports(context) {
  const reports = [];
  await context.route(reportUrl, async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      reports.push({ method: request.method(), body: request.postDataJSON() });
    }
    await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } });
  });
  return reports;
}
