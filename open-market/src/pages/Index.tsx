import {
	FilterButton,
	FilterContainer,
	FilterSelect,
} from "@/components/FilterComponent";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/components/ProductListComponent";
import { ProductListItem } from "@/components/ProductListItem";
import SearchBar from "@/components/SearchBar";
import {
	categoryKeywordState,
	fetchproductListState,
	productListState,
	searchKeywordState,
	searchedProductListState,
} from "@/states/productListState";
import {
	axiosInstance,
	categoryFilterProductList,
	searchProductList,
} from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRecoilState, useRecoilValue } from "recoil";

interface bannerProps {
	showable?: boolean;
}

const BannerSection = styled.section<bannerProps>`
	display: ${(props) => (props.showable ? "block" : "none")};
	width: 100%;
	height: 400px;

	img {
		object-fit: cover;
	}
`;

function Index() {
	const searchRef = useRef<HTMLInputElement>(null);

	const fetchedProductList = useRecoilValue(fetchproductListState);
	const [productList, setProductList] = useRecoilState(productListState);
	const [searchKeyword, setSearchKeyword] =
		useRecoilState<string>(searchKeywordState);
	const [searchedProductList, setSearchedProductList] = useRecoilState<
		Product[]
	>(searchedProductListState);

	const [category, setCategory] = useState<CategoryCode[]>();
	const [categoryFilter, setCategoryFilter] =
		useRecoilState<string>(categoryKeywordState);
	const [filteredProductList, setFilteredProductList] = useState<Product[]>();

	function handleSearchKeyword() {
		setSearchKeyword(
			searchRef.current!.value.split(" ").join("").toLowerCase(),
		);
	}

	useEffect(() => {
		setProductList(fetchedProductList!);

		async function fetchCategory() {
			try {
				const response = await axiosInstance.get(`/codes/productCategory`);
				const responseData = response.data.item;
				const categoryCodeList = responseData.productCategory.codes;
				setCategory(categoryCodeList);
			} catch (error) {
				console.error("상품 리스트 조회 실패:", error);
			}
		}

		fetchCategory();
	}, []);

	useEffect(() => {
		function translateValueToCode(value: string) {
			if (value === "all") {
				return value;
			}
			if (value !== undefined && category !== undefined) {
				return category.find((item) => item.value === value)?.code;
			}
		}

		const selectedCode = translateValueToCode(categoryFilter)!;

		setFilteredProductList(
			categoryFilterProductList({
				code: selectedCode,
				productList: productList,
			}),
		);
	}, [categoryFilter, category]);

	useEffect(() => {
		const list =
			categoryFilter !== "all" && filteredProductList !== undefined
				? filteredProductList
				: productList;
		setSearchedProductList(
			searchProductList({
				searchKeyword: searchKeyword,
				productList: list!,
			}),
		);
		searchRef.current!.value = searchKeyword;
	}, [searchKeyword, filteredProductList]);

	return (
		<>
			<Helmet>
				<title>Home - 모두의 오디오 MODI</title>
			</Helmet>
			<BannerSection showable={searchKeyword ? false : true}>
				<img src="/banner.svg" alt="배너 이미지" />
			</BannerSection>
			<ProductSection>
				<Heading>메인페이지</Heading>
				<SearchBar
					onClick={handleSearchKeyword}
					searchRef={searchRef}
					showable={searchKeyword ? true : false}
				/>
				<FilterContainer>
					<FilterButton type="submit">인기순</FilterButton>
					<FilterButton type="submit">최신순</FilterButton>
					<FilterSelect showable={searchKeyword ? true : false}>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
						>
							<option value="none" disabled hidden>
								장르 선택
							</option>
							<option value="all">전체 보기</option>
							{category && category.length !== 0
								? category.map((item) => (
										<option key={item.code} value={item.value}>
											{item.value}
										</option>
								  ))
								: undefined}
						</select>
					</FilterSelect>
				</FilterContainer>
				<ProductContainer height={searchKeyword ? "633px" : "400px"}>
					<ProductList>
						{searchKeyword && searchedProductList !== undefined ? (
							searchedProductList.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : (
								searchedProductList.slice(0, 4).map((product) => {
									return (
										<ProductListItem
											key={product._id}
											product={product}
											bookmark
										/>
									);
								})
							)
						) : !searchKeyword &&
						  categoryFilter !== "all" &&
						  filteredProductList !== undefined ? (
							filteredProductList.length === 0 ? (
								<span className="emptyList">해당하는 상품이 없습니다.</span>
							) : (
								filteredProductList.slice(0, 4).map((product) => {
									return (
										<ProductListItem
											key={product._id}
											product={product}
											bookmark
										/>
									);
								})
							)
						) : (
							productList?.slice(0, 4).map((product) => {
								return (
									<ProductListItem
										key={product._id}
										product={product}
										bookmark
									/>
								);
							})
						)}
					</ProductList>
					<button type="submit" className="moreButton">
						더보기
					</button>
				</ProductContainer>
			</ProductSection>
		</>
	);
}

export default Index;
