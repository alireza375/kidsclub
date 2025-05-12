import { del, get, newPost, post, postForm, put } from "./api";

export const fetchTranslations = (data) => get("/language/translations", data);
export const fetchPublicLanguages = (data) => get("/language/languages", data);


// user login and register
export const login = (data) => post("/login", data);
export const registration = (data) => post("/registration", data);
export const sendOtp = (data) => newPost("/send-otp", data);
export const verifyOtp = (data) => newPost("/verify-otp", data);
export const fetchUser = (data) => get("/user", data);
export const resetPassword=(data)=>newPost('/reset-password',data);


// user
export const updateUser = (data) => newPost("/user", data);
export const changePassword = (data) => put("/update-password", data);
// setting
export const fetchSiteSettings = (data) => get("/settings", data)
export const fetchPublicSiteSettings = (data) => get("/settings/public", data)
export const fetchAdminSettings = (data) => get("/settings", data)
export const updateAdminSettings = (data) => post("/settings", data)

// file upload
export const postSingleImage = (data) => postForm("/upload-single", data)
export const postMultipleImage = (data) => postForm("/upload-multiple", data)
export const removeFile = (data) => postForm("/delete-file", data)

// pages
export const fetchSinglePage = (data) => get("/page", data);
export const fetchPageList=(data)=>get("/page/list",data);
export const postPage = (data) => newPost("/page", data)
export const deletePage = (data) => del("/page", data)

// Languages
export const fetchAdminLanguages = (data) => get("/language/list/admin", data)
export const translateLanguage = (data) => get("/language/list", data)
export const postLanguage = (data) => newPost("/language", data)
export const updateLanguage = (data) => put("/language", data)
export const deleteLanguage = (data) => del("/language", data)

// Payment methods
export const fetchPaymentMethods = (data) => get("/payment/method/list", data)
export const postPaymentMethod = (data) => post("/payment/method", data)
export const updatePaymentMethod = (data) => put("/payment/method", data)
export const changePaymentMethod = (data) => post("/payment/method/status", data)
export const deletePaymentMethod = (data) => del("/payment/method", data)

// Faq
export const fetchFaq = (data) => get("/faq/list", data)
export const fetchSingleFaq = (data) => get("/faq", data)
export const updateFaq = (data) => put("/faq/update", data)
export const postFaq = (data) => newPost("/faq", data)
export const deleteFaq = (data) => del("/faq", data)

// Testimonial
export const fetchTestimonial = (data) => get("/testimonial", data)
export const postTestimonial = (data) => newPost("/testimonial", data)
export const deleteTestimonial = (data) => del("/testimonial", data)
export const updateStatusTestimonial = (data) => post("/testimonial/status", data)


// Contact
export const postContactUs = (data) => post("/contact", data);
export const fetchContact = (data) => get("/contact/list", data);
export const fetchContactDetail = (data) => get("/contact", data);
export const delContact = (data) => del("/contact", data);
export const replyContact = (data) => post("/contact/reply", data);

// Currency
export const fetchCurrency = (data) => get("/currency/list", data);
export const postCurrency = (data) => newPost("/currency", data);
export const updateCurrency = (data) => put("/currency", data);
export const deleteCurrency = (data) => del("/currency/delete", data);

// admin cupon
export const fetchCupons = (data) => get("/coupon/admin/list", data);
export const postCupon = (data) => post("/coupon", data);
export const updateCupon = (data) => put("/coupon/update", data);
export const delCupon = (data) => del("/coupon", data);


// admin dashboard
export const fetchDashboard = (data) => get("/dashboard/admin", data);

// user dashboard

export const fetchUserDashboard = (data) => get("/dashboard/user", data);


// admin advertisement

export const fetchAdvertisements = (data) => get("/advertisement/list", data);
export const fetchSingleAdvertisement = (data) => get("/advertisement", data);
export const postAdvertisement = (data) => newPost("/advertisement", data);
export const updateAdvertisement = (data) => put("/advertisement", data);
export const delAdvertisement = (data) => del("/advertisement", data);
export const publicAdvertisement = (data) => get("/advertisement/active", data);

//Mail settings
export const fetchEmailSettings = (data) => get("/mail-credential", data)
export const postEmailSettings = (data) => newPost("/mail-credential", data)

// Coach
export const fetchCoaches = (data) => get("/admin/coach", data)
export const postCoach = (data) => post("/add/coach", data)
export const updateUserStatus = (data) => post("/update/user/status", data);
export const publicCoachList=(data)=>get('public/trainer/list',data);
export const delSingleCoach = (data) => del("/admin/coach", data)

// Users
export const fetchUsers = (data) => get("/user/list", data)
export const fetchSingleUser = (data) => get("/user", data)
export const delSingleuser = (data) => del("/admin/user", data)

//Product
export const postProduct=(data)=>newPost("/product",data);
export const updateProduct=(data)=>put("/product/update",data);
export const fetchAllProduct=(data)=>get("/product/admin/list",data);
export const getSingleProduct=(data)=>get("/product",data);
export const deleteProduct=(data)=>del("/product",data);
export const postPublish=(data)=>post("/product/publish",data);
export const allProductCategorylist=(data)=>get('/product/category/list',data);
export const delProductCategory=(data)=>del('/product/category',data);
export const postProductCategory=(data)=>newPost('/product/category',data);
export const getProductCategory=(data)=>get('/product/category',data);
export const updateProductCategory=(data)=>put('/product/category',data);
export const publicProductList=(data)=>get('/product/public/list',data);
export const getProductDetails=(data)=>get('/product/details',data);
//Wishlist
export const postWishList=(data)=>post('/wishlist/add',data);
export const fetchWishList=(data)=>get('/wishlist/list',data);
//cart
export const postCart=(data)=>newPost('/product/cart',data);
export const fetchCartlist=(data)=>get('/product/cart/list',data);
export const delCart=(data)=>del('/product/cart',data);
//checkout
export const postOrder=(data)=>newPost('/order/product',data);
export const fetchOrderList=(data)=>get('/admin/order/list',data);
export const delOrder =(data) => del('/order/delete',data);
// Category
export const fetchBlogCategories = (data) => get("/blog/category/list", data)
export const postBlogCategory = (data) => newPost("/blog/category", data)
export const updateBlogCategory = (data) => put("/blog/category/update", data)
export const deleteBlogCategory = (data) => del("/blog/category", data)

// apply coupon
export const applyCoupon = (data) => post("/coupon/apply", data)

// Blog
export const fetchBlogs = (data) => get("/blog/list", data)
export const fetchAdminSingleBlog = (data) => get("/blog", data)
export const fetchPublicBlogs = (data) => get("/blog/user/list", data)
export const fetchSingleBlog = (data) => get("/blog/details", data)
export const postBlog = (data) => newPost("/blog", data)
export const updateBlog = (data) => put("/blog/update", data)
export const togglePublishBlog = (data) => post("/blog/toggle-publish", data)
export const togglePopularBlog = (data) => post("/blog/toggle-popular", data)
export const deleteBlog = (data) => del("/blog", data)

// Blog comment
export const fetchBlogComments = (data) => get("/blog/comment", data)
export const postBlogComment = (data) => newPost("/comment", data)
export const deleteBlogComment = (data) => del("/comment", data)

// Galllary
export const fetchGalleries = (data) => get("/gallery/list", data)
export const postGallery = (data) => post("/gallery", data)
export const deleteGallery = (data) => del("/gallery", data);
export const publicGalleryList=(data)=>get('/gallery/public/list',data);

// Event
export const fetchEvents = (data) => get("/event", data)
export const postEvent = (data) => newPost("/event", data)
export const updateEventStatus = (data) => put("/event/change-status", data)
export const updateEvent = (data) => put("/event", data)
export const deleteEvent = (data) => del("/event", data)
export const fetchEventTickets = (data) => get("/event/tickets/list", data)

export const postEventNotice = (data) => newPost("event/notice", data)
export const deleteEventNotice = (data) => del("event/notice", data)

// join event
export const joinEvent = (data) => post("/join/event", data)
export const joinEventList = (data) => get("/join/event/list", data)


// public events
export const fetchPublicEvents = (data) => get("/event/list", data)
export const fetchinstractor = (data) => get('/service/instructor/details',data);


// service
export const fetchServices = (data) => get("/service/admin/list", data)
export const fetchSingleService = (data) => get("/service/admin/details", data)
export const postService = (data) => newPost("/service", data)
export const updateService = (data) => put("/service", data)
export const deleteService = (data) => del("/service", data)


// service Notice
export const serviceNotices = (data) => get("/enroll/service/notice/list", data)
export const ServiceNotice = (data) => get("/service/notice", data)

// join service
export const enrollService = (data) => post("/enroll/service", data)

// service faq
export const fetchServiceFaqs = (data) => get("/service/faq/admin/list", data)
export const fetchPublicServiceFaqs = (data) => get("/service/faq/list", data)
export const postServiceFaq = (data) => newPost("/service/faq", data)
export const updateServiceFaq = (data) => put("/service/faq", data)
export const deleteServiceFaq = (data) => del("/service/faq", data)

// service faq
export const fetchServiceNotices = (data) => get("/service/notice/list", data)
export const postServiceNotice = (data) => newPost("/service/notice", data)
export const updateServiceNotice = (data) => put("/service/notice", data)
export const deleteServiceNotice = (data) => del("/service/notice", data)

// public services
export const fetchPublicServices = (data) => get("/service/list", data)
export const fetchPublicSingleService = (data) => get("/service/details", data)

// User service list
export const fetchUserServiceList = (data) => get("/service/peruser/list", data)

// payment method list
export const fetchPaymentMethodList = (data) => get("/payment/method/public-list", data)

// Child
export const fetchChildList = (data) => get("/children/list", data)
export const postChild = (data) => newPost("/children", data)
export const updateChild = (data) => put("/children", data)
export const deleteChild = (data) => del("/children", data)

// joinbychild
export const joinByChild = (data) => post("/service/join-by-user", data)
export const addServiceReview = (data) => newPost("service/review", data)

// order list
export const fetchUserOrderList = (data) => get("/order/product/list", data)
export const postProductReview = (data) => newPost("/product/review", data)
export const fetchOrderDetails = (data) => get("/admin/order/details", data)
export const changeOrderStatus = (data) => post("/order/change-status", data)


// packege
export const fetchAdminPackages = (data) => get("/package/admin/list", data)
export const fetchPackages = (data) => get("/package/list", data)
export const postPackage = (data) => newPost("/package", data)
export const updatePackage = (data) => put("/package", data)
export const deletePackage = (data) => del("/package", data)
export const buyPackage=(data)=>newPost('/buy/package',data);
export const userPackageList=(data)=>get('/user/package/list',data);
export const enrollPackageList=(data)=>get('/package/user/list',data);
export const deleteEnrollPackage=(data)=>del('enroll/package',data);

// user
export const fetchAdminUsers = (data) => get("/user/admin/list", data)


// Coach Members
export const fetchCoachMembers = (data) => get("/children/trainer/list", data)
export const fetchCoacheService = (data) => get("/service/trainer/list", data)

// Service Review
export const deleteServiceReview = (data) => del("/service/review", data)
//user testimonial
export const fetchPublicTestimonial=(data)=>get("/testimonial/list",data);
export const fetchServiceEnrollList=(data)=>get("/enroll/service/admin/list",data);
export const deleteProductReview = (data) => del("/product/review", data)
export const CoachDashboardLayout = (data) => get("/dashboard/trainer", data);

//newsletter
export const postNewsLetter=(data)=>post("/newsletter",data);
export const getNewsLetter=(data)=>get('/newsletter',data);
export const deleteNewsLetter=(data)=>del('/newsletter',data);

// Notification
export const readNotification = (data) => post("/notifications/read", data);
export const deleteNotification = (data) => del("/notifications/delete", data);
export const fetchNotifications = (data) => get("/notifications", data);
