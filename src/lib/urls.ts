export function getPageNumber(url: string): number {
  const match = url.match(/page=(\d+)/);
  return match ? parseInt(match[1]) : 1;
}
