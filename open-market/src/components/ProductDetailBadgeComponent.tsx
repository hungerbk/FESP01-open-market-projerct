import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import { Link, useNavigate } from "react-router-dom";

interface BadgeProps {
	isNew?: boolean;
	isBest?: boolean;
}

export const DetailBadgeContainer = styled.div`
	width: 250px;
	height: auto;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-end;
	gap: 10px;
`;

export const DetailBadge = styled.div<BadgeProps>`
	width: 100px;
	height: 40px;
	margin: 5px 0;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	gap: 5px;
	border-radius: 100px;
	background-color: ${Common.colors.white};

	& :first-of-type {
		${(props) =>
			props.isNew &&
			`color: ${Common.colors.emphasize}; position: relative; right: 2px;`}
		${(props) => props.isBest && `color: ${Common.colors.secondary}`}
	}
`;

const ProductExtraLinkContainer = styled.article`
	width: 1440px;
	height: 80px;
	margin-bottom: 50px;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	background-color: ${Common.colors.gray2};
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.3);

	div {
		width: 1160px;
		padding-right: ${Common.space.spacingMd};
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
	}
`;

const ProductExtraBadgeStyle = styled(DetailBadge)`
	width: 200px;
	height: 50px;
	text-decoration: none;
	color: ${Common.colors.black};
	box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.3);
	& :first-of-type {
		color: ${Common.colors.secondary};
		position: relative;
		top: -1px;
	}
`.withComponent("span");

const ProductExtraLink = ProductExtraBadgeStyle.withComponent(Link);

const DownloadLink = ProductExtraBadgeStyle.withComponent("a");

const BookmarkButton = styled(ProductExtraBadgeStyle)`
	border: none;
	font-size: 18px;
	& :first-of-type {
		color: ${Common.colors.emphasize};
		position: relative;
		top: -1px;
	}
`.withComponent("button");

const NoUserPurchaseButton = styled(ProductExtraBadgeStyle)`
	border: none;
	font-size: 18px;
`.withComponent("button");

function ProductDetailExtraLink({
	product,
	order,
	loggedIn,
	logState,
}: {
	product: Product | undefined;
	order: Order[] | undefined;
	loggedIn: boolean;
	logState: number | undefined;
}) {
	const navigate = useNavigate();

	function handelSignIn() {
		if (confirm("로그인 후 이용 가능합니다")) {
			navigate("/signin");
		}
	}

	return (
		<ProductExtraLinkContainer>
			<div>
				<BookmarkButton>
					<BookmarkOutlinedIcon />
					북마크
					{product?.bookmarks ? product?.bookmarks.length : 0}
				</BookmarkButton>
				{!loggedIn ? (
					<NoUserPurchaseButton type="button" onClick={handelSignIn}>
						<CheckIcon />
						구매하기
						{product?.buyQuantity ? product?.buyQuantity : 0}
					</NoUserPurchaseButton>
				) : loggedIn && logState === product?.seller_id ? (
					<ProductExtraLink to={`/productmanage/${product?._id}`}>
						<CheckIcon />
						상품 관리
					</ProductExtraLink>
				) : (loggedIn && order?.length === 0) || order === undefined ? (
					<ProductExtraLink to={`/productpurchase/${product?._id}`}>
						<CheckIcon />
						구매하기
						{product?.buyQuantity ? product?.buyQuantity : 0}
					</ProductExtraLink>
				) : (
					<DownloadLink
						href={`https://localhost/api/files/download/${product?.extra?.soundFile.name}?name=${product?.extra?.soundFile.originalname}`}
						download={true}
					>
						<DownloadIcon />
						다운로드
						{product?.buyQuantity ? product?.buyQuantity : 0}
					</DownloadLink>
				)}
			</div>
		</ProductExtraLinkContainer>
	);
}

export default ProductDetailExtraLink;
