import FormInput from "@/components/FormInput";
import FunctionalButton from "@/components/FunctionalButton";
import SelectGenre from "@/components/SelectGenre";
import Textarea from "@/components/Textarea";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import { axiosInstance, debounce } from "@/utils";
import { uploadFile } from "@/utils/uploadFile";
import styled from "@emotion/styled";
import CircleIcon from "@mui/icons-material/Circle";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Radio, RadioProps } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FlexLayoutProps {
	right?: boolean;
}

interface ProductRegistForm {
	show: boolean;
	active: boolean;
	name: string;
	mainImages: ProductFiles[];
	content: string;
	price: number;
	shippingFees: number;
	quantity: number;
	buyQuantity: number;
	extra: {
		isNew: boolean;
		isBest: boolean;
		category: string;
		tags: string[];
		soundFile: ProductFiles;
	};
}
const ProductRegistSection = styled.section`
	background-color: ${Common.colors.white};
	padding: 0 56px;

	.a11yHidden {
		display: ${Common.a11yHidden};
	}

	.PostFormWrapper {
		background-color: ${Common.colors.gray2};
		padding: 40px;
		width: 1328px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: ${Common.space.spacingXl};
	}
`;
const FormTopLayout = styled.div`
	width: 1248px;
	display: flex;
	gap: ${Common.space.spacingLg};
`;

const PostImageWrapper = styled.div`
	width: 300px;
	height: 300px;
	background-color: ${Common.colors.white};
	border-radius: 10px;

	.ImageWrapper {
		position: relative;
	}
	.PostImage {
		position: absolute;
		z-index: 10;
		width: 100%;
		height: 300px;
		opacity: 0;
		cursor: pointer;
	}
	.PostImageLabel {
		display: flex;
		flex-direction: column;
		color: ${Common.colors.gray2};
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 105%);
	}
	.UploadImage {
		width: 300px;
	}
`;
const PostAudioWrapper = styled.div`
	width: 211px;
	background-color: ${Common.colors.white};
	border-radius: 10px;

	.AudioWrapper {
		position: relative;
	}
	.PostAudio {
		position: absolute;
		z-index: 10;
		width: 100%;
		height: 116px;
		opacity: 0;
		cursor: pointer;
	}
	.PostAudioLabel {
		display: flex;
		color: ${Common.colors.black};
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 250%);
	}

	.UploadAudioFile {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 270%);
	}
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

const ProductRadioButtonWrapper = styled.div`
	width: 590px;
	height: 290px;
	color: ${Common.colors.gray};
	border-radius: 10px;
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingMd};
`;

const RadioButtonGroup = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 50%;
	transform: translateY(-60%);
`;

const StyledRadio = muiStyled((props: RadioProps) => (
	<Radio
		{...props}
		icon={<RadioButtonUncheckedIcon style={{ color: "#D9D9D9" }} />}
		checkedIcon={<CircleIcon style={{ color: "#FFB258" }} />}
	/>
))``;

function ProductRegistration() {
	const navigate = useNavigate();

	const [postItem, setPostItem] = useState<ProductRegistForm>({
		show: true,
		active: true,
		name: "",
		mainImages: [{ path: "", name: "", originalname: "" }],
		content: "",
		price: 0,
		shippingFees: 0,
		quantity: Number.MAX_SAFE_INTEGER,
		buyQuantity: 0,
		extra: {
			isNew: true,
			isBest: false,
			category: "",
			tags: [],
			soundFile: { path: "", name: "", originalname: "" },
		},
	});
	const [category, setCategory] = useState<CategoryCode[]>();

	//비로그인 상태 체크
	useRequireAuth();

	function handlePostProductRegist(e: { preventDefault: () => void }) {
		e.preventDefault();
		const accessToken = localStorage.getItem("accessToken");

		if (postItem.mainImages.length === 0) {
			toast.error("앨범아트를 업로드해야 합니다", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}

		if (postItem.extra.soundFile.path === "") {
			toast.error("음원을 업로드해야 합니다", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			return;
		}

		try {
			axiosInstance
				.post(`/seller/products`, postItem, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => {
					toast.success("상품이 성공적으로 올라갔습니다", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});

					if (response.status === 200) {
						const productId = response.data.item._id;
						navigate(`/productmanage/${productId}`);
					}

					localStorage.removeItem("userProductsInfo");
				})
				.catch((error) => {
					error.response.data.errors.forEach(
						(err: { msg: Renderable | ValueFunction<Renderable, Toast> }) =>
							toast.error(err.msg),
					);
				});
		} catch (error) {
			console.error(error);
		}
	}

	function handleRegistCancel() {
		const result = confirm("정말로 등록을 취소하시겠습니까?");
		if (result) {
			navigate(-1);
		}
	}

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		async function fetchCategory() {
			try {
				const response = await axiosInstance.get(`/codes/productCategory`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				const responseData = response.data.item;
				const categoryCodeList = responseData.productCategory.codes;
				setCategory(categoryCodeList);

				// 데이터를 로컬 스토리지에 저장
			} catch (error) {
				// 에러 처리
				console.error("상품 리스트 조회 실패:", error);
			}
		}

		fetchCategory();
	}, []);
	console.log(postItem.mainImages[0]);
	return (
		<ProductRegistSection>
			<Helmet>
				<title>Register Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2 className="a11yHidden">상품 등록</h2>
			<form encType="multipart/form-data" className="PostFormWrapper">
				<FormTopLayout>
					<PostImageWrapper>
						<div className="ImageWrapper">
							<input
								type="file"
								accept="*.jpg,*.png,*.jpeg,*.webp,*.avif"
								onChange={(e: { target: { files: any } }) => {
									uploadFile(e.target.files[0], setPostItem, "image");
								}}
								className="PostImage"
								name="photo"
								id="photo"
							/>
							{postItem?.mainImages[0].path !== "" ? (
								<img
									className="UploadImage"
									src={postItem?.mainImages[0].path}
									alt={`${postItem?.name}앨범아트`}
								/>
							) : (
								<div className="PostImageLabel">
									<FileUploadIcon
										style={{ color: "#D9D9D9", fontSize: "80px" }}
									/>
									<label htmlFor="photo">커버 업로드</label>
								</div>
							)}
						</div>
					</PostImageWrapper>
					<FormTopRightLayout>
						<FormInput
							name="title"
							label="타이틀"
							handleFn={debounce((e: { target: { value: any } }) =>
								setPostItem({ ...postItem, name: e.target.value }),
							)}
						/>
						<FlexLayout>
							<SelectGenre
								id="genre"
								value="none"
								handleFn={(e) => {
									setPostItem({
										...postItem,
										extra: { ...postItem.extra, category: e.target.value },
									});
								}}
								category={category}
							/>
							<FormInput
								name="hashTag"
								label="해시태그"
								placeholder="해시태그를 ','(콤마)로 구분해주세요"
								handleFn={debounce((e: React.ChangeEvent<HTMLInputElement>) => {
									const tagsArray = e.target.value.split(",");
									setPostItem({
										...postItem,
										extra: { ...postItem.extra, tags: tagsArray },
									});
								})}
							/>
						</FlexLayout>
						<FlexLayout>
							<Textarea
								onChange={debounce((e: { target: { value: any } }) =>
									setPostItem({ ...postItem, content: e.target.value }),
								)}
							/>
							<PostAudioWrapper>
								<div className="AudioWrapper">
									<input
										type="file"
										accept="audio/*"
										name="mp3"
										className="PostAudio"
										id="mp3"
										onChange={(e: { target: { files: any } }) =>
											uploadFile(e.target.files[0], setPostItem, "soundFile")
										}
									/>
									{postItem?.extra.soundFile.path !== "" ? (
										<span className="UploadAudioFile">
											{postItem?.extra.soundFile.name}
										</span>
									) : (
										<div className="PostAudioLabel">
											<FileUploadIcon
												style={{ color: "#FF3821", fontSize: "20px" }}
											/>
											<label htmlFor="mp3">음원 업로드</label>
										</div>
									)}
								</div>
							</PostAudioWrapper>
						</FlexLayout>
					</FormTopRightLayout>
				</FormTopLayout>
				<FlexLayout>
					<FormInput
						name="price"
						label="가격"
						type="number"
						handleFn={debounce((e: { target: { value: string | number } }) =>
							setPostItem({ ...postItem, price: +e.target.value }),
						)}
					/>
					<ProductRadioButtonWrapper>
						<span>공개여부</span>
						<RadioButtonGroup>
							<span>공개</span>
							<StyledRadio
								disabled
								checked={postItem.show === true}
								onChange={() =>
									setPostItem((prevPostItem) => ({
										...prevPostItem,
										show: true,
									}))
								}
								value="true"
							/>
							<div>
								<span>비공개</span>
								<StyledRadio
									disabled
									checked={postItem.show === false}
									onChange={() =>
										setPostItem((prevPostItem) => ({
											...prevPostItem,
											show: false,
										}))
									}
									value="false"
								/>
							</div>
						</RadioButtonGroup>
					</ProductRadioButtonWrapper>
				</FlexLayout>
				<FlexLayout right>
					<FunctionalButton
						secondary={true}
						handleFn={handleRegistCancel}
						text="취소"
					/>
					<FunctionalButton
						type="submit"
						handleFn={handlePostProductRegist}
						text="등록"
					/>
				</FlexLayout>
			</form>
		</ProductRegistSection>
	);
}

export default ProductRegistration;
