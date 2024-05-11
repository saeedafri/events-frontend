import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner.jsx";

function Homepage() {
  const [events, setEvents] = useState([]); // State to store events
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "https://backend-production-fada0.up.railway.app/api/events/getAllEventsList"
        );
        const data = await res.json();
        console.log(data);
        const newData = data.map((event) => {
          let [h, m] = event.eventTime.split(":");
          let eventTime12Hour = `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;

          const convertToHoursAndMinutes = `${Math.floor(
            event.eventDuration / 60
          )}h ${
            event.eventDuration % 60 ? `${event.eventDuration % 60}m` : ""
          }`;

          return {
            ...event,
            eventDate: new Date(event.eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            eventTime: eventTime12Hour,
            eventDuration: convertToHoursAndMinutes,
          };
        });

        setEvents(newData.reverse());
      } catch (error) {
        console.log("Fetch Posts Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      {loading ? (
        <div className=" m-auto  max-w-2xl h-[75vh]  bg-white my-4 sm:my-20 shadow-lg rounded-md mx-4 sm:mx-auto px-4 sm:px-12 py-4 sm:py-16 relative flex justify-center items-center place-content-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className=" max-w-2xl   bg-white my-4 sm:my-20 shadow-lg rounded-md mx-4 sm:mx-auto px-4 sm:px-12 py-4 sm:py-16 relative">
            <h1 className="text-xl font-bold mt-12 sm:mt-4">Events</h1>
            <div className="absolute top-2 right-2 p-4 bg-white">
              <Link
                to="/create-event"
                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Event
              </Link>
            </div>
            <ul className="">
              {events.length > 0 &&
                events.map((event) => (
                  <li
                    key={event.id}
                    className="bg-custom-gray p-4 m-4 
              border rounded-md shadow-md "
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3  sm:items-center gap-4 items-center">
                      <div className=" text-sm font-medium bg-white w-fit p-2 border rounded-md">
                        <p>{event.eventDate}</p>
                        <p className="text-center">{event.eventTime}</p>
                      </div>

                      <div className=" text-sm font-medium mb-2">
                        <p>{event.eventName}</p>
                        <p>{event.eventDescription}</p>
                      </div>

                      <div className="grid justify-start sm:justify-end text-center text-sm font-medium">
                        <p className="text-center ">{event.eventDuration}</p>
                        <p>{event.eventLocationName}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

export default Homepage;
