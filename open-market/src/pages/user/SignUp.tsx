import AuthInput from "@/components/AuthInput";
import { Common } from "@/styles/common";
import { axiosInstance, debounce } from "@/utils";
import styled from "@emotion/styled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "/logo/logo1.svg";

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

const Logo = styled.h1`
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;

		img {
			width: 440px;
		}
	}
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
		margin-top: 20px;
		color: ${Common.colors.black};
		& > :first-of-type,
		& > :last-of-type {
			flex-direction: row;
		}
		li {
			display: flex;
			justify-content: space-between;
			flex-direction: row-reverse;
			& > button {
				background-color: ${Common.colors.emphasize};
				border: none;
				border-radius: 5px;
				color: ${Common.colors.white};
				margin: 3px 2px;
			}
		}
	}
`;

const StyledCheckbox = styled(Checkbox)`
	margin: 0;
	padding: 0;
`;

const EmailField = styled.li`
	display: flex;
	flex-direction: column;
	gap: 5px;
	& > div {
		display: flex;
		gap: 10px;
		align-items: center;
		& > button {
			width: 70px;
			height: 56px;
			background-color: ${Common.colors.emphasize};
			border: none;
			border-radius: 10px;
			padding: 20px 5px;
			font-size: ${Common.font.size.sm};
			font-weight: ${Common.font.weight.regular};
			color: ${Common.colors.white};
		}
	}
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

interface SignUpForm {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	phone: string;
	extra: {
		terms: {
			termsOfUse: boolean;
			providingPersonalInformation: boolean;
			recievingMarketingInformation: boolean;
			confirmAge: boolean;
		};
	};
}
interface SignUpRequest {
	email: string;
	password: string;
	name: string;
	phone: string;
	type: string;
}

function SignUp() {
	const navigate = useNavigate();

	const [form, setForm] = useState<SignUpForm>({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		phone: "",
		extra: {
			terms: {
				termsOfUse: false,
				providingPersonalInformation: false,
				recievingMarketingInformation: false,
				confirmAge: false,
			},
		},
	});

	const [agreeAll, setAgreeAll] = useState(false);
	const [termsOfUse, setTermsOfUse] = useState(false);
	const [providingPersonalInformation, setProvidingPersonalInformation] =
		useState(false);
	const [recievingMarketingInformation, setRecievingMarketingInformation] =
		useState(false);
	const [confirmAge, setConfirmAge] = useState(false);

	// 이메일 중복 확인 상태
	const [emailCheck, setEmailCheck] = useState({
		checked: false,
		valid: false,
		message: "",
	});

	const handleAgreeAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setAgreeAll(isChecked);
		setTermsOfUse(isChecked);
		setProvidingPersonalInformation(isChecked);
		setRecievingMarketingInformation(isChecked);
		setConfirmAge(isChecked);

		// form 상태의 extra 부분도 업데이트
		setForm((prevForm) => ({
			...prevForm,
			extra: {
				terms: {
					termsOfUse: isChecked,
					providingPersonalInformation: isChecked,
					recievingMarketingInformation: isChecked,
					confirmAge: isChecked,
				},
			},
		}));
	};

	useEffect(() => {
		// 모든 체크박스의 현재 상태를 확인
		const allChecked =
			termsOfUse &&
			providingPersonalInformation &&
			recievingMarketingInformation &&
			confirmAge;
		setAgreeAll(allChecked);
	}, [
		termsOfUse,
		providingPersonalInformation,
		recievingMarketingInformation,
		confirmAge,
	]);

	// 개별 체크박스 변경 처리
	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { id, checked } = event.target;

		switch (id) {
			case "termsOfUse":
				setTermsOfUse(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, termsOfUse: checked },
				}));
				break;
			case "providingPersonalInformation":
				setProvidingPersonalInformation(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, providingPersonalInformation: checked },
				}));
				break;
			case "recievingMarketingInformation":
				setRecievingMarketingInformation(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, recievingMarketingInformation: checked },
				}));
				break;
			case "confirmAge":
				setConfirmAge(checked);
				setForm((prevForm) => ({
					...prevForm,
					extra: { ...prevForm.extra, confirmAge: checked },
				}));
				break;
			default:
				break;
		}
	};

	// 회원 정보 객체 생성
	const createUserObject = () => {
		const { email, password, name, phone, extra } = form;
		return {
			email,
			password,
			name,
			phone,
			type: "seller", // 회원 유형은 "seller"로 고정
			extra,
		};
	};

	// 중복 확인 함수
	const checkEmailDuplication = async () => {
		try {
			const response = await axiosInstance.get(
				`/users/email?email=${form.email}`,
			);
			if (response.data.ok) {
				setEmailCheck({
					checked: true,
					valid: true,
					message: "사용 가능한 이메일입니다.",
				});
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setEmailCheck({
					checked: true,
					valid: false,
					message: error.response.data.message,
				});
			} else {
				console.error("이메일 중복 확인 중 오류가 발생했습니다.", error);
				setEmailCheck({
					checked: true,
					valid: false,
					message: "중복 확인 중 오류가 발생했습니다.",
				});
			}
		}
	};

	// 회원가입 요청 처리
	const signUpMutation = useMutation(
		async (newUser: SignUpRequest) => {
			const response = await axiosInstance.post("/users/", newUser);
			return response.data;
		},
		{
			onSuccess: () => {
				// 토스트 표시
				toast.success("회원가입이 완료되었습니다.");

				navigate("/signin");
			},
			onError: (error: any) => {
				console.error(error);

				if (error.response) {
					switch (error.response.status) {
						case 409:
							toast.error(
								error.response.data.message || "이미 등록된 이메일입니다.",
							);
							break;
						case 422:
							const errorMessages = error.response.data.errors
								.map((err: { msg: string }) => `${err.msg}`)
								.join("\n");
							toast.error(`회원가입 실패: ${errorMessages}`);
							break;
						case 500:
							toast.error(
								"서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
							);
							break;
						default:
							toast.error("회원가입 중 알 수 없는 오류가 발생했습니다.");
					}
				} else {
					toast.error("회원가입 중 알 수 없는 오류가 발생했습니다.");
				}
			},
		},
	);
	// 폼 제출 처리
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (form.password !== form.confirmPassword) {
			toast.error("비밀번호가 일치하지 않습니다.");
			return;
		}
		const userObject = createUserObject();
		signUpMutation.mutate(userObject);
	};

	// 입력 필드 변경 처리
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		// 전화번호 필드의 경우 숫자만 허용
		if (name === "phone") {
			const numbersOnly = value.replace(/[^0-9]/g, "");
			setForm({ ...form, [name]: numbersOnly });
		} else {
			setForm({ ...form, [name]: value });
		}
	};
	return (
		<Backgroud>
			<Helmet>
				<title>Sign Up - 모두의 오디오 MODI</title>
			</Helmet>
			<Logo>
				<Link to="/">
					<img src={logoImage} alt="모디 로고" />
				</Link>
			</Logo>
			<Title>회원가입</Title>
			<Form onSubmit={handleSubmit}>
				<Fieldset>
					<legend>회원가입</legend>
					<ul>
						<EmailField>
							<div>
								<AuthInput
									id="email"
									name="email"
									label="이메일"
									type="text"
									defaultValue={form.email}
									onChange={debounce(handleChange)}
									placeholder="이메일"
									required={true}
								/>
								<button type="button" onClick={checkEmailDuplication}>
									중복 확인
								</button>
							</div>
							{emailCheck.checked && <p>{emailCheck.message}</p>}
						</EmailField>
						<li>
							<AuthInput
								id="password"
								name="password"
								label="비밀번호"
								type="password"
								defaultValue={form.password}
								onChange={debounce(handleChange)}
								placeholder="비밀번호"
								required={true}
							/>
						</li>
						<li>
							<AuthInput
								id="confirmPassword"
								name="confirmPassword"
								label="비밀번호 확인"
								type="password"
								defaultValue={form.confirmPassword}
								onChange={debounce(handleChange)}
								placeholder="비밀번호 확인"
								required={true}
							/>
						</li>
						<li>
							<AuthInput
								type="text"
								id="name"
								name="name"
								defaultValue={form.name}
								onChange={debounce(handleChange)}
								placeholder="이름"
								required={true}
							/>
						</li>
						<li>
							<AuthInput
								type="tel"
								id="phone"
								name="phone"
								defaultValue={form.phone}
								onChange={debounce(handleChange)}
								placeholder="휴대폰 번호"
								required={true}
							/>
						</li>
					</ul>
					<ul>
						<li>
							<div>
								<StyledCheckbox
									id="agreeAll"
									checked={agreeAll}
									onChange={handleAgreeAllChange}
									icon={<CheckCircleOutlineIcon />}
									checkedIcon={<CheckCircleIcon />}
									sx={{
										color: Common.colors.gray,
										"&.Mui-checked": {
											color: Common.colors.emphasize,
										},
									}}
								/>
								<label htmlFor="agreeAll">전체 동의합니다</label>
							</div>
						</li>
						<li>
							<button type="button">약관보기</button>
							<div>
								<StyledCheckbox
									id="termsOfUse"
									checked={termsOfUse}
									onChange={handleCheckboxChange}
									required
									icon={<CheckCircleOutlineIcon />}
									checkedIcon={<CheckCircleIcon />}
									sx={{
										color: Common.colors.gray,
										"&.Mui-checked": {
											color: Common.colors.emphasize,
										},
									}}
								/>
								<label htmlFor="termsOfUse">이용약관 동의 (필수)</label>
							</div>
						</li>
						<li>
							<button type="button">약관보기</button>
							<div>
								<StyledCheckbox
									id="providingPersonalInformation"
									checked={providingPersonalInformation}
									onChange={handleCheckboxChange}
									required
									icon={<CheckCircleOutlineIcon />}
									checkedIcon={<CheckCircleIcon />}
									sx={{
										color: Common.colors.gray,
										"&.Mui-checked": {
											color: Common.colors.emphasize,
										},
									}}
								/>
								<label htmlFor="providingPersonalInformation">
									개인정보 수집 및 이용 동의 (필수)
								</label>
							</div>
						</li>
						<li>
							<button type="button">약관보기</button>
							<div>
								<StyledCheckbox
									id="recievingMarketingInformation"
									checked={recievingMarketingInformation}
									onChange={handleCheckboxChange}
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
									마케팅 정보 수신 동의 (선택)
								</label>
							</div>
						</li>
						<li>
							<div>
								<StyledCheckbox
									id="confirmAge"
									checked={confirmAge}
									onChange={handleCheckboxChange}
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

				<Submit type="submit">회원가입</Submit>
			</Form>
		</Backgroud>
	);
}

export default SignUp;
