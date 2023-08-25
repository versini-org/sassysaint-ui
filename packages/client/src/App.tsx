import { useAuth0 } from "@auth0/auth0-react";

import { isDev } from "./common/utilities";
import { Footer, Main, MessagesContainer } from "./components";

function App() {
	const { isLoading } = useAuth0();
	if (isLoading && !isDev) {
		return null;
	}
	return (
		<div className="fade">
			<Main>
				<MessagesContainer />
			</Main>
			<Footer />
		</div>
	);
}

export default App;
