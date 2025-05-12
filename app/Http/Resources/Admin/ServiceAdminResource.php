<?php

namespace App\Http\Resources\Admin;

use App\Models\EnrollService;
use App\Models\Review;
use App\Models\ServiceFaq;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceAdminResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $instructorDetails = User::find($this->instructor_id);

        $serviceFaqs = ServiceFaq::where('service_id', $this->id)->get();

        $review = Review::where('service_id', $this->id)->get();
        $ratingCounts = [
            'one_star' => $review->where('rating', 1)->count(),
            'two_star' => $review->where('rating', 2)->count(),
            'three_star' => $review->where('rating', 3)->count(),
            'four_star' => $review->where('rating', 4)->count(),
            'five_star' => $review->where('rating', 5)->count(),
        ];

        $parents = EnrollService::where('service_id', $this->id)->with('user')->get()
            ->map(function ($enrollment) {
                return [
                    'id' => optional($enrollment->user)->id,
                    'name' => optional($enrollment->user)->name,
                    'image' => optional($enrollment->user)->image,
                ];
            });

        // Fetching the children details for the service
        $children = EnrollService::where('service_id', $this->id)
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
            'members' => $children ? $children->count() : 0,
            'instructor' => $instructorDetails ? [
                'id' => $instructorDetails->id,
                'name' => $instructorDetails->name,
                'image' => $instructorDetails->image,
                'role' => $instructorDetails->role == 2 ? 'coach' : 'admin',
            ] : null,

            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'discount' => $this->discount,
            'discount_type' => $this->discount_type,
            'category' => json_decode($this->category),
            'session' => $this->session,
            'duration' => $this->duration,
            'capacity' => $this->capacity,
            'service_faq' => $serviceFaqs->map(function ($faq) {
                return [
                    'question' => json_decode($faq->question),
                    'answer' => json_decode($faq->answer),
                ];
            }),
            'is_active' => $this->is_active == 1 ? true : false,
            'joined_users' => $parents,
            'children' => $children,
            'avg_rating' => $review->avg('rating'),
            'rating_counts' => $ratingCounts,
            'review' => $review->map(function ($review) {
                return [
                    'user_name' => optional($review->user)->name,
                    'user_image' => optional($review->user)->image,
                    'comment' => $review->comment,
                    'rating' => $review->rating,
                    'created_at' => $review->created_at,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

}
