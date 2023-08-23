import { Footer } from "./components/Footer/Footer";
import { Main } from "./components/Main/Main";
import { MessagesContainer } from "./components/Messages/MessagesContainer";

function App() {
	return (
		<>
			<Main>
				<MessagesContainer />
			</Main>
			<Footer />
		</>
	);
}

export default App;
