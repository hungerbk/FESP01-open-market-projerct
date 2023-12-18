import MyPageList from "@/components/MyPageList";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Section = styled.section`
	width: 1440px;
	height: 100%;
	background-color: ${Common.colors.white};
	padding: 56px;
	margin: 0 auto;
`;

const MainTitle = styled.h2`
	font-weight: ${Common.font.weight.bold};
	font-size: ${Common.font.size.xl};
	color: ${Common.colors.gray};
`;

const Article = styled.article`
	width: 1328px;
	height: 241px;
	background: ${Common.colors.gray2};
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
	margin: 20px auto;
	position: relative;
	padding: ${Common.space.spacingMd};
	padding-left: 100px;
	display: flex;
	gap: 20px;
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const PersonalInfo = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background-color: ${Common.colors.white};
	width: 979px;
	height: 95px;
	border-radius: 10px;
	padding: 6px 12px;
`;

const PersonalInfoItem = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	width: 960px;
	height: 60px;
	gap: 5px;
	div {
		display: flex;
		gap: 10px;
		& > * {
			font-size: ${Common.font.size.sm};
			font-weight: ${Common.font.weight.regular};
		}
		& > h5 {
			width: 100px;
		}
		& > p {
			color: ${Common.colors.gray};
			text-decoration: underline;
		}
	}
`;

const UserImage = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
`;

const Comment = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background-color: ${Common.colors.white};
	width: 979px;
	height: 95px;
	border-radius: 10px;
	padding: 6px 12px;
`;

const CommentInfo = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 5px;
	height: 60px;
	& > div {
		display: flex;
		& > * {
			font-size: ${Common.font.size.sm};
			font-weight: ${Common.font.weight.regular};
		}
		& > h5 {
			width: 100px;
		}
		& > p {
			color: ${Common.colors.gray};
			text-decoration: underline;
		}
	}
`;

const StyledLink = styled(Link)`
	text-decoration: none;
	position: absolute;
	right: 5px;
	bottom: 3px;
	background-color: ${Common.colors.emphasize};
	width: 83px;
	height: 18px;
	text-align: center;
	line-height: 18px;
	font-size: ${Common.font.size.sm};
	border-radius: 10px;
`;

const InfoTitle = styled.h3`
	color: ${Common.colors.gray};
	position: absolute;
	top: 10px;
	left: 10px;
`;

const Title = styled.h3`
	color: ${Common.colors.gray};
`;

const Image = styled.img`
	width: 200px;
	height: 200px;
	object-fit: cover;
`;

function MyPage() {
	const [userInfo, setUserInfo] = useState<User | null>(null);
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);
	const [userOrdersInfo, setUserOrdersInfo] = useState<Order[]>([]);

	const [bookmarkDetails, setBookmarkDetails] = useState<any[]>([]);

	const userId = localStorage.getItem("_id");
	const accessToken = localStorage.getItem("accessToken");
	const historyList = JSON.parse(
		sessionStorage.getItem("historyList") as string,
	);

	// 비로그인 상태 체크
	useRequireAuth();

	useEffect(() => {
		async function fetchUserInfo() {
			try {
				const response = await axiosInstance.get<UserResponse>(
					`/users/${userId}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setUserInfo(response.data.item);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					console.error("회원 정보 조회 실패:", error);
				} else {
					// 에러가 AxiosError가 아닌 경우
					console.error("Unexpected error:", error);
				}
			}
		}

		async function fetchUserProductsInfo() {
			try {
				const response = await axiosInstance.get<ProductListResponse>(
					`/seller/products/`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				setUserProductsInfo(response.data.item);
			} catch (error) {
				console.error("회원 정보 조회 실패:", error);
			}
		}

		async function fetchUserOrderInfo() {
			try {
				const response = await axiosInstance.get<OrderListResponse>("/orders", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setUserOrdersInfo(response.data.item);
			} catch (err) {
				console.error(err);
			}
		}

		async function fetchBookmarks() {
			try {
				const response = await axiosInstance.get(`/bookmarks`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setBookmarkDetails(response.data.item || []);
			} catch (error) {
				console.error("북마크 정보 조회 실패:", error);
			}
		}

		fetchUserInfo();
		fetchUserProductsInfo();
		fetchUserOrderInfo();
		fetchBookmarks();
	}, [accessToken]);

	if (!userInfo) {
		return <div>Loading...</div>; // 로딩 처리
	}

	const profileImageUrl = userInfo.extra?.profileImage || "public/user.svg";
	return (
		<Section>
			<Helmet>
				<title>My Page - 모두의 오디오 MODI</title>
			</Helmet>
			<MainTitle>마이페이지</MainTitle>
			<Article>
				<InfoTitle>내 정보</InfoTitle>
				<UserImage src={profileImageUrl} alt="회원 썸네일" />
				<Info>
					<PersonalInfo>
						<Title>회원정보</Title>
						<PersonalInfoItem>
							<div>
								<h5>이메일</h5>
								<p>{userInfo.email}</p>
							</div>
							<div>
								<h5>이름</h5>
								<p>{userInfo.name}</p>
							</div>
							<div>
								<h5>휴대폰 번호</h5>
								<p>{userInfo.phone}</p>
							</div>
						</PersonalInfoItem>
						<StyledLink to={`/useredit/${userId}`}>회원정보 수정</StyledLink>
					</PersonalInfo>
					<Comment>
						<Title>내가 쓴 댓글</Title>
						<CommentInfo>
							<div>
								<h5>게시글 제목</h5>
								<p>내용</p>
							</div>
							<div>
								<h5>게시글 제목</h5>
								<p>내용</p>
							</div>
							<div>
								<h5>게시글 제목</h5>
								<p>내용</p>
							</div>
						</CommentInfo>
						<StyledLink to="/">전체보기</StyledLink>
					</Comment>
				</Info>
			</Article>
			<MyPageList
				title="북마크"
				data={bookmarkDetails.length !== 0 ? bookmarkDetails.slice(0, 5) : []}
				emptyMessage="북마크가 없습니다."
				renderItem={(item) => (
					<Link to={`/productdetail/${item.product_id}`}>
						<Image src={`${item.product.image.path}`} alt="앨범아트" />
					</Link>
				)}
				linkText="전체보기"
				linkUrl="/"
			/>
			<MyPageList
				title="히스토리"
				data={historyList ? historyList.slice(0, 5) : []}
				emptyMessage="히스토리가 없습니다."
				renderItem={(item) => (
					<Link to={`/productdetail/${item._id}`}>
						<Image src={`${item.mainImages[0].path}`} alt="앨범아트" />
					</Link>
				)}
			/>
			<MyPageList
				title="구매내역"
				data={userOrdersInfo.length !== 0 ? userOrdersInfo.slice(0, 5) : []}
				emptyMessage="구매내역이 없습니다."
				renderItem={(item) => (
					<Link to={`/productdetail/${item.products[0]._id}`}>
						<Image
							src={item.products[0].image.path}
							alt={`${item.products[0].name} 사진`}
						/>
					</Link>
				)}
				linkText="전체보기"
				linkUrl="/orders"
			/>
			<MyPageList
				title="판매상품관리"
				data={userProductsInfo.length !== 0 ? userProductsInfo.slice(0, 5) : []}
				emptyMessage="판매내역이 없습니다."
				renderItem={(item) => (
					<Link to={`/productmanage/${item._id}`}>
						<Image src={`${item.mainImages[0].path}`} alt="앨범아트" />
					</Link>
				)}
				linkText="전체보기"
				linkUrl={`/user/${userId}/products`}
			/>
		</Section>
	);
}

export default MyPage;
