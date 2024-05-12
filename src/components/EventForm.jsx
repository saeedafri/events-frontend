import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import "./Select.css";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";

function EventForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      guestNotificationType: "Email",
      eventDate: new Date(),
      attachments: [],
      eventDescription: "",
      eventLocationName: "",
      eventGuestIDs: [],
    },
  });

  const [showNoUserFound, setShowNoUserFound] = useState(false);
  const [addedGuests, setAddedGuests] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [loading, setLoading] = useState(false);
  const notificationOptions = ["Email", "Slack"];
  const [showDescription, setShowDescription] = useState(false);
  const watchNotify = watch("guestNotificationType");
  const startDate = watch("eventDate");
  const startTime = watch("eventTime");
  const startDuration = watch("eventDuration");
  const [locations, setLocations] = useState([]);
  const [guestList, setGuestList] = useState([]);
  const [completeGuestList, setCompleteGuestList] = useState([]);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const guestListRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        guestListRef.current &&
        !guestListRef.current.contains(event.target)
      ) {
        setInputValue("");
        setGuestList([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationResponse, completeGuestResponse] = await Promise.all([
          fetch("/api/locations/getAllLocationList"),
          fetch("/api/guests/getAllGuestsList"),
        ]);
        if (!locationResponse.ok || !completeGuestResponse.ok) {
          throw new Error("One or more API requests failed");
        }

        const [locationData, completeGuestData] = await Promise.all([
          locationResponse.json(),
          completeGuestResponse.json(),
        ]);

        setLocations(locationData);
        setCompleteGuestList(completeGuestData);
        console.log("data ::", locationData);
        console.log("Guest data ::", completeGuestData);
      } catch (error) {
        console.error("location list not fetched :: ", error);
      }
    };
    fetchData();
  }, []);

  const handleGuestSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    if (searchValue) {
      const filteredList = completeGuestList.filter(
        (guest) =>
          guest.guestName.toLowerCase().includes(searchValue) &&
          !watch("eventGuestIDs").includes(guest.id)
      );
      setGuestList(filteredList);
      setShowNoUserFound(searchValue !== "" && filteredList.length === 0);
    } else {
      setGuestList([]);
    }
  };
  const handleGuestSelection = (guestId) => {
    const selectedGuest = guestList.find((guest) => guest.id === guestId);
    setSelectedGuest(selectedGuest);
    setInputValue(selectedGuest.guestName);
    setGuestList([]);
  };

  const handleAddGuest = () => {
    if (selectedGuest) {
      const guestIds = watch("eventGuestIDs"); // Get current eventGuestIDs
      if (!guestIds.includes(selectedGuest.id)) {
        // Check for duplicate ID
        setValue(
          "eventGuestIDs",
          [...guestIds, selectedGuest.id] // Add selected guest ID if not already present
        );
        setAddedGuests((prevAddedGuests) => [
          ...prevAddedGuests,
          selectedGuest,
        ]);
      }
      setInputValue("");
      setSelectedGuest(null); // Clear selected guest after adding (optional)
    }
  };

  const handleRemoveGuest = (guestId) => {
    setAddedGuests((prevAddedGuests) =>
      prevAddedGuests.filter((guest) => guest.id !== guestId)
    );
    const updatedGuestIds = watch("eventGuestIDs").filter(
      (id) => id !== guestId
    );
    setValue("eventGuestIDs", updatedGuestIds);
  };

  const calculation = useMemo(() => {
    const date = new Date(startDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    console.log("startTime ::", startTime);
    let [hours, minutes] = startTime ? startTime.split(":") : [0, 0];
    let period = +hours >= 12 ? "PM" : "AM";
    console.log("period ::", period);

    hours = hours % 12;
    hours = hours ? (hours < 10 ? "0" + hours : hours) : 12;
    minutes = minutes < 10 ? minutes : minutes;

    console.log(
      "hours ::",
      hours,
      " :: ",
      minutes,
      " :: ",
      "period ::",
      period
    );

    // Convert eventDuration from minutes to hours and minutes
    const totalMinutes = parseInt(startDuration);
    const durationHours = Math.floor(totalMinutes / 60);
    const durationMinutes = totalMinutes % 60;

    // Calculate the end time in hours and minutes
    let endHours = parseInt(hours) + durationHours;
    let endMinutes = parseInt(minutes) + durationMinutes;

    // Adjust the hours and minutes if necessary
    if (endMinutes >= 60) {
      endHours += 1;
      endMinutes -= 60;
    }
    if (endHours > 12) {
      endHours -= 12;
      period = period === "AM" ? "PM" : "AM";
    }

    // Convert the end hours and minutes to strings
    endHours = endHours < 10 ? "0" + endHours : endHours;
    endMinutes = endMinutes < 10 ? "0" + endMinutes : endMinutes;

    return `${date} from ${hours}:${minutes} ${period} until ${endHours}:${endMinutes} ${period}`;
  }, [startDate, startTime, startDuration]);

  console.log("calculation ::", calculation);

  const onSubmit = async (data) => {
    // Add data.attachments = watch("attachments"); if needed
    try {
      setLoading(true);
      const response = await fetch("/api/events/createEvents", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set the content type
        body: JSON.stringify(data), // Convert data to JSON
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Event created successfully:", responseData);
      toast.success("Event created successfully");
      setLoading(false);
      navigate("/");
      // Handle successful response (e.g., show a success message, redirect)
    } catch (error) {
      toast.error("Failed to create event");
      setLoading(false);
      console.error("Error creating event:", error);
      // Handle errors (e.g., show an error message)
    }
  };

  // const handleRemove = (event, index) => {
  //   event.preventDefault();
  //   const newFiles = [...watch('attachments')];
  //   newFiles.splice(index, 1);
  //   setValue('attachments', newFiles);
  // };

  // const handleFileSelect = (event) => {
  //   const files = Array.from(event.target.files).map(file => ({
  //     name: file.name,
  //     size: file.size / 1024 / 1024, // convert size to MB
  //     progress: 0, // Initial progress is 0
  //   }));
  //   setValue('attachments', [...watch('attachments'), ...files]); // update 'attachments' field
  // };

  return (
    <div className="max-w-2xl bg-white my-4 sm:my-20 shadow-lg rounded-md mx-4 sm:mx-auto px-4 sm:px-12  py-4 sm:py-16 relative">
      <div className=" mb-12 sm:mb-4 ">
        <Link
          to="/"
          className="absolute top-4 left-4 bg-custom-gray hover:ring-blue-500 hover:ring-1 text-black font-bold py-2 px-4 rounded-md border"
        >
          <GoArrowLeft />
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-8">Create Event</h2>

      <form onSubmit={handleSubmit(onSubmit)} autoFocus autoComplete="on">
        <div className="grid grid-cols-1 gap-4">
          <div className="mb-4 relative">
            <Input
              label="Event Name"
              type="text"
              placeholder="Enter event name"
              {...register("eventName", { required: "Event name is required" })}
              errorMessage={errors.eventName?.message}
            />
            <button
              type="button"
              onClick={() => setShowDescription(!showDescription)}
              className="absolute  top-9 right-1 transform -translate-y-1/4 bg- border m- white hover:bg-gray-200 text-black font-semibold px-2 py-1  rounded focus:outline-none focus:shadow-outline text-sm"
            >
              {showDescription ? "Hide Description" : "Add Description"}
            </button>
          </div>
          {showDescription && (
            <Input
              label="Description"
              type="text"
              placeholder="Enter description"
              {...register("eventDescription")}
              errorMessage={errors.description?.message}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
            <div>
              <label htmlFor="Date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <DatePicker
                id="Date"
                selected={startDate}
                onChange={(e) => setValue("eventDate", e)}
                dateFormat="MMMM d, yyyy"
                className=" datepicker-input"
                required
              />
            </div>

            <div>
              <Input
                label="Time"
                type="time"
                {...register("eventTime", { required: "Time is required" })}
                errorMessage={errors.eventTime?.message}
              />
            </div>

            <div>
              <label
                htmlFor="Duration"
                className="block text-sm font-medium mb-1"
              >
                Duration
              </label>
              <select
                {...register("eventDuration", {
                  required: "Duration is required",
                })}
                className="w-full px-1 py-2 text-sm rounded-md bg-custom-gray border focus:outline-none hover:ring-1 hover:ring-blue-500"
                id="Duration"
              >
                <option value="" className="hidden">
                  Select Duration
                </option>
                <option value="30">30 min</option>
                <option value="60">1 h </option>
                <option value="90">1h 30m</option>
                <option value="120">2h </option>
              </select>
              {errors.eventDuration?.message && (
                <p className="text-red-500 text-xs italic">
                  {errors.eventDuration?.message}
                </p>
              )}
            </div>
          </div>

          {/* description of the time till the event */}
          <div className="relative mb-2">
            <p className="w-fit text-xs font-semibold text-gray-600 transform -translate-y-2">
              {watch("eventDate") &&
              watch("eventTime") &&
              watch("eventDuration")
                ? `This event will take place on the ${calculation} `
                : ""}
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="Location"
              className="block text-sm font-medium mb-1"
            >
              Location
            </label>
            <select
              {...register("eventLocationName")}
              className="w-full text-sm bg-custom-gray px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="Location"
            >
              <option value="" className="hidden">
                Select Location...
              </option>

              {locations.length > 0 ? (
                locations.map((location) => (
                  <option
                    key={location.id || location}
                    value={location.name}
                    className="max-w-max p-8 flex-wrap cursor-pointer gap-4 m-8"
                  >
                    {`${location.venue}, ${location.city}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Locations Available
                </option>
              )}
            </select>
          </div>

          {/* guest list */}

          <div className="mb-4 relative guest-list-item">
            <label
              htmlFor="Add Guests"
              className="block text-sm font-medium mb-1"
            >
              Add Guests
            </label>
            <input
              type="text"
              className="w-full text-sm bg-custom-gray px-3 py-2 rounded-md border focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => {
                setInputValue(e.target.value);
                handleGuestSearch(e);
              }}
              value={inputValue}
              ref={inputRef}
            />
            <button
              type="button"
              onClick={handleAddGuest}
              className="absolute top-9 right-1 transform -translate-y-1/4 bg- border m- white hover:bg-gray-200 text-black font-semibold px-3 py-1 rounded focus:outline-none focus:shadow-outline text-sm"
            >
              Add
            </button>
            <div
              className="absolute z-50 mt-2 w-full bg-custom-gray rounded-md shadow-lg"
              ref={guestListRef}
            >
              {inputValue === "" ? null : guestList.length > 0 ? (
                guestList.map((guest) => (
                  <div
                    key={guest.id}
                    className="px-3 py-2 hover:bg-blue-600 hover:rounded-md hover:text-white text-md font-semibold mb-1 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleGuestSelection(guest.id);
                      setInputValue(guest.guestName);
                      setGuestList([]);
                    }}
                  >
                    {guest.guestName}
                  </div>
                ))
              ) : showNoUserFound ? (
                <div className="px-3 py-2 text-md font-semibold">
                  No user found
                </div>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {addedGuests.map((guest) => (
                <span
                  key={guest.id}
                  className="bg-blue-600 text-sm text-white font-semibold px-2 py-1 rounded-md mr-2 flex items-center w-fit"
                >
                  {guest.guestName}
                  <button
                    type="button"
                    className="ml-2 items-center  font-semibold "
                    onClick={() => handleRemoveGuest(guest.id)}
                  >
                    <MdCancel />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notification and remainder  */}

          <div className="grid sm:grid-cols-2 grid-cols-1  gap-4 mb-4 max-w-max">
            <div>
              <label
                htmlFor="guestNotificationType"
                className="block text-sm font-medium mb-2"
              >
                Notification
              </label>
              <div className="flex w-max gap-1 rounded-md p-3 py-3 text-sm font-medium bg-custom-gray">
                {notificationOptions.map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      value={option}
                      {...register("guestNotificationType")}
                      className="hidden"
                    />
                    <span
                      className={`text-m font-semibold rounded-md bg-custom-gray px-3 transition-transform ease-in-out   ${
                        watchNotify === option
                          ? "p-2 border bg-white border-black-300 "
                          : ""
                      }`}
                    >
                      {" "}
                      {option}{" "}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="reminder"
                className="block text-sm font-medium mb-2"
              >
                Set Reminder
              </label>
              <select
                id="reminder"
                {...register("reminderDurationMinutes")}
                className="w-full px-1 py-2 rounded-md bg-custom-gray border focus:outline-none hover:ring-1 hover:ring-blue-500 text-sm"
              >
                <option value="" className="hidden">
                  Select remainder
                </option>
                <option value="30">30 minute before event</option>
                <option value="60">1 hour before event</option>
                <option value="120">2 hour before event</option>
                <option value="180">3 hour before event</option>
                <option value="240 ">4 hour before event</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
