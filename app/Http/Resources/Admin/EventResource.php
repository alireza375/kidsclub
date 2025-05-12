<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Common\UsersShortDetails;
use App\Models\JoinEvent;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {


         // Fetch user details based on member IDs, avoiding empty queries
         $membersDetails = !empty($memberIds)
             ? User::whereIn('id', $memberIds)->get(['id', 'name', 'image'])
             : [];

        // calculate discount percentage
        if($this->type == "paid"){
            if($this->discount_type == "percentage"){
                $discountprice = $this->price - ($this->price * ($this->discount / 100));
            }else{
                $discountprice = $this->price - $this->discount;
            }

        }else{
            $discountprice = null;
        }

        return [
            'id' => $this->id,
            'title' => json_decode($this->title),  // Decoding title from JSON format
            'image' => $this->image,
            'description' => json_decode($this->description),
            'event_date' => $this->event_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'duration' => $this->duration($this->start_time, $this->end_time),
            'members' => $membersDetails,
            'ticket_sold' => JoinEvent::where(['event_id' => $this->id, 'status' => 'paid'])->count(),
            'discount_price' => $discountprice,
            'organizer' => $this->organizer ? json_decode($this->organizer) : null,
            'location' => $this->location,
            'price' => $this->price,
            'discount' => $this->discount,
            'discount_type' => $this->discount_type,
            'category' => $this->event_category ? json_decode($this->event_category) : null,
            'capacity' => $this->capacity,
            'type' => $this->type,
            'contact_address' => $this->contact_address,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'event_news' => $this->event_news ? json_decode($this->event_news) : [],
            'is_active' => $this->is_active == 1 ? true : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function duration($start, $end)
    {
        $start = new DateTime($start);
        $end = new DateTime($end);
        $interval = $start->diff($end);
        return $interval->format('%h hours');
    }
}
