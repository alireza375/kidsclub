import Index from "../pages/Index";
import About from "../pages/about";
import Service from "../pages/service";
import ServiceDetails from "../pages/serviceDetails";
import Blog from "../pages/blog";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import SingleBlog from "../pages/SingleBlog";
import Event from "../pages/Event";
import Cart from "../pages/Cart";
import Wish from "../pages/Wish";
import CheckOut from "../pages/CheckOut";
import InstructorDetails from "../components/service/service_tab/instructorDetails";
import EventDetail from "../pages/EventDetail";
import PrivacyPolicy from "../pages/privacey-policy";
import TermsAndConditions from "../pages/terms&conditions";
import Contact from "../pages/contact";
import PaymentSuccessPage from "../pages/paymentSuccess";
import PaymentFailed from "../pages/paymentFailed";
import Package from "../pages/Package";
import Gallery from "../pages/gallery";
import ForgetPassword from "../pages/forgetPassword";
import ResetPassword from "../pages/resetPassword";

export const PublicRoutes = [
    {
        path: "/",
        component: Index,
    },
    {
        path: "/about",
        component: About,
    },
    {
        path: "/service",
        component: Service,
    },
    {
        path: "/service/:id",
        component: ServiceDetails,
    },
    {
        path: "/instructor/:id",
        component: InstructorDetails,
    },
    {
        path: "/shop",
        component: Shop,
    },
    {
        path: "/shop/:id",
        component: ProductDetails,
    },
    {
        path: "/blog",
        component: Blog,
    },
    {
        path: "/blog/:id",
        component: SingleBlog,
    },
    {
        path: "/package",
        component: Package,
    },
    {
        path: "/gallery",
        component: Gallery,
    },
    {
        path: "/event",
        component: Event,
    },
    {
        path: "/event/:id",
        component: EventDetail,
    },
    {
        path: "/cart",
        component: Cart,
    },
    {
        path: "/wishlist",
        component: Wish,
    },
    {
        path: "/checkout",
        component: CheckOut,
    },
    {
        path: "/privacy-policy",
        component: PrivacyPolicy,
    },
    {
        path: "/terms-and-conditions",
        component: TermsAndConditions,
    },
    {
        path: "/contact",
        component: Contact,
    },
    {
        path: "/payment/success",
        component: PaymentSuccessPage,
    },
    {
        path: "/payment/failed",
        component: PaymentFailed,
    },
    {
        path: "/payment/cancel",
        component: PaymentFailed,
    },
    {
        path: "forget-password",
        component: ForgetPassword,
    },
    {
        path: "/reset-password",
        component: ResetPassword,
    },
];
