import AuthInput from "@/components/AuthInput";
import { loggedInState } from "@/states/authState";
import { Common } from "@/styles/common";
import { axiosInstance, debounce } from "@/utils";
import styled from "@emotion/styled";
import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
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
	gap: 5px;
	legend {
		text-align: center;
		margin: 28px auto;

		font-weight: ${Common.font.weight.bold};
		font-size: 32px;

		color: ${Common.colors.black};
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

const Ul = styled.ul`
	display: flex;
	a:visited {
		text-decoration: none;
		color: inherit;
	}
	margin-bottom: 100px;
	& > :first-of-type::after {
		content: "|";
		display: inline-block;
		margin: 0 40px;
	}
`;

function SignIn() {
	const [_, setLoggedIn] = useRecoilState(loggedInState);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await axiosInstance.post("/users/login", {
				email,
				password,
			});

			// 로그인 성공 시 토큰을 localStorage에 저장(임시)
			if (response.data.ok && response.data.item.token) {
				localStorage.setItem(
					"accessToken",
					response.data.item.token.accessToken,
				);
				localStorage.setItem(
					"refreshToken",
					response.data.item.token.refreshToken,
				);
				localStorage.setItem("_id", response.data.item._id);

				// 로그인 성공 이후 홈 페이지로 이동.
				toast.success("로그인 성공!");
				setLoggedIn(true);
				navigate("/");
			}
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response) {
				const errorMessage = error.response.data.message;

				if (
					error.response.data.errors &&
					error.response.data.errors.length > 0
				) {
					const detailedMessages = error.response.data.errors
						.map((err: any) => `${err.msg} (${err.path})`)
						.join("\n");
					toast.error(`${detailedMessages}`);
				} else {
					toast.error(errorMessage);
				}
			} else {
				console.error("예상치 못한 오류가 발생했습니다.:", error);
				toast.error("알 수 없는 오류가 발생했습니다.");
			}
		}
	};

	return (
		<Backgroud>
			<Helmet>
				<title>Sign In - 모두의 오디오 MODI</title>
			</Helmet>
			<Logo>
				<Link to="/">
					<img src={logoImage} alt="모디 로고" />
				</Link>
			</Logo>
			<Title>로그인</Title>
			<Form onSubmit={handleLogin}>
				<Fieldset>
					<legend>로그인</legend>
					<AuthInput
						id="email"
						name="email"
						label="이메일"
						type="text"
						defaultValue={email}
						onChange={debounce(
							(e: { target: { value: React.SetStateAction<string> } }) =>
								setEmail(e.target.value),
						)}
						placeholder="이메일"
						required={true}
					/>
					<AuthInput
						id="password"
						name="password"
						label="비밀번호"
						type="password"
						defaultValue={password}
						onChange={debounce(
							(e: { target: { value: React.SetStateAction<string> } }) =>
								setPassword(e.target.value),
						)}
						placeholder="비밀번호"
						required={true}
					/>
				</Fieldset>

				<Submit type="submit">로그인</Submit>
				<Ul>
					<li>
						<Link to="/signup">회원가입</Link>
					</li>
					<li>
						<Link to="/">아이디/비밀번호 찾기</Link>
					</li>
				</Ul>
			</Form>
		</Backgroud>
	);
}

export default SignIn;
