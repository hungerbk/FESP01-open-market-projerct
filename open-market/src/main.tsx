import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RecoilRoot>
			<Toaster />
			<App />
		</RecoilRoot>
	</React.StrictMode>,
);
