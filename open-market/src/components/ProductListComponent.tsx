import { Common } from "@/styles/common";
import styled from "@emotion/styled";


interface HeightProps {
	height: string;
}

export const Heading = styled.h2`
	display: ${Common.a11yHidden};
`;

export const ProductSection = styled.section`
	width: 1160px;
	margin: 0 auto;
	padding: ${Common.space.spacingLg};
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: flex-end;
	gap: ${Common.space.spacingMd};
`;

export const ProductContainer = styled.div<HeightProps>`
	width: 1160px;
	min-height: ${(props) => props.height};
	padding: ${Common.space.spacingLg} 0 5px 0;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: space-between;
	background-color: ${Common.colors.gray2};
	border-radius: 10px;
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.3);

	span.emptyList {
		padding-top: 40px;
		font-weight: ${Common.font.weight.regular};
	}

	.moreButton {
		width: 100px;
		height: 40px;
		position: relative;
		background-color: transparent;
		border: none;
		font-weight: ${Common.font.weight.regular};

		&::after {
			content: "";
			position: absolute;
			top: 50%;
			transform: translateY(-30%);
			right: 12px;
			border-bottom: solid 8px transparent;
			border-top: solid 8px black;
			border-left: solid 8px transparent;
			border-right: solid 8px transparent;
		}
	}
`;

export const ProductList = styled.ul`
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	gap: ${Common.space.spacingLg};
`;
