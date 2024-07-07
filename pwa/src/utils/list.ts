export interface ListOptions {
  limit?: number;
  offset?: number;
}

export function buildListEndpoint(url: string, listOptions?: ListOptions) {
  const { limit, offset } = listOptions ?? {};
  const params = new URLSearchParams();
  if (limit) params.set('limit', limit.toString());
  if (offset) params.set('offset', offset.toString());

  return params.toString()
    ? `${url}?${params.toString()}`
    : url;
}
