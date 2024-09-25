import { Panel } from "@versini/ui-panel";

import { PROFILE_TITLE } from "../../common/strings";
import { ProfileContent } from "./ProfileContent";

export const Profile = ({
	open,
	onOpenChange,
}: {
	onOpenChange: any;
	open: boolean;
}) => {
	return (
		<Panel open={open} onOpenChange={onOpenChange} title={PROFILE_TITLE}>
			<ProfileContent />
		</Panel>
	);
};
