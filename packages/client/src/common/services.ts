export const GRAPHQL_QUERIES = {
	GET_LOCATION: `query GetLocation($latitude: Float!, $longitude: Float!) {
    location(latitude: $latitude, longitude: $longitude) {
      city
      region
      regionShort
      country
      countryShort
    }
  }`,
	GET_CHATS: `query GetChats($userId: String!) {
		chats(user: $userId) {
			timestamp
			id
			messages {
				content
			}
		}
	}`,
	GET_CHATS_STATS: `query GetChatsStats($userId: String!) {
		chatsStats(user: $userId) {
			totalChats
			averageProcessingTimes
		}
	}`,
	GET_CHAT: `query GetChatById($id: String!) {
		chatById(id: $id) {
			model
			usage
			messages {
				content
				role
				name
				processingTime
			}
		}
	}`,
	DELETE_CHAT: `mutation DeleteChat($id: String!, $userId: String!) {
		deleteChat(id: $id, user: $userId) {
			timestamp
			id
			messages {
				content
			}
		}
	}`,
	ABOUT: `query About {
		about {
			version
			models
			plugins
		}
	}`,
};

const serverUrl =
	process.env.PUBLIC_SERVER_URL || import.meta.env.VITE_SERVER_URL;

/* c8 ignore start */
export const graphQLCall = async ({
	query,
	data,
}: {
	data: any;
	query: any;
}) => {
	const response = await fetch(`${serverUrl}/graphql`, {
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
	const response = await fetch(`${serverUrl}/api/${name}`, {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	return response;
};
/* c8 ignore stop */
