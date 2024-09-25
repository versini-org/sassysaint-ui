import { Button } from "@versini/ui-button";
import { Panel } from "@versini/ui-panel";
import { Flexgrid, FlexgridItem } from "@versini/ui-system";

export const ConfirmationPanel = ({
	showConfirmation,
	setShowConfirmation,
	action,
	children,
	customStrings,
}: {
	action: () => void;
	children: React.ReactNode;
	setShowConfirmation: (show: boolean) => void;
	showConfirmation: boolean;
	customStrings: {
		title: string;
		cancelAction: string;
		confirmAction: string;
	};
}) => {
	return (
		<Panel
			kind="messagebox"
			open={showConfirmation}
			onOpenChange={setShowConfirmation}
			title={customStrings.title}
			footer={
				<Flexgrid columnGap={2} alignHorizontal="flex-end">
					<FlexgridItem>
						<Button
							mode="dark"
							variant="secondary"
							focusMode="light"
							onClick={() => {
								setShowConfirmation(false);
							}}
						>
							{customStrings.cancelAction}
						</Button>
					</FlexgridItem>
					<FlexgridItem>
						<Button
							mode="dark"
							variant="danger"
							focusMode="light"
							onClick={() => {
								setShowConfirmation(false);
								action();
							}}
						>
							{customStrings.confirmAction}
						</Button>
					</FlexgridItem>
				</Flexgrid>
			}
		>
			{children}
		</Panel>
	);
};
