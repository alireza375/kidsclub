import Blog from "../components/admin/blog/Blog";
import BlogDetails from "../components/admin/blog/BlogDetails";
import Coach from "../components/admin/Coach";
import Contact from "../components/admin/contact/Contact";
import ContactReply from "../components/admin/contact/ContactReply";
import Coupon from "../components/admin/Coupon";
import Currency from "../components/admin/Currency";
import Dashboard from "../components/admin/Dashboard";
import MailSetting from "../components/admin/email-setting/MailSetting";
import AddEvent from "../components/admin/event/AddEvent";
import EditEvent from "../components/admin/event/EditEvent";
import EventDetail from "../components/admin/event/EventDetails";
import EventPage from "../components/admin/event/EventPage";
import Faq from "../components/admin/Faq";
import Gallery from "../components/admin/Gallery";
import Languages from "../components/admin/Language";
import PageSettings from "../components/admin/page-settings/PageSetting";
import PaymentMethod from "../components/admin/PaymentMethod";
import AddProduct from "../components/admin/product/add/addProduct";
import AdminEditProduct from "../components/admin/product/edit/editProduct";
import AdminProductList from "../components/admin/product/product";
import ViewProduct from "../components/admin/product/view/viewProduct";
import Profile from "../components/admin/Profile";
import AddService from "../components/admin/service/AddService";
import EditService from "../components/admin/service/EditService";
import ServicePage from "../components/admin/service/ServicePage";
import Settings from "../components/admin/Settings";
import Testimonial from "../components/admin/Testimonial";
import Translations from "../components/admin/translations";
import EventTickets from "../components/admin/event/EventTickets";
import Package from "../components/admin/Package";
import ServiceDetails from "../components/admin/service/ServiceDetails";
import Users from "../components/admin/Users";
import Order from "../components/admin/order/Order";
import OrderDetails from "../components/admin/order/OrderDetails";
import Notice from "../components/admin/service/Notice";
import Advertisement from "../components/admin/Advertisement";
import ProductReviews from "../components/admin/product/ProductReviews";
import BlogFrom from "../components/admin/blog/BlogFrom";
import AddBlog from "../components/admin/blog/AddBlog";
import EditBlog from "../components/admin/blog/EditBlog";
import NewsLetter from "../components/admin/newsletter";

export const AdminRoutes = [
    {
        path: "dashboard",
        component: Dashboard,
    },
    {
        path: "coachs",
        component: Coach,
    },
    {
        path: "users",
        component: Users,
    },
    {
        path: "product",
        component: AdminProductList,
    },
    {
        path: "product/add",
        component: AddProduct,
    },
    {
        path: "product/edit/:id",
        component: AdminEditProduct,
    },
    {
        path: "product/view/:id",
        component: ViewProduct,
    },
    {
        path: "product/review/:id",
        component: ProductReviews,
    },
    {
        path: "orders",
        component: Order,
    },
    {
        path: "order/:id",
        component: OrderDetails,
    },
    {
        path: "events",
        component: EventPage,
    },
    {
        path: "event/:id",
        component: AddEvent,
    },
    {
        path: "event/edit/:id",
        component: EditEvent,
    },
    {
        path: "event/details/:id",
        component: EventDetail,
    },
    {
        path: "event/tickets/:id",
        component: EventTickets,
    },
    {
        path: "packages",
        component: Package,
    },
    {
        path: "blogs",
        component: Blog,
    },
    {
        path: "blog/view/:id",
        component: BlogDetails,
    },
    {
        path: "blog/add",
        component: AddBlog,
    },
    {
        path: "blog/edit/:id",
        component: EditBlog,
    },
    {
        path: "settings",
        component: Settings,
    },
    {
        path: "payment-methods",
        component: PaymentMethod,
    },
    {
        path: "languages",
        component: Languages,
    },
    {
        path: "languages/:languageId",
        component: Translations,
    },
    {
        path: "page-settings",
        component: PageSettings,
    },
    {
        path: "faq",
        component: Faq,
    },
    {
        path: "gallery",
        component: Gallery,
    },
    {
        path: "testimonials",
        component: Testimonial,
    },
    {
        path: "contacts",
        component: Contact,
    },
    {
        path: "contacts/:id",
        component: ContactReply,
    },
    {
        path: "currencies",
        component: Currency,
    },
    {
        path: "coupons",
        component: Coupon,
    },
    {
        path: "mail-settings",
        component: MailSetting,
    },
    {
        path: "profile",
        component: Profile,
    },
    {
        path: "service",
        component: ServicePage,
    },
    {
        path: "service/:id",
        component: AddService,
    },
    {
        path: "service/edit/:id",
        component: EditService,
    },
    {
        path: "service/view/:id",
        component: ServiceDetails,
    },
    {
        path: "service/notice/:id",
        component: Notice,
    },
    {
        path: "advertisement",
        component: Advertisement,
    },
    {
        path:'newsletter',
        component: NewsLetter
    }
];
