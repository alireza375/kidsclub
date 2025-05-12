<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BuyPackage;
use App\Models\Children;
use App\Models\Coupon;
use App\Models\Currency;
use App\Models\EnrollService;
use App\Models\Event;
use App\Models\JoinEvent;
use App\Models\OrderProduct;
use App\Models\Service;
use App\Models\ServiceNotice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    //admin dashboard
    public function getDashboard()
    {
        $allCurrencies = Currency::all()->keyBy('code');

        $upcomingEvents = Event::where('event_date', '>', now())
            ->orderBy('event_date', 'asc')
            ->get();

        // Fetch top-rated services
        $topRatedServices = Service::select('services.name')
            ->leftJoin('reviews', 'services.id', '=', 'reviews.service_id')
            ->selectRaw('AVG(reviews.rating) as avg_rating')
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('avg_rating')
            ->limit(5)
            ->get()
            ->map(function ($service) {
                return [
                    'name' => json_decode($service->name),
                    'rating' => round($service->avg_rating, 2),
                ];
            });

        $data = [
            'totals' => [
                'users' => User::where('role', USER)->count(),
                'activeUsers' => User::where('role', USER)->where('status', 1)->count(),
                'totalPackageSell' => BuyPackage::where('status', 'accepted')->count(),
                'coaches' => User::where('role', COACH)->count(),
                'services' => Service::count(),
                'orders' => OrderProduct::count(),
                'events' => Event::where('is_active', 1)->count(),
                'paidSubscriptions' => BuyPackage::where('status', 'accepted')->count(),
                'coupons' => Coupon::where('status', true)->count(),
                'enrolledServices' => EnrollService::where('is_paid', 1)->count(),
            ],
            'orders' => [
                'completed' => OrderProduct::where('status', 'completed')->count(),
                'pending' => OrderProduct::where('status', 'pending')->count(),
                'recent' => OrderProduct::with('user')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($order) use ($allCurrencies) {
                        return [
                            'id' => (string) $order->id,
                            'order_id' => $order->order_id,
                            'total' => intval($order->total),
                            'status' => $order->status,
                            'currencySymbol' => $this->getCurrencySymbol($allCurrencies, $order->currency),
                            'payment' => [
                                'method' => $order->method,
                                'status' => $order->status,
                                'amount' => intval($order->total),
                            ],
                            'created_at' => $order->created_at->toISOString(),
                            'user' => [
                                'name' => $order->user ? $order->user->name : null,
                                'email' => $order->user ? $order->user->email : null,
                            ],
                        ];
                    }),
            ],
            'income' => [
                'total' => OrderProduct::where('status', 'completed')->sum('total'),
                'monthly' => OrderProduct::where('status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->sum('total'),
            ],
            'upcoming' => [
                'events' => $upcomingEvents->map(function ($event) {
                    return [
                        'title' => json_decode($event->title, true) ?? $event->title,
                        'date' => $event->event_date,
                    ];
                }),
                'birthdays' => Children::where(function ($query) {
                    // Birthdays in the current month, from today onward
                    $query->whereMonth('dob', now()->month)
                          ->whereDay('dob', '>=', now()->day);
                })->orWhere(function ($query) {
                    // Birthdays in the next month
                    $query->whereMonth('dob', now()->addMonth()->month);
                })->orderByRaw('MONTH(dob), DAY(dob)')
                // Only fetch birthdays for the next 2 months
                  ->limit(2)
                  ->get()
                  ->map(function ($child) {
                      return [
                          'name' => $child->name,
                          'dob' => \Carbon\Carbon::parse($child->dob)->format('Y-m-d'),
                      ];
                  }),
            ],

            'topRatedServices' => $topRatedServices,
            'byStatus' => [
                'accepted' => [
                    'count' => OrderProduct::where('status', 'completed')->count(),
                    'total' => intval(OrderProduct::where('status', 'completed')->sum('total')),
                ],
            ],
        ];

        return successResponse('Successfully fetched dashboard data.', $data);

    }

    // get currency symbol by code
    private function getCurrencySymbol($currencies, $code): ?string
    {
        return $currencies[$code]->symbol ?? null;
    }

    //trainer dashboard
    public function trainerDashboard(Request $request)
    {
        $userId = Auth::guard('checkUser')->id();

        if (! $userId) {
            return errorResponse(__('User not found.'));
        }
        $notices = ServiceNotice::where('user_id', $userId)->get();

        $serviceIds = Service::where('instructor_id', $userId)->pluck('id');

        // Fetch the latest 5 child IDs enrolled by the user
        $latestChildIds = EnrollService::whereIn('service_id', $serviceIds)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->pluck('child_id');

        // Fetch child details from the children table
        $childrenDetails = Children::whereIn('id', $latestChildIds)->get()->map(function ($child) {
            return [
                'id' => $child->id,
                'name' => $child->name,
                'image' => $child->image,
                'joined_at' => $child->created_at->toISOString(),
            ];
        });

        // Fetch the events
        $events = Event::where('event_date', '>', now())
        ->orderBy('event_date', 'asc')->take(5)
        ->get(['title', 'image', 'event_date']);
        $latestEvents = $events;

        $data = [
            'totalServices' => Service::where('instructor_id', $userId)->count(),
            'totalStudents' => EnrollService::whereIn('service_id', Service::where('instructor_id', $userId)->pluck('id'))
                ->distinct('child_id')->count(),
            'notices' => $notices->map(function ($notice) {
                return [
                    'title' => json_decode($notice->title),
                    'description' => json_decode($notice->description),
                    'service_id' => json_decode(Service::find($notice->service_id)->name),
                    'is_active' => $notice->is_active,
                    'created_at' => $notice->created_at->toISOString(),
                    'updated_at' => $notice->updated_at->toISOString(),
                ];
            }),
            'latestChildren' => $childrenDetails,
            'latestEvents' => $latestEvents,
        ];

        return successResponse(__('Dashboard fetched successfully.'), $data);

    }

    //user dashboard
    public function userDashboard(Request $request)
    {
        // Retrieve the authenticated user's ID directly
        $userId = Auth::guard('checkUser')->id();

        if (! $userId) {
            return errorResponse(__('User not found.'));
        }

        //fetch $orders
        $orders = OrderProduct::where('user_id', $userId)->latest()->take(5)->get();
        $orderDetails = OrderProduct::whereIn('id', $orders->pluck('id'))->get();

        //fetch service
        $service = EnrollService::where('user_id', $userId)->latest()->take(3)->get();
        $serviceDetails = Service::whereIn('id', $service->pluck('service_id'))->get();

        // Fetch the events
        $events = JoinEvent::where('user_id', $userId)->latest()->take(3)->get();
        $eventDetails = Event::whereIn('id', $events->pluck('event_id'))
            ->where('event_date', '>', now())->get();

        $data = [
            'totalServices' => $service->count(),
            'upcomingEventsCount' => $eventDetails->count(),
            'totalOrders' => $orderDetails->count(),
            'recentOrders' => $orderDetails->map(function ($orderDetails): array {
                return [
                    'order_id' => $orderDetails->order_id,
                    'product' => json_decode($orderDetails->items),
                    'status' => $orderDetails->status,
                    'order_date' => $orderDetails->created_at->toISOString(),
                ];
            }),
            'upcomingEvents' => $eventDetails->map(function ($eventDetails): array {
                return [
                    'title' => json_decode($eventDetails->title),
                    'image' => $eventDetails->image,
                    'event_date' => $eventDetails->event_date,
                    'location' => $eventDetails->location,
                    'status' => $eventDetails->is_active == 1 ? true : false,
                ];
            }),
            'services' => $serviceDetails->map(function ($serviceDetails): array {
                return [
                    'id' => $serviceDetails->id,
                    'name' => json_decode($serviceDetails->name),
                    'image' => $serviceDetails->image,
                    'is_active' => $serviceDetails->is_active == 1 ? true : false,
                    'created_at' => $serviceDetails->created_at->toISOString(),
                    'updated_at' => $serviceDetails->updated_at->toISOString(),
                ];
            }),
        ];

        return successResponse(__('Dashboard fetched successfully.'), $data);

    }
}
