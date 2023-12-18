import AuthInput from "@/components/AuthInput";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_API_SERVER;

const Title = styled.h2`
	${Common.a11yHidden};
`;

const Backgroud = styled.section`
	width: 100vw;
	height: 100vh;
	background-color: ${Common.colors.black};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	background-color: ${Common.colors.white};

	width: 506px;
	padding: ${Common.space.spacingLg};
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 10px;
`;

const Fieldset = styled.fieldset`
	width: 380px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	legend {
		text-align: center;
		margin: 28px auto;

		font-weight: ${Common.font.weight.bold};
		font-size: 32px;

		color: ${Common.colors.black};
	}
	& > ul:first-of-type {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 380px;
	}
	& > ul:last-of-type {
		width: 100%;
		margin-top: 20px;
		color: ${Common.colors.black};
		li {
			margin-bottom: 10px;
			display: flex;
			justify-content: space-between;
			& > button {
				background-color: ${Common.colors.emphasize};
				color: ${Common.colors.white};
				border: none;
				border-radius: 5px;
				margin: 3px 2px;
			}
		}

		& > :first-of-type {
			flex-direction: row-reverse;
		}
	}
`;

const UserImageWrapper = styled.li`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	& > label {
		font-size: 16px;
		font-weight: ${Common.font.weight.bold};
		color: ${Common.colors.black};
	}
	& > div {
		width: 100%;
		display: flex;
		justify-content: space-between;

		input[placeholder="첨부파일"] {
			vertical-align: middle;
			background-color: ${Common.colors.gray2};
			border: 1px solid ${Common.colors.gray};
			color: ${Common.colors.gray};
			border-radius: 10px;
			width: 78%;
			padding: 0 10px;
		}

		label {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 10px;
			cursor: pointer;
			background-color: ${Common.colors.emphasize};
			color: ${Common.colors.white};
			font-size: ${Common.font.size.sm};
			border-radius: 10px;
		}

		input[type="file"] {
			position: absolute;
			width: 0;
			height: 0;
			padding: 0;
			overflow: hidden;
			border: 0;
		}
	}
`;

const UserImage = styled.img`
	width: 100px;
	height: 100px;
	border-radius: 50%;
`;

const StyledCheckbox = styled(Checkbox)`
	margin: 0;
	padding: 0;
`;

const Submit = styled.button`
	width: 383px;
	height: 55px;

	background: ${Common.colors.emphasize};
	border-radius: 10px;
	border: none;

	font-weight: ${Common.font.weight.bold};
	font-size: ${Common.font.size.lg};
	color: ${Common.colors.white};

	padding: 15px 32px;
`;

const Cancle = styled(Link)`
	:visited {
		color: inherit;
	}
`;

function UserEdit() {
	const [userData, setUserData] = useState({
		email: "",
		name: "",
		password: "",
		confirmPassword: "",
		phone: "",
		extra: {
			profileImage: "",
			terms: {
				recievingMarketingInformation: false,
				confirmAge: false,
			},
		},
	});
	const navigate = useNavigate();
	const userId = localStorage.getItem("_id");
	const accessToken = localStorage.getItem("accessToken");
	const [uploadedFileName, setUploadedFileName] = useState("");

	// 비로그인 상태 체크
	useRequireAuth();

	useEffect(() => {
		// 사용자 정보 불러오기
		async function fetchUserInfo() {
			try {
				const response = await axiosInstance.get(`/users/${userId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (response.data.ok) {
					// API로부터 불러온 데이터를 기본값과 병합.
					const fetchedData = {
						...userData, // 기존 상태의 기본값
						...response.data.item, // API 응답
						extra: {
							...userData.extra, // 기존 상태의 extra 기본값
							...response.data.item.extra, // API 응답의 extra
							terms: {
								...userData.extra.terms, // 기존 상태의 terms 기본값
								...response.data.item.extra?.terms, // API 응답의 terms
							},
						},
						password: "", // 비밀번호 필드 초기화
						confirmPassword: "", // 비밀번호 확인 필드 초기화
					};
					setUserData(fetchedData);
				}
			} catch (error) {
				console.error("Error fetching user info:", error);
				toast.error("회원 정보를 불러오는데 실패했습니다.");
			}
		}

		fetchUserInfo();
	}, [userId, accessToken]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// 비밀번호 길이 확인
		if (userData.password && userData.password.length < 8) {
			toast.error("비밀번호는 8자 이상이어야 합니다.");
			return;
		}

		// 비밀번호 확인 로직
		if (userData.password !== userData.confirmPassword) {
			toast.error("비밀번호가 일치하지 않습니다.");
			return;
		}

		// 사용자가 비밀번호를 입력하지 않았을 경우 비밀번호 필드를 제외한 데이터로 요청
		const payload = userData.password
			? userData
			: { ...userData, password: undefined, confirmPassword: undefined };

		// 정보 수정 요청
		try {
			const response = await axiosInstance.patch(`/users/${userId}`, payload, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			if (response.data.ok) {
				toast.success("회원 정보가 수정되었습니다.");
				navigate("/mypage");
			}
		} catch (error) {
			console.error("Error updating user info:", error);
			toast.error("회원 정보 수정에 실패했습니다.");
		}
	}

	async function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { id, value, type, checked } = event.target;
		if (type === "checkbox") {
			setUserData({
				...userData,
				extra: {
					...userData.extra,
					terms: {
						...userData.extra.terms,
						[id]: checked,
					},
				},
			});
		} else {
			setUserData({
				...userData,
				[id]: value,
			});
		}
	}

	// 파일 업로드 핸들러
	async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			setUploadedFileName(file.name); // 업로드한 파일의 이름을 상태에 저장
			const formData = new FormData();
			formData.append("attach", file); // 'attach' 필드에 파일 추가

			try {
				const response = await axiosInstance.post("/files", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (response.data.ok) {
					const filePath = `${API_KEY.response.data.file.path}`;
					// 상태 업데이트로 이미지 경로 저장
					setUserData((prevUserData) => ({
						...prevUserData,
						extra: {
							...prevUserData.extra,
							profileImage: filePath,
						},
					}));
				}
			} catch (error) {
				console.error("Image upload failed:", error);
				toast.error("이미지 업로드에 실패했습니다.");
			}
		}
	}

	return (
		<Backgroud>
			<Helmet>
				<title>Edit User - 모두의 오디오 MODI</title>
			</Helmet>
			<Title>회원정보 수정</Title>
			<Form onSubmit={handleSubmit}>
				<Fieldset>
					<legend>회원정보 수정</legend>

					<ul>
						{/* 프로필 이미지 수정 */}
						<UserImageWrapper>
							<UserImage
								src={userData.extra.profileImage || "../../public/user.svg"}
								alt="프로필 이미지"
							/>
							<label htmlFor="userProfileImage">프로필 이미지</label>
							<div>
								<input
									value={uploadedFileName || "첨부파일"}
									placeholder="첨부파일"
									readOnly={true}
								/>
								<label htmlFor="userProfileImage">파일찾기</label>
								<input
									type="file"
									accept="image/*"
									id="userProfileImage"
									onChange={handleImageUpload}
								/>
							</div>
						</UserImageWrapper>
						<li>
							<AuthInput
								id="name"
								name="name"
								type="text"
								defaultValue={userData.name}
								onChange={handleInputChange}
								placeholder="이름을 입력하세요"
								required={true}
							/>
						</li>
						<li
							onClick={() =>
								toast("이메일은 수정 불가능합니다.", { duration: 2000 })
							}
						>
							<AuthInput
								id="email"
								name="email"
								type="email"
								defaultValue={userData.email}
								onChange={handleInputChange}
								placeholder="이메일 주소를 입력하세요"
								required={true}
								readonly={true}
							/>
						</li>
						<li>
							<AuthInput
								id="password"
								name="password"
								type="password"
								onChange={handleInputChange}
								placeholder="비밀번호를 입력하세요"
							/>
						</li>
						<li>
							<AuthInput
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								onChange={handleInputChange}
								placeholder="비밀번호 확인"
							/>
						</li>
						<li>
							<AuthInput
								id="phone"
								name="phone"
								type="text"
								defaultValue={userData.phone}
								onChange={handleInputChange}
								placeholder="전화번호를 입력하세요"
							/>
						</li>
					</ul>
					<ul>
						<li>
							<button type="button">약관보기</button>
							<div>
								<StyledCheckbox
									id="recievingMarketingInformation"
									checked={!!userData.extra.terms.recievingMarketingInformation}
									onChange={handleInputChange}
									icon={<CheckCircleOutlineIcon />}
									checkedIcon={<CheckCircleIcon />}
									sx={{
										color: Common.colors.gray,
										"&.Mui-checked": {
											color: Common.colors.emphasize,
										},
									}}
								/>
								<label htmlFor="recievingMarketingInformation">
									마케팅 정보 수신 동의
								</label>
							</div>
						</li>
						<li>
							<div>
								<StyledCheckbox
									id="confirmAge"
									checked={!!userData.extra.terms.confirmAge}
									onChange={handleInputChange}
									icon={<CheckCircleOutlineIcon />}
									checkedIcon={<CheckCircleIcon />}
									sx={{
										color: Common.colors.gray,
										"&.Mui-checked": {
											color: Common.colors.emphasize,
										},
									}}
								/>
								<label htmlFor="confirmAge">본인은 만 14세 이상입니다.</label>
							</div>
						</li>
					</ul>
				</Fieldset>
				<Submit type="submit">수정하기</Submit>
				<Cancle to="/mypage">수정취소</Cancle>
			</Form>
		</Backgroud>
	);
}

export default UserEdit;
