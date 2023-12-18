import { Common } from "@/styles/common";
import styled from "@emotion/styled";

// Props 인터페이스 정의
interface AuthInputProps {
	id: string;
	name: string;
	label?: string;
	type: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	defaultValue?: string;
	placeholder?: string;
	required?: boolean;
	readonly?: boolean;
}

const AuthInputWrppaer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
`;

const Label = styled.label`
	${Common.a11yHidden};
`;

const Input = styled.input`
	box-sizing: border-box;

	width: 100%;
	height: 56px;
	font-size: 18px;
	font-weight: 500;
	padding: 0 20px;
	background-color: ${Common.colors.gray2};
	border: 1px solid ${Common.colors.gray};
	border-radius: 10px;
	&::placeholder {
		color: ${Common.colors.black};
		font-size: 18px;
		font-weight: 500;
	}
	&:focus {
		outline: 0;
	}
`;

function AuthInput(props: AuthInputProps) {
	const {
		id,
		name,
		label,
		type,
		defaultValue,
		onChange,
		placeholder,
		required,
		readonly,
	} = props;
	return (
		<AuthInputWrppaer>
			{label && <Label htmlFor={id}>{label}</Label>}
			<Input
				type={type}
				id={id}
				name={name}
				defaultValue={defaultValue}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				readOnly={readonly}
			/>
		</AuthInputWrppaer>
	);
}

export default AuthInput;
