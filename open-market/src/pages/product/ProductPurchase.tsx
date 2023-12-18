import FunctionalButton from "@/components/FunctionalButton";
import Textarea from "@/components/Textarea";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import { axiosInstance, numberWithComma } from "@/utils";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface FlexLayoutProps {
	right?: boolean;
}

interface StyleProps {
	wide?: boolean;
	large?: boolean;
}

interface LabelProps {
	bar?: boolean;
	large?: boolean;
}

const ProductPurchaseSection = styled.section`
	background-color: ${Common.colors.white};
	padding: 0 56px;

	.a11yHidden {
		display: ${Common.a11yHidden};
	}

	.ProductInfoWrapper {
		background-color: ${Common.colors.gray2};
		padding: 40px;
		width: 1328px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: ${Common.space.spacingXl};
	}
	.ProductImage {
		border-radius: 10px;
		width: 300px;
	}
	.ProductInfo {
		background-color: ${Common.colors.white};
	}
`;

const FormTopLayout = styled.div`
	width: 1248px;
	display: flex;
	gap: ${Common.space.spacingLg};
`;

const FormTopRightLayout = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${Common.space.spacingLg};
	width: 918px;
`;

const FlexLayout = styled.div<FlexLayoutProps>`
	display: flex;
	gap: ${Common.space.spacingXl};
	${(props) => props.right && "justify-content: flex-end;"}
`;

const ProductItemWrapper = styled.div<StyleProps>`
	display: flex;
	border-radius: 10px;
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingLg} ${Common.space.spacingMd};
	${(props) => (props.wide ? "width: 677px;" : "flex-grow: 1;")}

	${(props) =>
		props.large
			? `height: 290px; position: relative;`
			: "height: 72px; 	align-items: center;"}
`;

const ProductLabel = styled.span<LabelProps>`
	color: ${Common.colors.gray};
	white-space: nowrap;

	${(props) =>
		props.bar &&
		`
    &:after {
      content: " | ";
    }
  `}
`;

const ProductValue = styled.span<LabelProps>`
	font-size: 16px;
	color: ${Common.colors.black};
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingLg};
	${(props) =>
		props.large &&
		`
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: ${Common.font.size.xl};
    color:${Common.colors.gray}
  `}
`;

const ContentWrapper = styled.div`
	position: relative;

	.ContentInHash {
		color: ${Common.colors.gray};
		padding: 5px ${Common.space.spacingMd} ${Common.space.spacingMd} 0px;
		position: absolute;
		right: 0;
		bottom: 0;
	}
`;

function ProductPurchase() {
	const navigate = useNavigate();
	const { productId } = useParams();
	const [product, setProduct] = useState<Product>();
	const [category, setCategory] = useState<CategoryCode[]>();
	const [genre, setGenre] = useState<string>();

	//비로그인 상태 체크
	useRequireAuth();

	async function getProduct(id: string) {
		try {
			const response = await axiosInstance.get<ProductResponse>(
				`/products/${id}`,
			);
			setProduct(response.data.item);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleProductOrder() {
		if (confirm("구매하시겠습니까?")) {
			const accessToken = localStorage.getItem("accessToken");
			try {
				const response = await axiosInstance.post<OrderResponse>(
					"/orders",
					{
						products: [
							{
								_id: product?._id,
								quantity: 1,
							},
						],
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				if (response.data.ok) {
					toast.success("성공적으로 구매했습니다!");
					navigate("/");
				}
			} catch (err) {
				console.error(err);
			}
		}
	}

	useEffect(() => {
		if (productId === null || productId === "") {
			return navigate("/err", { replace: true });
		}
		getProduct(productId!);
	}, []);

	useEffect(() => {
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
		function translateCodeToValue(code: string) {
			if (
				code !== undefined &&
				category !== undefined &&
				product !== undefined
			) {
				return category.find((item) => item.code === code)?.value;
			}
		}
		setGenre(translateCodeToValue(product?.extra?.category!));
	}, [product, category]);
	return (
		<ProductPurchaseSection>
			<Helmet>
				<title>Order Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2 className="a11yHidden">상품 구매</h2>
			<div className="ProductInfoWrapper">
				<FormTopLayout>
					<img
						src={`${product?.mainImages[0].path}`}
						alt={`${product?.name} 앨범 아트`}
						className="ProductImage"
					/>
					<FormTopRightLayout>
						<ProductItemWrapper>
							<ProductLabel bar>제목</ProductLabel>
							<ProductValue>{product?.name}</ProductValue>
						</ProductItemWrapper>
						<FlexLayout>
							<ProductItemWrapper wide>
								<ProductLabel bar>아티스트</ProductLabel>
								<ProductValue> {product?.seller_id}</ProductValue>
							</ProductItemWrapper>
							<ProductItemWrapper>
								<ProductLabel bar>장르</ProductLabel>
								<ProductValue>{genre}</ProductValue>
							</ProductItemWrapper>
						</FlexLayout>
						<ContentWrapper>
							<Textarea readOnly={true} content={product?.content} small />
							<span className="ContentInHash">
								{product?.extra?.tags?.map((tag) => `#${tag} `)}
							</span>
						</ContentWrapper>
					</FormTopRightLayout>
				</FormTopLayout>
				<ProductItemWrapper large>
					<ProductLabel>결제 정보</ProductLabel>
					<ProductValue large>
						{product?.price !== undefined ? numberWithComma(product.price) : 0}₩
					</ProductValue>
				</ProductItemWrapper>
				<FlexLayout right>
					<FunctionalButton
						secondary
						handleFn={() => navigate(-1)}
						text="취소"
					/>
					<FunctionalButton handleFn={handleProductOrder} text="구매" />
				</FlexLayout>
			</div>
		</ProductPurchaseSection>
	);
}

export default ProductPurchase;
