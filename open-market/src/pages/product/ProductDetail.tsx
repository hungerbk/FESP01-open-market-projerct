import { loggedInState } from "@/states/authState";
import { axiosInstance, debounce } from "@/utils";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Rating } from "@mui/material";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

function ProductDetail() {
	const navigate = useNavigate();
	const { productId } = useParams();

	const loggedIn = useRecoilValue(loggedInState);

	const replyRef = useRef<HTMLInputElement>(null);

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

	function handelSignIn() {
		if (confirm("로그인 후 이용 가능합니다")) {
			navigate("/signin");
		}
	}

	function ShowStarRating({ rating }: { rating: number }) {
		return (
			<Rating
				name="showRating"
				value={Number(rating)}
				precision={0.5}
				readOnly
			/>
		);
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
			<h2>상세 페이지</h2>
			<article>
				<div>
					<img
						src={product?.mainImages[0].url}
						alt={`${product?.name} 앨범 아트`}
					/>
					<button>
						<PlayArrowIcon />
					</button>
				</div>
				<div>
					<span>{product?.name}</span>
					<span>{product?.seller_id}</span>
					<span>{product?.createdAt}</span>
					<span>{genre}</span>
					<div>
						{product?.content.split("\n").map((line, index) => {
							return (
								<span key={index}>
									{line}
									<br />
								</span>
							);
						})}
					</div>
					<span>{product?.price}</span>
				</div>
				<div>
					{product?.extra?.isNew ? (
						<div>
							<StarIcon />
							New!
						</div>
					) : (
						<></>
					)}
					{product?.extra?.isBest ? (
						<div>
							<ThumbUpIcon />
							Best!
						</div>
					) : (
						<></>
					)}
				</div>
				<div>
					<div>
						<ShowStarRating rating={rating} />
					</div>
					<span>{rating}</span>
				</div>
				<div>
					<img src="https://svgsilh.com/svg/2028515.svg" alt="음파" />
				</div>
			</article>
			<article>
				<div>
					<button>
						<BookmarkOutlinedIcon />
						{product?.bookmarks ? product?.bookmarks.length : 0}
					</button>
					{!loggedIn ? (
						<button type="button" onClick={handelSignIn}>
							<CheckIcon />
							구매하기
							{product?.buyQuantity ? product?.buyQuantity : 0}
						</button>
					) : loggedIn && logState === product?.seller_id ? (
						<Link to={`/productmanage/${product?._id}`}>
							<CheckIcon />
							상품 관리
						</Link>
					) : (loggedIn && order?.length === 0) || order === undefined ? (
						<Link to={`/productpurchase/${product?._id}`}>
							<CheckIcon />
							구매하기
							{product?.buyQuantity ? product?.buyQuantity : 0}
						</Link>
					) : (
						<a
							href={`https://localhost/api/files/download/${product?.extra?.soundFile.fileName}?name=${product?.extra?.soundFile.orgName}`}
							download={true}
						>
							<DownloadIcon />
							다운로드
						</a>
					)}
				</div>
			</article>
			<article>
				<h3>
					<ModeCommentIcon />
					댓글
				</h3>
				{!loggedIn ? (
					<p>로그인 후 댓글을 작성할 수 있습니다.</p>
				) : loggedIn && logState === product?.seller_id ? (
					<p>내 상품에는 댓글을 작성할 수 없습니다.</p>
				) : (loggedIn && order?.length === 0) || order === undefined ? (
					<p>음원 구매 후 댓글을 작성할 수 있습니다.</p>
				) : (
					<form action="submit">
						<div>
							<span>
								{currentUser?.extra?.profileImage ? (
									currentUser?.extra?.profileImage
								) : (
									<AccountCircleIcon />
								)}
							</span>
							<span>{currentUser?.email}</span>
						</div>
						<div>
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
							/>
						</div>
						<div>
							<label htmlFor="content">댓글 내용</label>
							<input
								id="content"
								name="content"
								type="text"
								ref={replyRef}
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
					</form>
				)}

				<ul>
					{product?.replies?.length === 0 ? (
						<p>댓글이 없습니다.</p>
					) : (
						product?.replies?.map((reply) => {
							return (
								<li key={reply._id}>
									<div>
										<AccountCircleIcon />
										<span>{reply.userName}</span>
									</div>
									<div>
										<p>{reply.content}</p>
										<div>
											<ShowStarRating rating={reply.rating} />
											{reply.rating}
										</div>
									</div>
								</li>
							);
						})
					)}
				</ul>
				<button>
					더보기
					<ArrowDropDownIcon />
				</button>
			</article>
		</section>
	);
}

export default ProductDetail;
