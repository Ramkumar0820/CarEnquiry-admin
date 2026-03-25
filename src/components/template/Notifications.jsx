"use client";
import { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notification");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // const onInterval = setInterval(() => {
    //   fetchNotifications();
    // }, 15000);

    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    //   clearInterval(onInterval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications?.data?.filter((n) => !n.read).length;

  const patchAction = async (action, id) => {
    try {
      const res = await fetch("/api/notification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      if (res.ok) {
        // refresh
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Notification patch failed", err);
    }
  };

  const handleClick = async (notif) => {
    // mark clicked (and read) then optionally navigate
    await patchAction("click", notif._id);
    // if the notification contains a URL or data, frontend can route here
    // currently just close dropdown
    setOpen(false);
  };

  const handleClearAll = async () => {
    await patchAction("clearAll");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative text-gray-700 hover:text-black"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <div className="font-semibold">Notifications</div>
            {notifications?.data?.length !== 0 && (
              <div className="text-sm text-blue-500 cursor-pointer" onClick={handleClearAll}>
                Clear All
              </div>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            )}

            {!loading && notifications?.data?.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
            )}

            {!loading && notifications?.data?.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm flex justify-between items-start ${n.read ? "" : "bg-gray-50"}`}
              >
                <div>
                  <div className="text-gray-800">{n.message}</div>
                  {n.data && n.data.productName && (
                    <div className="text-xs text-gray-500">{n.data.productName}</div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* <div className="p-2 text-center text-sm text-gray-600">Double-click a notification to mark unread</div> */}
        </div>
      )}
    </div>
  );
}
