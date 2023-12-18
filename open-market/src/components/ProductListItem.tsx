import MusicPlayer from "@/components/listMusicPlayer/MusicPlayer";
import { Common } from "@/styles/common";
import { numberWithComma } from "@/utils";
import styled from "@emotion/styled";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DownloadIcon from "@mui/icons-material/Download";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
const API_KEY = import.meta.env.VITE_API_SERVER;

const theme = createTheme({
	palette: {
		primary: { main: "#FFB258" },
		secondary: { main: "#D9D9D9" },
	},
});

const ListItem = styled.li`
	width: 1140px;
	height: 64px;
	padding: 5px 30px;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
	gap: 30px;
	border-radius: 10px;
	background-color: ${Common.colors.white};

	.bookmark {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 2px;
		padding: 5px;
		background-color: transparent;
		border: none;

		span {
			position: relative;
			top: 1px;
			font-size: ${Common.font.size.sm};
		}
	}

	.download {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 2px;
		position: relative;
		top: 2px;
		padding: 5px;
		text-decoration: none;
		color: ${Common.colors.black};
		font-size: ${Common.font.size.sm};
	}

	.manageLink {
		width: 100px;
		height: 24px;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		color: ${Common.colors.black};
		text-decoration: none;
		background-color: ${Common.colors.emphasize};
		border-radius: 10px;
	}
`;

const StyledTitleSpan = styled.span`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: 30px;
	text-decoration: none;
	color: ${Common.colors.black};

	img {
		width: 42px;
		height: 42px;
		border-radius: 50%;
	}

	span {
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
`;

const StyledElementSpan = styled.span`
	width: 200px;
	height: 30px;
	padding: ${Common.space.spacingMd};
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	gap: ${Common.space.spacingMd};
	color: ${Common.colors.gray};
	background-color: ${Common.colors.gray2};
	border-radius: 10px;
`;

const StyledLink = StyledTitleSpan.withComponent(Link);

export function ProductListItem({
	product,
	bookmark,
}: {
	product: Product | OrderProduct;
	bookmark: boolean;
}) {
	return (
		<ListItem key={product?._id}>
			<StyledLink to={`/productdetail/${product._id}`}>
				<img
					src={
						"image" in product
							? (product as OrderProduct).image!.path
							: product.mainImages[0]?.path
					}
					alt={`${product.name} 사진`}
				/>
				<span title={product.name}>{product.name}</span>
			</StyledLink>
			<MusicPlayer src={product.extra?.soundFile?.path!} showable />
			{"image" in product ? (
				<a
					href={`${API_KEY}/${product?.extra?.soundFile.name}?name=${product?.extra?.soundFile.originalname}`}
					download={true}
					className="download"
				>
					<ThemeProvider theme={theme}>
						<DownloadIcon color="primary" />
					</ThemeProvider>
					다운로드
				</a>
			) : (
				<></>
			)}
			<button type="submit" className="bookmark">
				<ThemeProvider theme={theme}>
					{bookmark ? (
						<BookmarkIcon color="primary" />
					) : (
						<BookmarkBorderIcon color="secondary" />
					)}
				</ThemeProvider>
				<span>북마크</span>
			</button>
		</ListItem>
	);
}

export function UserProductListItem({ product }: { product: Product }) {
	return (
		<ListItem key={product?._id}>
			<StyledTitleSpan>
				<img src={product?.mainImages[0]?.path} alt={`${product?.name} 사진`} />
				<span title={product?.name}>{product?.name}</span>
			</StyledTitleSpan>
			<MusicPlayer src={product?.extra?.soundFile?.path!} />
			<StyledElementSpan>
				판매 개수: <span>{product?.buyQuantity}</span>
			</StyledElementSpan>
			<StyledElementSpan>
				총 수익:
				<span>
					{typeof product?.buyQuantity !== "undefined"
						? numberWithComma(product?.buyQuantity * product?.price)
						: "0"}
				</span>
			</StyledElementSpan>
			<StyledElementSpan>
				북마크 수:
				<span>{product?.bookmarks ? product?.bookmarks.length : 0}</span>
			</StyledElementSpan>
			<Link className="manageLink" to={`/productmanage/${product?._id}`}>
				상세보기
			</Link>
		</ListItem>
	);
}
