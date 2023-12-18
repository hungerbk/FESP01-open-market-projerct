import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MouseEventHandler } from "react";

interface SearchBarProps {
	onClick: MouseEventHandler<HTMLButtonElement>;
	searchRef?: React.LegacyRef<HTMLInputElement> | undefined;
	showable?: boolean;
}

interface DisplayProps {
	showable?: boolean;
}

const theme = createTheme({
	palette: {
		primary: { main: "#F5F2F5" },
	},
});

const StyledSearchBar = styled.form<DisplayProps>`
	display: ${(props) => (props.showable ? "block" : "none")};
	width: 1160px;
	height: auto;
	position: relative;

	label {
		display: ${Common.a11yHidden};
	}

	input {
		width: inherit;
		height: 80px;
		font-size: ${Common.font.size.lg};
		text-indent: 20px;
		border: 10px solid rgb(40, 40, 44, 0.8);
		border-radius: calc(100vh / 2);
		box-shadow: 0px 5px 5px rgb(40, 40, 44, 0.8);
		background-color: ${Common.colors.white};
	}

	button {
		width: 46px;
		height: 46px;
		background-color: ${Common.colors.emphasize};
		border: none;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 2%;

		& :first-of-type {
			position: absolute;
			top: 3px;
			left: 3px;
		}
	}
`;

function SearchBar({ onClick, searchRef, showable }: SearchBarProps) {
	return (
		<StyledSearchBar showable={showable}>
			<label htmlFor="searchBar">검색</label>
			<input
				type="text"
				id="searchBar"
				name="searchBar"
				ref={searchRef}
				placeholder={"검색어를 입력하세요."}
			/>
			<button type="button" onClick={onClick}>
				<ThemeProvider theme={theme}>
					<SearchIcon fontSize="large" color="primary" />
				</ThemeProvider>
			</button>
		</StyledSearchBar>
	);
}

export default SearchBar;
