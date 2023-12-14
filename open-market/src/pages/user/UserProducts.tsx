import { FilterButton } from "@/components/FilterComponent";
import SearchBar from "@/components/SearchBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	axiosInstance,
	getItemWithExpireTime,
	numberWithComma,
	searchProductList,
	setItemWithExpireTime,
} from "@/utils";
import styled from "@emotion/styled";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const FilterContainer = styled("div")`
	margin: 10px;
	display: flex;
	flex-flow: row nowrap;
	gap: 10px;
`;

function sortByProfitProductList(list: Product[]) {
	return list.sort((a, b) => b.buyQuantity * b.price - a.buyQuantity * a.price);
}

function sortByNewestProductList(list: Product[]) {
	return list.sort((a, b) => {
		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
	});
}
function UserProducts() {
	const accessToken = localStorage.getItem("accessToken");
	const searchRef = useRef<HTMLInputElement>(null);
	const [searchKeyword, setSearchKeyword] = useState("");
	const [searchedList, setSearchedList] = useState<Product[]>([]);
	const [userProductsInfo, setUserProductsInfo] = useState<Product[]>([]);

	//비로그인 상태 체크
	useRequireAuth();

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
			const responseData = response.data.item;
			setUserProductsInfo(responseData);
			// 데이터를 로컬 스토리지에 저장
		} catch (error) {
			// 에러 처리
			console.error("상품 리스트 조회 실패:", error);
		}
	}

	const handleSortByProfit = useCallback(() => {
		let sortedProductList =
			searchedList.length > 0
				? sortByProfitProductList([...searchedList])
				: sortByProfitProductList([...userProductsInfo]);

		if (searchedList.length > 0) {
			setSearchedList(sortedProductList);
		} else {
			setUserProductsInfo(sortedProductList);
		}

		setItemWithExpireTime("userProductsInfo", sortedProductList, 5000 * 100);
	}, [userProductsInfo, searchedList]);

	const handleSortByNewest = useCallback(() => {
		let sortedProductList =
			searchedList.length > 0
				? sortByNewestProductList([...searchedList])
				: sortByNewestProductList([...userProductsInfo]);

		if (searchedList.length > 0) {
			setSearchedList(sortedProductList);
		} else {
			setUserProductsInfo(sortedProductList);
		}

		setItemWithExpireTime("userProductsInfo", sortedProductList, 5000 * 100);
	}, [userProductsInfo, searchedList]);

	const handleSearchKeyword = (e: { preventDefault: () => void }) => {
		e.preventDefault();

		if (searchRef.current?.value) {
			setSearchKeyword(
				searchRef.current.value.split(" ").join("").toLowerCase(),
			);
		} else {
			setSearchKeyword("");
			fetchUserProductsInfo();
		}
	};

	useEffect(() => {
		// 로컬 스토리지에서 데이터를 가져와 시도
		const storedUserProductsInfo = getItemWithExpireTime("userProductsInfo");

		if (storedUserProductsInfo) {
			setUserProductsInfo(storedUserProductsInfo);
		} else {
			fetchUserProductsInfo();
		}
	}, []);

	useEffect(() => {
		const filteredProductList = searchProductList({
			searchKeyword: searchKeyword,
			productList: userProductsInfo,
		});

		if (searchKeyword.length === 0) {
			setSearchedList([]);
			return;
		} else {
			setItemWithExpireTime(
				"userProductsInfo",
				filteredProductList,
				5000 * 100,
			);
			setSearchedList(filteredProductList);
		}
	}, [searchKeyword]);

	return (
		<section>
			<Helmet>
				<title>My Products - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>상품관리</h2>
			{userProductsInfo ? (
				<>
					<SearchBar onClick={handleSearchKeyword} searchRef={searchRef} />
					<FilterContainer>
						<FilterButton type="button" onClick={handleSortByProfit}>
							수익순
						</FilterButton>
						<FilterButton type="button" onClick={handleSortByNewest}>
							최신순
						</FilterButton>
					</FilterContainer>
					<ul>
						{searchKeyword && searchedList.length === 0 ? (
							<span>해당하는 상품이 없습니다.</span>
						) : searchKeyword && searchedList.length !== 0 ? (
							searchedList.map((item) => (
								<li key={item._id}>
									<img src={item.mainImages[0].url} alt="앨범 이름 이미지" />
									<p>{item.name}</p>
									<button type="button">
										<PlayArrowIcon />
									</button>
									<p>
										판매 개수: <span>{item.buyQuantity}</span>
									</p>
									<p>
										총 수익:{" "}
										<span>
											{typeof item.buyQuantity !== "undefined"
												? numberWithComma(item.buyQuantity * item.price)
												: "0"}
										</span>
									</p>
									<p>
										북마크 수:{" "}
										<span>{item?.bookmarks ? item?.bookmarks.length : 0}</span>
									</p>
									<Link to={`/productmanage/${item._id}`}>상세보기</Link>
								</li>
							))
						) : Array.isArray(userProductsInfo) ? (
							userProductsInfo.map((item) => (
								<li key={item._id}>
									<img src={item.mainImages[0].url} alt="앨범 이름 이미지" />
									<p>{item.name}</p>
									<button type="button">
										<PlayArrowIcon />
									</button>
									<p>
										판매 개수: <span>{item.buyQuantity}</span>
									</p>
									<p>
										총 수익:{" "}
										<span>
											{typeof item.buyQuantity !== "undefined"
												? numberWithComma(item.buyQuantity * item.price)
												: "0"}
										</span>
									</p>
									<p>
										북마크 수:{" "}
										<span>{item?.bookmarks ? item?.bookmarks.length : 0}</span>
									</p>
									<Link to={`/productmanage/${item._id}`}>상세보기</Link>
								</li>
							))
						) : (
							<span>데이터가 없습니다.</span>
						)}
					</ul>
					<button type="submit">더보기</button>
				</>
			) : (
				<span>현재 회원님이 판매하고 있는 상품이 없습니다</span>
			)}
		</section>
	);
}

export default UserProducts;
