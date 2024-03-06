import { getSession } from 'next-auth/react';

interface FetcherGetProps {
  url: string;
  filterQuery?: string;
}

const fetcherGet = async ({ url, filterQuery }: FetcherGetProps) => {
  const session = await getSession();

  const response = await fetch(url + filterQuery, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.rsiap?.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.status + ' ' + response.statusText);
  }

  const jsonData = await response.json();
  return jsonData;
};

export default fetcherGet;
