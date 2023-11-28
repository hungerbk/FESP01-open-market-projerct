import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await axios.post("https://localhost/api/users/login", {
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

				// 로그인 성공 이후 홈 페이지로 이동.
				navigate("/");
			}
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response) {
				alert(error.response.data.message);
			} else {
				console.error("예상치 못한 오류가 발생했습니다.:", error);
				alert("알 수 없는 오류가 발생했습니다.");
			}
		}
	};

	return (
		<section>
			<Helmet>
				<title>Sign In - 모두의 오디오 MODI</title>
			</Helmet>
			<h2>로그인</h2>
			<form onSubmit={handleLogin}>
				<fieldset>
					<legend>로그인 폼</legend>
					<label htmlFor="email">이메일</label>
					<input
						type="text"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="이메일"
					/>
					<label htmlFor="password">비밀번호</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="비밀번호"
					/>
				</fieldset>

				<button type="submit">로그인</button>
			</form>
			<ul>
				<li>
					<Link to="/signup">회원가입</Link>
				</li>
				<li>
					<Link to="/">아이디/비밀번호 찾기</Link>
				</li>
			</ul>
		</section>
	);
}

export default SignIn;
