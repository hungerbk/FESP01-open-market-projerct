import { Common } from "@/styles/common";
import styled from "@emotion/styled";

interface StyleProps {
	type?: string;
}

interface InputProps {
	hash?: boolean;
	title?: boolean;
}

interface FormInputProps {
	name: string;
	label: string;
	type?: string;
	maxLength?: number;
	defaultValue?: string | number | undefined | string[];
	placeholder?: string;
	handleFn: React.ChangeEventHandler<HTMLInputElement>;
}

const FormInputWrapper = styled.div<StyleProps>`
	display: flex;
	align-items: center;
	border-radius: 10px;
	padding: ${Common.space.spacingLg} ${Common.space.spacingMd};
	height: 72px;
	flex-grow: 1;
	background-color: ${Common.colors.white};

	${(props) =>
		props.type === "number" &&
		`
    align-items: start;
    justify-content: space-between;
    height: 290px;
    width:590px;
    position: relative;
    padding: ${Common.space.spacingMd}
	`}
`;
const InputLabel = styled.label<StyleProps>`
	color: ${Common.colors.gray};
	white-space: nowrap;
	&:after {
		content: " | ";
	}

	${(props) =>
		props.type === "number" &&
		`
    &:after {
  content: "";
}
	`}
`;

const Input = styled.input<InputProps>`
	border: 0px;
	outline: none;
	width: 360px;
	height: 50px;
	font-size: 16px;
	color: ${Common.colors.black};
	background-color: ${Common.colors.white};

	&::-webkit-inner-spin-button {
		appearance: none;
		-moz-appearance: none;
		-webkit-appearance: none;
	}

	${(props) =>
		props.type === "number" &&
		`
    position: absolute; 
	  right: 0; 
	  bottom: 0; 
    width:500px;
    font-size: ${Common.font.size.xl};
    height:270px;
    text-align: end;
    padding-top: 200px;
    margin-bottom:10px;
	`}

	${(props) =>
		props.name === "title" &&
		`
		width: 900px;
	`}

	${(props) =>
		props.name === "hashTag" &&
		`
    width:600px;
    `}
`;

function FormInput({
	name,
	label,
	type = "text",
	defaultValue,
	placeholder = "",
	maxLength = 50,
	handleFn,
}: FormInputProps) {
	return (
		<FormInputWrapper type={type}>
			<InputLabel htmlFor={name} type={type}>
				{label}
			</InputLabel>
			<Input
				type={type}
				name={name}
				defaultValue={defaultValue}
				maxLength={maxLength}
				onChange={handleFn}
				id={name}
				placeholder={placeholder}
			/>
		</FormInputWrapper>
	);
}

export default FormInput;
