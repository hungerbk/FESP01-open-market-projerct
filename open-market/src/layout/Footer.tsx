/** @jsxImportSource @emotion/react */
import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const FooterContainer = styled.footer`
	padding: 20px;
	background: rgba(40, 40, 44, 0.8);
	width: 100%;
	text-align: center;
	font-size: 0.8rem;
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: ${Common.colors.white};
`;

const FooterLink = styled(Link)`
	margin: 0 10px;
	color: ${Common.colors.emphasize};
	text-decoration: none;
`;

const Footer = () => {
	return (
		<FooterContainer>
			<div>© 2023 모두의 오디오 : 모디. All rights reserved.</div>
			<nav>
				<FooterLink to="/">회사 정보</FooterLink>
				<FooterLink to="/">이용 약관</FooterLink>
				<FooterLink to="/">개인정보 처리방침</FooterLink>
				<FooterLink to="/">고객 지원</FooterLink>
			</nav>
			<div>
				저장소:
				<FooterLink to="https://github.com/techitPlus-FE-team3/open_market_projerct">
					Github
				</FooterLink>
			</div>
		</FooterContainer>
	);
};

export default Footer;
