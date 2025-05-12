<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\EventResource;
use App\Http\Resources\Admin\TicketResource;
use App\Http\Resources\Common\UserResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Event;
use App\Models\JoinEvent;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\Auth;

class EventService
{
    public function makeData($request)
    {

        $data = [
            'title' => json_encode($request->get('title')),
            'image' => $request->get('image'),
            'organizer' => $request->get('organizer') ? json_encode($request->get('organizer')) : null,
            'description' => $request->get('description') ? json_encode($request->get('description')) : null,
            'event_date' => $request->get('event_date'),
            'start_time' => $request->get('start_time') . ':00',
            'end_time' => $request->get('end_time') . ':00',
            'members' => $request->get('members') ?: null,
            'instructor_id' => $request->get('instructor_id') ?? null,
            'location' => $request->get('location'),
            'price' => $request->get('price') ?? 0.00,
            'discount' => $request->get('discount') ?? 0.00,
            'type' => $request->get('type'),
            'discount_type' => $request->get('discount_type') ?? null,
            'event_category' => $request->get('category') ? json_encode($request->get('category')) : null,
            'capacity' => $request->get('capacity') ?? null,
            'contact_address' => $request->get('contact_address') ?? null,
            'contact_email' => $request->get('contact_email') ?? null,
            'contact_phone' => $request->get('contact_phone') ?? null,
        ];

        return $data;
    }


    // All Event
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id'; // Default sorting column
        $dir = $request->dir ?? 'desc'; // Default sorting direction
        $per_page = $request->limit ?? PERPAGE_PAGINATION; // Default pagination limit
        $lang = $request->langCode ?? 'en'; // Default language

        $query = Event::query();

        // Apply search filter
        $query->when(!empty($request->search), function ($q) use ($request, $lang) {
            $searchTerm = strtolower($request->search);

            $q->where(function ($q) use ($searchTerm, $lang) {
                $q->whereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`title`, '$.{$lang}'))) LIKE ?",
                    ['%' . $searchTerm . '%']
                )
                ->orWhereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`description`, '$.{$lang}'))) LIKE ?",
                    ['%' . $searchTerm . '%']
                );
            });
        });

        // Fetch a single event by ID
        if ($request->id) {
            $event = Event::where('is_active', 1)->find($request->id);

            if (!$event) {
                return errorResponse(__('Event not found.'), 404);
            }

            return successResponse(__('Event fetched successfully.'), EventResource::make($event));
        }

        // Apply sorting and pagination
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        // Return formatted response
        return successResponse(
            __('Event fetched successfully.'),
            new BasePaginationResource(EventResource::collection($data))
        );
    }


    // Public index
    public function publicIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';

        // Query for active events with valid date
        $query = Event::query()
            ->where('is_active', 1)
            ->where('event_date', '>=', Carbon::now()->format('Y-m-d'));

        // Apply search filter
        $query->when(!empty($request->search), function ($q) use ($request, $lang) {
            $q->where(function ($q) use ($request, $lang) {
                $q->where("title->$lang", 'like', '%' . $request->search . '%');
            });
        });

        // Fetch a specific event by ID if provided
        if ($request->id) {
            $event = Event::where('is_active', 1)
                ->where('event_date', '>=', Carbon::now()->format('Y-m-d'))
                ->find($request->id);

            if (!$event) {
                return errorResponse(__('Event not found.'));
            }

            return successResponse(__('Event fetched successfully.'), EventResource::make($event));
        }

        // Fetch paginated data
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Event fetched successfully.'), new BasePaginationResource(EventResource::collection($data)));
    }




    // add event news
    public function storeNotice($request)
    {
        $event = Event::find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }
        $event->event_news = $request->notices;
        $event->save();
        return successResponse(__('Event news updated successfully.'));
    }

    // delete event news
    public function deleteNotice($request)
    {
        $event = Event::find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }
        $event->event_news = $request->updatedNotices;
        $event->save();
        return successResponse(__('Event news deleted successfully.'));
    }

    // Single Event
    public function show($request)
    {
        $event = Event::find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }

        return successResponse(__('Event fetched successfully.'), EventResource::make($event));
    }
    public function publicShow($request)
    {
        $event = Event::where('is_active', 1)->find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }

        return successResponse(__('Event fetched successfully.'), EventResource::make($event));
    }

    // Store Event
    public function store($request)
    {
        // Use makeData to prepare the event data
        $data = $this->makeData($request);
        // return $data;
        try {
            // Check if an event with the same title and event date already exists
            $existingEvent = Event::where('title', json_encode($request->get('title')))
                ->whereDate('event_date', $data['event_date'])
                ->first();

            if ($existingEvent) {
                return errorResponse(__('An event with the same title and date already exists.'));
            }

            // Create the new event
            Event::create($data);

            return successResponse(__('Event created successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Update Event
    public function update($request)
    {
        $event = Event::find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }

        $data = [
            'title' => $request->get('title') ? json_encode($request->get('title')) : $event->title,
            'image' => $request->get('image') ?? $event->image,
            'organizer' => $request->get('organizer') ? json_encode($request->get('organizer')) : $event->organizer,
            'description' => $request->get('description') ? json_encode($request->get('description')) : $event->description,
            'event_date' => $request->get('event_date') ?? $event->event_date,
            'start_time' => $request->get('start_time') ?? $event->start_time,
            'end_time' => $request->get('end_time') ?? $event->end_time,
            'members' => $request->get('members') ?? $event->members,
            'instructor_id' => $request->get('instructor_id') ?? $event->instructor_id,
            'location' => $request->get('location') ?? $event->location,
            'price' => $request->get('price') ?? $event->price,
            'discount' => $request->get('discount') ?? $event->discount,
            'type' => $request->get('type') ?? $event->type,
            'discount_type' => $request->get('discount_type') ?? $event->discount_type,
            'event_category' => $request->get('category') ? json_encode($request->get('category')) : $event->event_category,
            'capacity' => $request->get('capacity') ?? $event->capacity,
            'contact_address' => $request->get('contact_address') ?? $event->contact_address,
            'contact_email' => $request->get('contact_email') ?? $event->contact_email,
            'contact_phone' => $request->get('contact_phone') ?? $event->contact_phone,
        ];
        try {
            // Update the event
            $event->update($data);

            return successResponse(__('Event updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    public function changeStatus($request)
    {
        $event = Event::find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }

        $event->is_active = $event->is_active == 1 ? 0 : 1;
        $event->save();
        return successResponse(__('Event updated successfully.'));
    }


    // Delete event
    public function delete($request)
    {
        try {
            $event = Event::find($request->id);
            if (! $event) {
                return errorResponse(__('Event not found.'));
            }
            $event->delete();
            removeFile($event->image);
            return successResponse(__('Event deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // interested users
    public function interest($request)
    {
        $event = Event::find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }
        $user_id = Auth::guard('checkUser')->user();
        $user = User::find($user_id->id);
        $alreay_interested_users = $event->interested_users;
        if (in_array($user->id, $alreay_interested_users)) {
            // remove user from interested users
            $alreay_interested_users = array_diff($alreay_interested_users, [$user->id]);
            $event->update(['total_interested_users' => count($alreay_interested_users), 'interested_users' => $alreay_interested_users]);
            return successResponse(__('we are sorry to inform you that you have been removed from the list of interested users.'));
        }
        // total interested users
        $total_interested_users = count($event->interested_users) + 1;
        // add user to interested users
        array_push($alreay_interested_users, $user->id);
        $event->update(['total_interested_users' => $total_interested_users, 'interested_users' => $alreay_interested_users]);
        return successResponse(__('Thanks for your interest.'));
    }

    public function interestedUsers($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $event = Event::find($request->id);
        if (! $event) {
            return errorResponse(__('Event not found.'));
        }
        // if se
        $interested_users = $event->interested_users;
        $users = User::whereIn('id', $interested_users)->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Event interested users fetched successfully.'), new BasePaginationResource(UserResource::collection($users)));
    }

    public function ticketList($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $tickets = JoinEvent::where('event_id', $request->id)->with('user');
        if($request->search){
            $tickets = $tickets->where('id', 'like', '%'.$request->search.'%')
            ->orWhere('ticket', 'like', '%'.$request->search.'%');
        }
        $tickets = $tickets->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Event tickets fetched successfully.'), new BasePaginationResource(TicketResource::collection($tickets)));

    }
}
