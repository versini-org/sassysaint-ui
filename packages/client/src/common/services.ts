export const GRAPHQL_QUERIES = {
	GET_LOCATION: `query GetLocation($latitude: Float!, $longitude: Float!) {
    location(latitude: $latitude, longitude: $longitude) {
    	country
			state
			city
			displayName
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
	ABOUT: `query About($user: String!) {
		about(user: $user) {
			version
			models
			plugins
			engine
			engines
			tags {
				enabled
				slot
				label
				content
			}
		}
	}`,
	GET_USER_PREFERENCES: `query GetUserPreferences($user: String!) {
		getUserPreferences(user: $user) {
			instructions
			location
			engine
			tags {
				enabled
				slot
				label
				content
			}
		}
	}`,
	SET_USER_PREFERENCES: `mutation SetUserPreferences(
		$user: String!,
		$instructions: String,
		$location: String,
		$engine: String,
		$tags: [TagIn]) {
			setUserPreferences(
			user: $user,
			instructions: $instructions,
			location: $location,
			engine: $engine,
			tags: $tags)
	}`,
};

export const SERVICE_TYPES = {
	GET_LOCATION: {
		schema: GRAPHQL_QUERIES.GET_LOCATION,
		method: "location",
	},
	GET_CHATS: {
		schema: GRAPHQL_QUERIES.GET_CHATS,
		method: "chats",
	},
	GET_CHATS_STATS: {
		schema: GRAPHQL_QUERIES.GET_CHATS_STATS,
		method: "chatsStats",
	},
	GET_CHAT: {
		schema: GRAPHQL_QUERIES.GET_CHAT,
		method: "chatById",
	},
	DELETE_CHAT: {
		schema: GRAPHQL_QUERIES.DELETE_CHAT,
		method: "deleteChat",
	},
	ABOUT: {
		schema: GRAPHQL_QUERIES.ABOUT,
		method: "about",
	},
	GET_USER_PREFERENCES: {
		schema: GRAPHQL_QUERIES.GET_USER_PREFERENCES,
		method: "getUserPreferences",
	},
	SET_USER_PREFERENCES: {
		schema: GRAPHQL_QUERIES.SET_USER_PREFERENCES,
		method: "setUserPreferences",
	},
};

const serverUrl = process.env.PUBLIC_SASSY_API_SERVER_URL;

const graphQLCall = async ({
	query,
	data,
	headers = {},
}: {
	data: any;
	query: any;
	headers?: any;
}) => {
	const response = await fetch(`${serverUrl}/graphql`, {
		method: "POST",
		credentials: "include",
		headers: {
			...headers,
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
	accessToken,
	type,
	params = {},
}: {
	accessToken: string;
	type: any;
	params?: any;
}) => {
	const requestData = type?.data ? type.data(params) : params;
	try {
		const authorization = `Bearer ${accessToken}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: type.schema,
			data: requestData,
		});

		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data, errors } = await response.json();
		return {
			status: response.status,
			data: data[type.method],
			errors,
		};
	} catch (_error) {
		console.error(_error);
		return { status: 500, data: [] };
	}
};

/* c8 ignore start */
export const restCall = async ({
	accessToken,
	name,
	data,
	method = "POST",
}: {
	accessToken: string;
	data: any;
	name: string;
	method?: string;
}) => {
	const authorization = `Bearer ${accessToken}`;
	const response = await fetch(`${serverUrl}/api/${name}`, {
		method,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			authorization,
		},
		body: JSON.stringify(data),
	});
	return response;
};
/* c8 ignore stop */
