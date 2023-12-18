import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import { Outlet, useLocation } from "react-router-dom";

function RootLayout() {
	const location = useLocation();
	const noHeaderFooterRoutes = ["/signin", "/signup", "/useredit/:userId"];

	const shouldDisplayHeaderFooter = !noHeaderFooterRoutes.some((route) =>
		location.pathname.includes(route.replace("/:userId", "")),
	);
    
	return (
		<>
			{shouldDisplayHeaderFooter && <Header />}
			<main>
				<Outlet />
			</main>
			{shouldDisplayHeaderFooter && <Footer />}
		</>
	);
}

export default RootLayout;
