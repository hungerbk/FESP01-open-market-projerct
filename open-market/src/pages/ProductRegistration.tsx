import { Helmet } from "react-helmet-async";

function ProductRegistration() {
	return (
		<>
			<Helmet>
				<title>Register Product - 모두의 오디오 MODI</title>
			</Helmet>
			<section>
				<h2>상품 등록</h2>
				<form encType="multipart/form-data">
					<div>
						<label htmlFor="title">제목</label>
						<input
							type="text"
							name="title"
							id="title"
							placeholder="제목을 입력해주세요"
						/>
					</div>
					<div>
						<label htmlFor="photo">앨범아트</label>
						<input
							type="file"
							accept="*.jpg,*.png,*.jpeg,*.webp,*.avif"
							name="photo"
							id="photo"
						/>
					</div>
					<div>
						<label htmlFor="hashTag">해시태그</label>
						<input
							type="text"
							name="hashTag"
							id="hashTag"
							placeholder="해시태그를 입력해주세요"
						/>
					</div>
					<label htmlFor="genre">장르</label>
					<select name="genre" id="genre" defaultValue="none">
						<option value="none" disabled hidden>
							장르를 선택해주세요
						</option>
						<option value="dance">dance</option>
						<option value="pop">pop</option>
						<option value="k-pop">k-pop</option>
						<option value="indie">indie</option>
					</select>
					<div>
						<label htmlFor="description">설명</label>
						<textarea name="description" id="description" cols={30} rows={10} />
					</div>
					<div>
						<span>공개여부</span>
						<div>
							<input type="radio" value="true" name="public" />
							<span>공개</span>
						</div>
						<div>
							<input type="radio" value="false" name="public" />
							<span>비공개</span>
						</div>
					</div>
					<div>
						<button type="submit">등록</button>
						<button type="reset">취소</button>
					</div>
				</form>
			</section>
		</>
	);
}

export default ProductRegistration;
