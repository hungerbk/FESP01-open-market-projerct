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
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface FlexLayoutProps {
	right?: boolean;
}

interface ProductEditForm {
	show: boolean;
	name: string;
	mainImages: ProductFiles[];
	content: string;
	price: number;
	shippingFees: number;
	buyQuantity: number;
	extra: {
		category: string;
		tags: string[];
		soundFile: ProductFiles;
	};
}
const ProductEditSection = styled.section`
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

function ProductEdit() {
	const navigate = useNavigate();

	const { productId } = useParams();
	const [userProductInfo, setUserProductInfo] = useState<Product>();
	const [category, setCategory] = useState<CategoryCode[]>();
	const [postItem, setPostItem] = useState<ProductEditForm>({
		show: false,
		name: "",
		mainImages: [{ path: "", name: "", originalname: "" }],
		content: "",
		price: 0,
		shippingFees: 0,
		buyQuantity: 0,
		extra: {
			category: "",
			tags: [],
			soundFile: { path: "", name: "", originalname: "" },
		},
	});
	useRequireAuth();

	function handleEditProduct(e: { preventDefault: () => void }) {
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
				.patch(`/seller/products/${productId}`, postItem, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then(() => {
					toast.success("상품이 성공적으로 수정되었습니다", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					navigate(-1);
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

	function handleEditCancel() {
		const result = confirm("정말로 수정을 취소하시겠습니까?");
		if (result) {
			navigate(-1);
		}
	}

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");

		const fetchUserProductInfo = async () => {
			try {
				const response = await axiosInstance.get<ProductResponse>(
					`/seller/products/${productId}`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				const fetchedProductInfo = response.data.item;
				setUserProductInfo(fetchedProductInfo);
				setPostItem({
					show: fetchedProductInfo?.show || false,
					name: fetchedProductInfo?.name || "",
					mainImages: fetchedProductInfo?.mainImages || [],
					content: fetchedProductInfo?.content || "",
					price: fetchedProductInfo?.price || 0,
					buyQuantity: fetchedProductInfo?.buyQuantity || 0,
					shippingFees: 0,
					extra: {
						category: fetchedProductInfo?.extra?.category || "",
						tags: fetchedProductInfo?.extra?.tags || [],
						soundFile: fetchedProductInfo?.extra?.soundFile || {
							path: "",
							name: "",
							originalname: "",
						},
					},
				});
			} catch (error) {
				console.error("상품 정보 조회 실패:", error);
			}
		};
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
		fetchUserProductInfo();
	}, [productId]);

	return (
		<ProductEditSection>
			<Helmet>
				<title>Edit Product - 모두의 오디오 MODI</title>
			</Helmet>
			<h2 className="a11yHidden">상품 수정</h2>
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
							defaultValue={userProductInfo?.name}
							handleFn={debounce((e: { target: { value: any } }) =>
								setPostItem({ ...postItem, name: e.target.value }),
							)}
						/>
						<FlexLayout>
							<SelectGenre
								id="genre"
								value={userProductInfo?.extra?.category}
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
								defaultValue={userProductInfo?.extra?.tags}
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
								content={userProductInfo?.content}
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
						defaultValue={userProductInfo?.price}
						handleFn={debounce((e: { target: { value: string | number } }) =>
							setPostItem({ ...postItem, price: +e.target.value }),
						)}
					/>
					<ProductRadioButtonWrapper>
						<span>공개여부</span>
						<RadioButtonGroup>
							<span>공개</span>
							<StyledRadio
								checked={postItem.show === true}
								onChange={() =>
									setPostItem((prevPostItem) => ({
										...prevPostItem,
										show: true,
									}))
								}
								value="true"
							/>
							<span>비공개</span>
							<StyledRadio
								checked={postItem.show === false}
								onChange={() =>
									setPostItem((prevPostItem) => ({
										...prevPostItem,
										show: false,
									}))
								}
								value="false"
							/>
						</RadioButtonGroup>
					</ProductRadioButtonWrapper>
				</FlexLayout>
				<FlexLayout right>
					<FunctionalButton
						secondary={true}
						handleFn={handleEditCancel}
						text="취소"
					/>
					<FunctionalButton
						type="submit"
						handleFn={handleEditProduct}
						text="수정"
					/>
				</FlexLayout>
			</form>
		</ProductEditSection>
	);
}

export default ProductEdit;
