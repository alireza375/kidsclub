import React from "react";
import { Button, Switch } from "antd";
import { FaClock, FaMapPin, FaRegClock } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { useI18n } from "../../providers/i18n";

const events = [
    {
        id: 1,
        date: { day: "Fri", number: "29" },
        time: "09:30 am - 11:30 pm",
        location: "Sonadanga, Khulna",
        title: "Adventure Kids Club: Fun & Discovery",
        participants: 4,
    },
    {
        id: 2,
        date: { day: "Sun", number: "01", month: "December" },
        time: "09:30 am - 11:30 pm",
        location: "Sonadanga, Khulna",
        title: "Adventure Kids Club: Fun & Discovery",
        participants: 4,
    },
    {
        id: 3,
        date: { day: "Fri", number: "29" },
        time: "09:30 am - 11:30 pm",
        location: "Sonadanga, Khulna, Khulna",
        title: "Adventure Kids Club: Fun & Discovery Kids Club: Fun & Discovery",
        participants: 4,
    },
    {
        id: 4,
        date: { day: "Fri", number: "29" },
        time: "09:30 am - 11:30 pm",
        location: "Sonadanga, Khulna",
        title: "Adventure Kids Club: Fun & Discovery",
        participants: 4,
    },
    {
        id: 5,
        date: { day: "Fri", number: "29" },
        time: "09:30 am - 11:30 pm",
        location: "Sonadanga, Khulna",
        title: "Adventure Kids Club: Fun & Discovery",
        participants: 4,
    },
];

export default function Events() {
    const i18n = useI18n();
    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">{i18n?.t("Events")}</h1>
                <div className="flex items-center gap-2">
          <span className="text-sm">Upcoming</span>
          <Switch />
          <span className="text-sm text-muted-foreground">Show off</span>
        </div>
            </div>

            <div className="space-y-4">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="md:flex items-center justify-between p-4 border rounded-lg"
                    >
                        <div className="flex items-center gap-8">
                            <div className="text-center min-w-[60px] pl-5 pr-10 border-r-2 font-nunito">
                                <div className="text-secondary font-medium text-2xl">
                                    {event.date.day}
                                </div>
                                <div className="text-[32px] text-primary  font-bold">
                                    {event.date.number}
                                </div>
                                {/* {event.date.month && (
                  <div className="text-sm text-muted-foreground">
                    {event.date.month}
                  </div>
                )} */}
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-col gap-3  text-muted-foreground font-nunito">
                                    <div className="flex items-center gap-1">
                                        <FaRegClock className="w-4 h-4" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 -ml-[2px]">
                                        <IoLocationOutline className="size-5" />
                                        <span>
                                            {event.location.length > 20
                                                ? event.location.slice(0, 20) +
                                                  "..."
                                                : event.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 md:my-0 my-5">
                            <h2 className="font-semibold font-nunito text-secondary">
                                {event?.title.length > 30
                                    ? event.title.slice(0, 30) + "..."
                                    : event.title}
                            </h2>

                            <div className="flex -space-x-2">
                                {Array.from({ length: event.participants }).map(
                                    (_, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                                        >
                                            <img
                                                src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
                                                alt="Participant"
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <button className="px-3 py-1 md:w-auto w-full bg-primary hover:bg-secondary ease-in-out duration-300 text-white rounded-md">
                            {i18n?.t("View")}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
