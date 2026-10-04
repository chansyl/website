export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const asset = (path: string) => `${basePath}/${path.replace(/^\//, '')}`;
const prefix = basePath ? basePath.slice(0, basePath.lastIndexOf('/')) : '';
export const agency = (path = 'examples/') =>
  basePath ? `${prefix}/xingren-yian/${path}` : `http://127.0.0.1:3000/${path}`;
