import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Article = styled.article`
	width: 1328px;
	height: 241px;
	background: ${Common.colors.gray2};
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	margin: 20px auto;
	position: relative;
	padding: ${Common.space.spacingMd};
`;

const Title = styled.h3`
	color: ${Common.colors.gray};
`;

const List = styled.ul`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ListItem = styled.li`
	margin-right: 16px;
`;

const StyledLink = styled(Link)`
	text-decoration: none;
	position: absolute;
	right: 5px;
	bottom: 3px;
	background-color: ${Common.colors.emphasize};
	width: 100px;
	height: 24px;
	text-align: center;
	line-height: 24px;
	border-radius: 10px;
`;

interface MyPageListProps {
	title: string;
	data: any[];
	renderItem: (item: any) => JSX.Element;
	emptyMessage?: string;
	linkText?: string;
	linkUrl?: string;
}

const MyPageList = ({
	title,
	data,
	renderItem,
	emptyMessage,
	linkText,
	linkUrl,
}: MyPageListProps) => {
	// 한글 title을 영어 key 접두사로 변환하는 함수
	const convertTitleToKeyPrefix = (title: string) => {
		switch (title) {
			case "북마크":
				return "bookmark";
			case "히스토리":
				return "history";
			case "구매내역":
				return "purchase-history";
			case "판매상품관리":
				return "product-management";
			default:
				return "section"; // 기본값
		}
	};

	// Key를 생성하는 함수
	const generateKey = (title: string, id: number | string) => {
		const keyPrefix = convertTitleToKeyPrefix(title);
		return `${keyPrefix}-${id}`;
	};

	return (
		<Article>
			<Title>{title}</Title>
			<List>
				{data.length !== 0 ? (
					data.map((item) => (
						<ListItem key={generateKey(title, item._id)}>
							{renderItem(item)}
						</ListItem>
					))
				) : (
					<span>{emptyMessage}</span>
				)}
			</List>
			{linkText && linkUrl && <StyledLink to={linkUrl}>{linkText}</StyledLink>}
		</Article>
	);
};

export default MyPageList;
