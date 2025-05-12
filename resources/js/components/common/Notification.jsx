import React, { useEffect, useState } from 'react';
import { BiBell } from 'react-icons/bi';
import { deleteNotification, fetchNotifications, readNotification } from '../../helpers/backend';
import dayjs from 'dayjs';
import { FaTrash } from 'react-icons/fa';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Dropdown, Menu, Badge } from 'antd';

window.Pusher = Pusher;
const echoInstance = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
});

const Notification = ({ user, layout }) => {
  const [notifications, setNotifications] = useState([]);
  const [userInteracted, setUserInteracted] = useState(false);
  useEffect(() => {
    if (!user?._id) return;

    fetchNotifications({ user_id: user._id }).then(({ data }) => {
      setNotifications(data);
    });

    const channel = echoInstance.channel(`notification.${user._id}`);
    channel.listen('.notify', (event) => {
      setNotifications((prevNotifications) => [event, ...prevNotifications]);

      if (userInteracted) {
        const audio = new Audio('./storage/sounds/notification.mp3');
        audio.play().catch((error) => console.error('Audio playback error:', error));
      }
    });

    return () => {
      echoInstance.leaveChannel(`notification.${user._id}`);
    };
  }, [user?._id, userInteracted]);

  const markAsRead = (id) => {
    readNotification({ id }).then(() =>
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      )
    );
  };

  const deleteNoti = (id) => {
    deleteNotification({ id }).then(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== id)
      );
    });
  };

  const handleUserInteraction = () => {
    setUserInteracted(true);
  };

  const unreadCount = notifications?.filter((notif) => !notif.read).length;

  const menu = (
    <Menu
      className="max-h-60 overflow-y-auto notification"
      items={
        notifications?.length === 0
          ? [
              {
                key: 'no-notifications',
                label: <div className="p-4 text-center">No new notifications</div>,
              },
            ]
          : notifications?.map((notification) => ({
              key: notification.id,
              label: (
                <div
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 cursor-pointer justify-between  w-full flex items-center gap-4 hover:bg-orange-100 transition duration-150 ease-in-out ${
                    notification.read ? 'text-black' : 'text-orange-600'
                  }`}
                > 
                <div className='flex gap-2'>
                  <img
                    src={notification.image ?? './storage/images/user.png'}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold">{notification.title}</p>
                    <p className="text-xs">{dayjs(notification.created_at).format('DD MMM YYYY')}</p>
                  </div>
                  </div>
                  <div
                    className="ml-auto text-gray-500 hover:text-orange-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNoti(notification.id);
                    }}
                  >
                    <FaTrash />
                  </div>
                </div>
              ),
            }))
      }
    />
  );

  return (
    <div onClick={handleUserInteraction} className="mt-[6px]" >
      <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
        <Badge count={user._id?unreadCount:''} offset={[-1, 1]} color="orange">
          <button className="relative text-2xl">
            <BiBell className={'text-white'} />
          </button>
        </Badge>
      </Dropdown>
    </div>
  );
};

export default Notification;
