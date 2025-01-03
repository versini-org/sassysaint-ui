export const ROLE_USER = "user";
export const ROLE_ASSISTANT = "assistant";
export const ROLE_SYSTEM = "system";
export const ROLE_INTERNAL = "internal";
export const ROLE_HIDDEN = "hidden";

export const ERROR_MESSAGE =
	"I'm having trouble right now. Please try again later.";

export const DEFAULT_AI_ENGINE = "OpenAI";
export const ENGINE_OPENAI = "OpenAI";
export const ENGINE_ANTHROPIC = "Anthropic";
export const GPT4_MAX_TOKENS = 128000;

/**
 * Regular reducer action types
 */
export const ACTION_MESSAGE = "action-message";
export const ACTION_RESET = "action-reset";
export const ACTION_MODEL = "action-model";
export const ACTION_RESTORE = "action-restore";
export const ACTION_STREAMING = "action-streaming";
export const ACTION_ENGINE = "action-engine";

/**
 * History reducer action types
 */
export const ACTION_SEARCH = "action-search";
export const ACTION_SORT = "action-sort";

/**
 * Tags reducer action types
 */
export const ACTION_TOGGLE_TAG = "action-toggle-tag";
export const ACTION_RESET_TAGS = "action-reset-tags";
export const ACTION_SET_TAGS = "action-set-tags";

export const LOCAL_STORAGE_PREFIX = "sassy-saint-";
export const LOCAL_STORAGE_CHAT_DETAILS = "details";
export const LOCAL_STORAGE_SEARCH = "search";
export const LOCAL_STORAGE_SORT = "sort";
export const LOCAL_STORAGE_LOCATION = "location";
export const LOCAL_STORAGE_ENGINE_TOGGLE = "engine-toggle";

export const STATS_SEPARATOR = "==stats==";

export const CLIENT_ID = "b44c68f0-e5b3-4a1d-a3e3-df8632b0223b";

export const INFINITE_SCROLL_THRESHOLD = 10;
export const INFINITE_SCROLL_LIMIT = 30;
