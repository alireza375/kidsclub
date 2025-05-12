<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotifyUser implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $message;
    public $id;
    public $user_id;
    public $type;
    public $image;
    public $date;
    public function __construct($id,$message, $user_id, $type, $image, $date)
    {
        $this->message = $message;
        $this->id = $id;
        $this->user_id = $user_id;
        $this->type = $type;
        $this->image = $image;
        $this->date = $date;
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastWith()
    {
        return [
            'id' => $this->id,
            'title' => $this->message,
            'user_id' => $this->user_id,
            'type' => $this->type,
            'image' => $this->image,
            'date' => $this->date
        ];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('notification.'.$this->user_id),
        ];
    }

    public function broadcastAs()
    {
        return 'notify';
    }
}
