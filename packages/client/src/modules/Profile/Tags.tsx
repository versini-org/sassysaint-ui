import { Card, Panel } from "@versini/ui-components";
import { Toggle } from "@versini/ui-form";

import { useLocalStorage } from "@versini/ui-hooks";
import {
	LOCAL_STORAGE_PREFIX,
	LOCAL_STORAGE_TAG_PROOFREAD,
	LOCAL_STORAGE_TAG_REPHRASE,
	LOCAL_STORAGE_TAG_SUMMARIZE,
	TAGS,
	TAG_CONTENT,
} from "../../common/constants";
import { CARDS } from "../../common/strings";

export const TagsPanel = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	const [showSummarizeArticle, setShowSummarizeArticle] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_TAG_SUMMARIZE,
		initialValue: false,
	});
	const [showProofreadContent, setShowProofreadContent] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_TAG_PROOFREAD,
		initialValue: false,
	});
	const [showRephraseContent, setShowRephraseContent] = useLocalStorage({
		key: LOCAL_STORAGE_PREFIX + LOCAL_STORAGE_TAG_REPHRASE,
		initialValue: false,
	});

	const onToggleSummarizeArticle = (checked: boolean) => {
		setShowSummarizeArticle(checked);
	};
	const onToggleProofreadContent = (checked: boolean) => {
		setShowProofreadContent(checked);
	};
	const onToggleRephraseContent = (checked: boolean) => {
		setShowRephraseContent(checked);
	};

	return (
		<Panel open={open} onOpenChange={onOpenChange} title={"Tags"}>
			<Card header={CARDS.TAGS.TITLE} className="prose-dark dark:prose-lighter">
				<p>{CARDS.TAGS.DESCRIPTION}</p>
				<Toggle
					noBorder
					label={TAG_CONTENT[TAGS.SUMMARIZE_ARTICLE].label}
					name={LOCAL_STORAGE_TAG_SUMMARIZE}
					onChange={onToggleSummarizeArticle}
					checked={showSummarizeArticle}
				/>
				<Toggle
					spacing={{ t: 2 }}
					noBorder
					label={TAG_CONTENT[TAGS.PROOFREAD_CONTENT].label}
					name={LOCAL_STORAGE_TAG_PROOFREAD}
					onChange={onToggleProofreadContent}
					checked={showProofreadContent}
				/>
				<Toggle
					spacing={{ t: 2 }}
					noBorder
					label={TAG_CONTENT[TAGS.REPHRASE_CONTENT].label}
					name={LOCAL_STORAGE_TAG_REPHRASE}
					onChange={onToggleRephraseContent}
					checked={showRephraseContent}
				/>
			</Card>
		</Panel>
	);
};
