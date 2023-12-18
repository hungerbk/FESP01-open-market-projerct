import { FilterButton, FilterContainer } from "@/components/FilterComponent";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/components/ProductListComponent";
import { UserProductListItem } from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	axiosInstance,
	getItemWithExpireTime,
	searchProductList,
	setItemWithExpireTime,
} from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

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
		<ProductSection>
			<Helmet>
				<title>My Products - 모두의 오디오 MODI</title>
			</Helmet>
			<Heading>상품관리</Heading>
			{userProductsInfo ? (
				<>
					<SearchBar
						onClick={handleSearchKeyword}
						searchRef={searchRef}
						showable
					/>
					<FilterContainer>
						<FilterButton type="button" onClick={handleSortByProfit}>
							수익순
						</FilterButton>
						<FilterButton type="button" onClick={handleSortByNewest}>
							최신순
						</FilterButton>
					</FilterContainer>
					<ProductContainer height="633px">
						<ProductList>
							{searchKeyword && searchedList.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : searchKeyword && searchedList.length !== 0 ? (
								searchedList.map((item) => (
									<UserProductListItem product={item} />
								))
							) : Array.isArray(userProductsInfo) ? (
								userProductsInfo.map((item) => (
									<UserProductListItem product={item} />
								))
							) : (
								<span>데이터가 없습니다.</span>
							)}
						</ProductList>
						<button type="submit" className="moreButton">
							더보기
						</button>
					</ProductContainer>
				</>
			) : (
				<span className="emptyList">
					현재 회원님이 판매하고 있는 상품이 없습니다
				</span>
			)}
		</ProductSection>
	);
}

export default UserProducts;
