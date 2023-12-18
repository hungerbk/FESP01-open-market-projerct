import { Common } from "@/styles/common";
import styled from "@emotion/styled";

interface SelectGenreProps {
	id: string;
	value?: string | undefined;
	handleFn: React.ChangeEventHandler<HTMLSelectElement>;
	category: CategoryCode[] | undefined;
}

const SelectGenreWrapper = styled.div`
	width: 211px;
	height: 72px;
	color: ${Common.colors.gray};
	padding: ${Common.space.spacingLg} ${Common.space.spacingMd};
	display: flex;
	align-items: center;
	border-radius: 10px;
	background-color: ${Common.colors.white};
`;

const SelectGenreLabel = styled.label`
	white-space: nowrap;
	&::after {
		content: " | ";
	}
`;

const SelectGenreOption = styled.select`
	border: none;
	padding: ${Common.space.spacingLg} 0;
	background-color: ${Common.colors.white};

	&:focus {
		outline: none;
	}
`;

function SelectGenre({ id, value, handleFn, category }: SelectGenreProps) {
	return (
		<>
			{category && value && (
				<SelectGenreWrapper>
					<SelectGenreLabel htmlFor={id}>장르</SelectGenreLabel>
					<SelectGenreOption
						name={id}
						id={id}
						defaultValue={value}
						onChange={handleFn}
					>
						<option value="none" disabled hidden>
							장르를 선택해주세요
						</option>
						{category.length > 0 ? (
							category.map((item) => (
								<option key={item.code} value={item.code}>
									{item.value}
								</option>
							))
						) : (
							<option disabled>아직 카테고리가 없습니다.</option>
						)}
					</SelectGenreOption>
				</SelectGenreWrapper>
			)}
		</>
	);
}
export default SelectGenre;
