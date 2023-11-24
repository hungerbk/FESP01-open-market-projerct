import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

function ProductManage() {
	return (
		<>
			<Helmet>
				<title>Management Product - 모두의 오디오 MODI</title>
			</Helmet>
			<section>
				<h2>상품 관리</h2>
				<div>
					<img src="/vite.svg" alt="앨범아트" />
					<div>
						<span>제목: 가느다란머리카락</span>
						<div>
							<span>장르: dance</span>
							<span>
								해시태그: #고요한 #정적인 #시끄러운 #행복한 #무서운 #공포
							</span>
						</div>
						<span>판매수익: 500,000,000,000,000원</span>
					</div>
				</div>
				<div>
					<span>
						설명: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
						do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
						enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
						ut aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</span>
					<span>공개여부: 공개</span>
				</div>
				<div>
					<button type="submit">삭제</button>
					<Link to="/edit/:productId">수정</Link>
				</div>
			</section>
		</>
	);
}

export default ProductManage;