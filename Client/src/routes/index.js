import OrderPage from "../page/OrderPage/OrderPage";
import CartPage from "../page/CartPage/CartPage";
import HomePage from "../page/HomePage/HomePage";
import ProductsPage from "../page/ProductsPage/ProductsPage";
import TypeProductPage from "../page/TypeProductPage/TypeProductPage";
import SignInPage from "../page/SignInPage/SignInPage";
import SignUpPage from "../page/SignUpPage/SignUpPage";
import ProductDetailsPage from "../page/ProductDetailsPage/ProductDetailsPage";
import Profile from "../page/Profile/Profile";
import AdminPage from "../page/AdminPage/AdminPage";
export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true
        
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/productDetails/:id',
        page: ProductDetailsPage,
        isShowHeader: true
    },
    {
        path: '/Profile-user',
        page: Profile,
        isShowHeader: true,
        isPrivate: false,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: true,
        isPrivate: true
    },
]