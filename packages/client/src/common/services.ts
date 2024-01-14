export const GRAPHQL_QUERIES = {
	GET_LOCATION: `query GetLocation($latitude: Float!, $longitude: Float!) {
    getLocationDetails(latitude: $latitude, longitude: $longitude) {
      city
      region
      regionShort
      country
      countryShort
    }
  }`,
};

/* c8 ignore start */
export const graphQLCall = async ({
	query,
	data,
}: {
	data: any;
	query: any;
}) => {
	const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query,
			variables: data,
		}),
	});
	return response;
};

export const serviceCall = async ({
	name,
	data,
	method = "POST",
}: {
	data: any;
	name: string;
	method?: string;
}) => {
	const response = await fetch(
		`${import.meta.env.VITE_SERVER_URL}/api/${name}`,
		{
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	);
	return response;
};
/* c8 ignore stop */
