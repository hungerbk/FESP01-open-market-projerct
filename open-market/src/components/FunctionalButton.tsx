import { Common } from "@/styles/common";
import styled from "@emotion/styled";

interface ButtonProps {
	secondary?: boolean;
}

interface FunctionalButtonProps {
	secondary?: boolean;
	type?: "button" | "submit" | "reset" | undefined;
	handleFn: React.MouseEventHandler<HTMLButtonElement>;
	text: string;
}

const Button = styled.button<ButtonProps>`
	border: 0px;
	color: ${Common.colors.white};
	width: 200px;
	height: 80px;
	border-radius: 10px;
	font-size: ${Common.font.size.xl};
	background-color: ${(props) =>
		props.secondary
			? `${Common.colors.secondary}`
			: `${Common.colors.emphasize}`};
`;

function FunctionalButton({
	secondary = false, // 기본값을 false로 설정
	type = "button",
	handleFn,
	text,
}: FunctionalButtonProps) {
	return (
		<Button secondary={secondary} type={type} onClick={handleFn}>
			{text}
		</Button>
	);
}

export default FunctionalButton;
