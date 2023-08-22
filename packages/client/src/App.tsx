import { useRef, useState } from "react";

import { Footer } from "./components/Footer/Footer";
import { Main } from "./components/Main/Main";
import { MessagesContainer } from "./components/Messages/MessagesContainer";
import { PromptInput } from "./components/PromptInput/PromptInput";

function App() {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [messages, setMessages] = useState([
		{
			role: "",
			content: "",
		},
	]);
	return (
		<>
			<Main>
				<MessagesContainer inputRef={inputRef} messages={messages} />

				<PromptInput
					ref={inputRef}
					onUserSubmit={({ role, content }) => {
						setMessages((prev) => [...prev, { role, content }]);
					}}
					onAiResponse={({ role, content }) => {
						setMessages((prev) => [...prev, { role, content }]);
					}}
				/>
			</Main>
			<Footer />
		</>
	);
}

export default App;
