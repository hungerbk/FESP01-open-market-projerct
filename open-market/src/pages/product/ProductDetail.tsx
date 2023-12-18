import ProductDetailExtraLink from "@/components/ProductDetailBadgeComponent";
import ProductDetailComponent from "@/components/ProductDetailComponent";
import { Heading } from "@/components/ProductListComponent";
import ReplyListItem, {
	ReplyBlock,
	ReplyContainer,
	ReplyInputForm,
	ReplyTextarea,
} from "@/components/ReplyComponent";
import { loggedInState } from "@/states/authState";

import { axiosInstance, debounce } from "@/utils";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import StarIcon from "@mui/icons-material/Star";
import { Rating } from "@mui/material";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

function ProductDetail() {
	const navigate = useNavigate();
	const { productId } = useParams();

	const loggedIn = useRecoilValue(loggedInState);

	const replyRef = useRef<HTMLTextAreaElement>(null);

	const [product, setProduct] = useState<Product>();
	const [rating, setRating] = useState(0);
	const [currentUser, setCurrentUser] = useState<User | undefined>();
	const [logState, setLogState] = useState<number | undefined>();
	const [order, setOrder] = useState<Order[]>();
	const [ratingValue, setRatingValue] = useState<number>(3);
	const [_, setHover] = useState(-1);
	const [replyContent, setReplyContent] = useState<string>();
	const [category, setCategory] = useState<CategoryCode[]>();
	const [genre, setGenre] = useState<string>();

	async function getProduct(id: string) {
		try {
			const response = await axiosInstance.get<ProductResponse>(
				`/products/${id}`,
			);
			setProduct(response.data.item);
			setRating(getRating(response.data.item));
			if (loggedIn) {
				getUser(Number(localStorage.getItem("_id")!));
				getOrder(Number(id)!);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function getOrder(productId: number) {
		const accessToken = localStorage.getItem("accessToken");
		try {
			const response = await axiosInstance.get<OrderListResponse>(`/orders`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const userOrder = response.data.item.filter(
				(order) => order.products[0]._id === productId,
			);
			setOrder(userOrder);
		} catch (err) {
			console.error(err);
		}
	}

	async function getUser(id: number) {
		const accessToken = localStorage.getItem("accessToken");
		try {
			const response = await axiosInstance.get<UserResponse>(`/users/${id}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setCurrentUser(response.data.item);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleReplySubmit(e: { preventDefault: () => void }) {
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");
		try {
			const response = await axiosInstance.post<ReplyResponse>(
				`/replies`,
				{
					order_id: order![0]._id,
					product_id: Number(productId),
					rating: ratingValue,
					content: replyContent,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			if (response.data.ok) {
				toast.success("댓글을 작성했습니다.");
				replyRef.current!.value = "";
				setRatingValue(3);
				getProduct(productId!);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function getRating(product: Product) {
		if (product.replies?.length === 0) {
			return 0;
		} else {
			const ratingSum = product.replies?.reduce(
				(acc, cur) => acc + Number(cur.rating),
				0,
			)!;
			const ratingAvg = Number(
				(ratingSum / product.replies?.length!).toFixed(2),
			);
			return ratingAvg;
		}
	}

	useEffect(() => {
		if (productId === null || productId === "") {
			return navigate("/err", { replace: true });
		}
		getProduct(productId!);
	}, []);

	useEffect(() => {
		if (loggedIn) {
			setLogState(Number(localStorage.getItem("_id")!));
		}
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
		getProduct(productId!);
		if (loggedIn) {
			getUser(Number(localStorage.getItem("_id")!));
			getOrder(Number(productId)!);
		}
	}, [productId, loggedIn]);

	useEffect(() => {
		let sessionHistory: Product[] = JSON.parse(
			sessionStorage.getItem("historyList") || "[]",
		);
		if (product) {
			if (sessionHistory.length > 5) {
				sessionHistory.pop();
			}
			sessionHistory.unshift(product);
			sessionHistory = Array.from(
				new Set(sessionHistory.map((item) => JSON.stringify(item))),
			).map((item) => JSON.parse(item));
			sessionStorage.setItem("historyList", JSON.stringify(sessionHistory));
		}
	}, [product]);

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
		<section>
			<Helmet>
				<title>Product Detail - 모두의 오디오 MODI</title>
			</Helmet>
			<Heading>상세 페이지</Heading>
			<ProductDetailComponent product={product} genre={genre} rating={rating} />
			<ProductDetailExtraLink
				product={product}
				order={order}
				loggedIn={loggedIn}
				logState={logState}
			/>
			<ReplyContainer>
				<h3>
					<ModeCommentIcon />
					댓글
				</h3>
				<div>
					{!loggedIn ? (
						<p>로그인 후 댓글을 작성할 수 있습니다.</p>
					) : loggedIn && logState === product?.seller_id ? (
						<p>내 상품에는 댓글을 작성할 수 없습니다.</p>
					) : (loggedIn && order?.length === 0) || order === undefined ? (
						<p>음원 구매 후 댓글을 작성할 수 있습니다.</p>
					) : (
						<ReplyInputForm action="submit">
							<span>
								{currentUser?.extra?.profileImage ? (
									currentUser?.extra?.profileImage
								) : (
									<AccountCircleIcon />
								)}
							</span>
							<ReplyBlock user>{currentUser?.name}</ReplyBlock>
							<div className="inputRating">
								<Rating
									name="rating"
									value={ratingValue}
									precision={0.5}
									max={5}
									onChange={(_, newValue) => {
										newValue === null
											? setRatingValue(1)
											: setRatingValue(newValue);
									}}
									onChangeActive={(_, newHover) => {
										setHover(newHover);
									}}
									emptyIcon={
										<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
									}
								/>
							</div>
							<label htmlFor="content" className="a11yHidden">
								댓글 내용
							</label>
							<div className="replyTextAreaContainer">
								<ReplyTextarea
									id="content"
									name="content"
									// ref={replyRef}
									onChange={debounce(
										(e: {
											target: { value: SetStateAction<string | undefined> };
										}) => setReplyContent(e.target.value),
									)}
									required
								/>
								<button type="submit" onClick={handleReplySubmit}>
									작성하기
								</button>
							</div>
						</ReplyInputForm>
					)}
				</div>
				<ul>
					{product?.replies?.length === 0 ? (
						<p>댓글이 없습니다.</p>
					) : (
						product?.replies?.map((reply) => {
							return <ReplyListItem reply={reply} />;
						})
					)}
				</ul>
				<button className="moreButton">더보기</button>
			</ReplyContainer>
		</section>
	);
}

export default ProductDetail;
