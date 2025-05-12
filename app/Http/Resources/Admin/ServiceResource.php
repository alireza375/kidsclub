<?php

namespace App\Http\Resources\Admin;

use App\Models\EnrollService;
use App\Models\Review;
use App\Models\ServiceFaq;
use App\Models\ServiceNotice;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $instructorDetails = User::find($this->instructor_id);
        // Retrieving related notices and FAQs for the service
        $serviceNotices = ServiceNotice::where('service_id', $this->id)->get();
        $serviceFaqs = ServiceFaq::where('service_id', $this->id)->get();

        $review = Review::where('service_id', $this->id)->get();
        $ratingCounts = [
            'one_star' => $review->where('rating', 1)->count(),
            'two_star' => $review->where('rating', 2)->count(),
            'three_star' => $review->where('rating', 3)->count(),
            'four_star' => $review->where('rating', 4)->count(),
            'five_star' => $review->where('rating', 5)->count(),
        ];

        $joinedUsers = EnrollService::where('service_id', $this->id)
            ->whereNotNull('child_id')
            ->with('child')->get()
            ->map(function ($enrollment) {
                return [
                    'id' => optional($enrollment->child)->id,
                    'name' => optional($enrollment->child)->name,
                    'image' => optional($enrollment->child)->image,
                ];
            });


        return [
            'id' => $this->id,
            'name' => json_decode($this->name),
            'title' => json_decode($this->title),
            'description' => json_decode($this->description),
            'image' => $this->image,
            'instructor' => [
                'id' => optional($instructorDetails)->id,
                'name' => optional($instructorDetails)->name,
                'image' => optional($instructorDetails)->image,
                'role' => optional($instructorDetails)->role == 2 ? 'coach' : 'admin',
                'facebook' => optional($instructorDetails)->facebook,
                'twitter' => optional($instructorDetails)->twitter,
                'linkedin' => optional($instructorDetails)->linkedin,
                'instagram' => optional($instructorDetails)->instagram,
            ],
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'discount' => $this->discount,
            'discount_type' => $this->discount_type,
            'category' => json_decode($this->category),
            'session' => $this->session,
            'duration' => $this->duration,
            'capacity' => $this->capacity,
            'service_notice' => $serviceNotices->map(function ($notice) {
                return [
                    'title' => json_decode($notice->title),
                    'description' => json_decode($notice->description),
                ];
            }),
            'service_faq' => $serviceFaqs->map(function ($faq) {
                return [
                    'question' => json_decode($faq->question),
                    'answer' => json_decode($faq->answer),
                ];
            }),
            'is_active' => $this->is_active == 1 ? true : false,
            'joined_users' => $joinedUsers,
            'avg_rating' => number_format($review->avg('rating'),1),
            'rating_counts' => $ratingCounts, // Add rating counts here
            'review' => $review->map(function ($review) {
                return [
                    'id' => $review->id ?? null,
                    'user_name' => $review->user->name ?? null,
                    'user_image' => $review->user->image ?? null,
                    'comment' => $review->comment ?? null,
                    'rating' => $review->rating ?? null,
                    'created_at' => $review->created_at ?? null
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
