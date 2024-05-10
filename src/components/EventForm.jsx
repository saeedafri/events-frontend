

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./Datepicker.css"


function EventForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notification: "Email",
      date: new Date()
    }
  });

  const notificationOptions = ["Email", "Slack"]; 
  const [showDescription, setShowDescription] = useState(false);
  const watchNotify = watch("notification");
  const startDate = watch("date");


  const handleDateChange = (e) => {
    const date = new Date(e);
    console.log("date ::", date)
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    setValue('date', formattedDate);
    console.log("formattedDate ::", formattedDate)
    
  }
  
  const onSubmit = (data) => {

    console.log(data);
    // Handle form submission logic here
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get(
  //         "https://backend-production-fada0.up.railway.app/api/locations/getAllLocationList"        );
  //       console.log("res ::", res.data);
  //       // const locationData = await res.json();
  //       // console.log("locationData ::", locationData);
  //     } catch (error) {
  //       console.error("error ::", error);
  //     }
  //   }
  //   fetchData();
  // },[])

  // watch all input field values 
  // useEffect(() => {
  //   watch((value,{name}) => {
  //     console.log("ddd",value,name)
  //   })
  // },[watch])

  

  return (
    <div className="max-w-2xl bg-white my-4 sm:my-20 shadow-lg rounded-md mx-4 sm:mx-auto px-4 sm:px-12 py-4 sm:py-16"
>
      <h2 className="text-xl font-bold mb-8">Create Event</h2>
      <form onSubmit={handleSubmit(onSubmit)} autoFocus>
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
              className="absolute mt-1 top-1/2 right-1 transform -translate-y-1/4 bg- border m- white hover:bg-gray-200 text-black font-semibold px-2 py-1  rounded focus:outline-none focus:shadow-outline text-sm"
            >
              {showDescription ? "Hide Description" : "Add Description"}
            </button>
            
          </div>
            {showDescription && (
              <Input
                label="Description"
                type="text"
                placeholder="Enter description"
                {...register("description")}
                errorMessage={errors.description?.message}
              />
            )}
        

            
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
              
              <div>
                <label
                  htmlFor="Date"
                  className="block text-sm font-medium mb-1">
                  Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(e) => handleDateChange(e)}
                  dateFormat="MMMM d, yyyy"
                className=" datepicker-input"
                  required
                />


              </div>

            <div>
              <Input
                label="Time"
                type="time"
                {...register("time", { required: "Time is required" })}
                  errorMessage={errors.time?.message}
                  className="py-5"
              />
            </div>

            <div >
              <Input
                label="Duration"
                type="number"
                {...register("duration", { required: "Duration is required" })}
                errorMessage={errors.duration?.message}
              />
            </div>
              

          </div>
          <div className="relative mb-2">

              <p className="w-fit text-xs text-gray-600 transform -translate-y-2">
              {watch("date") && watch("time") && watch("duration") ? `This event will take place on the ${watch("date")} from ${watch("time")} until ${watch("duration")} minutes` : ""}
              </p>
        </div>

          <div className="mb-4">
            <Input
              label="Location"
              type="text"
              placeholder="Choose Location"
              {...register("location")}
            />
          </div>

          <div className="mb-4">
            <Input
              label="Add Guests"
              type="text"
            placeholder="contact@example.com"
              {...register("guests")}
            />
          </div>

          <div className="grid sm:grid-cols-2 grid-cols-1  gap-4 mb-4 max-w-max">

            <div>
            <label
                htmlFor="Notification"
              className="block text-sm font-medium mb-2">
              Notification
              </label>
              <div className="flex w-max gap-1 rounded-md p-3 py-3 text-sm font-medium bg-custom-gray">
                {notificationOptions.map((option) => (
                  <label key={option} >
                    <input
                      type="radio"
                      value={option}
                      {...register("notification")}
                      className="hidden"
                    />
                    <span className={`text-m font-semibold rounded-md bg-custom-gray px-3 transition-transform ease-in-out   ${watchNotify === option ? "p-2 border bg-white border-black-300 " : ""}`}> {option} </span>
                  </label>
                ))}
              </div>
            </div>
            
            
            <div>
              <label
                htmlFor="reminder"
                className="block text-sm font-medium mb-2">
                Set Reminder
              </label>
              <select
                id="reminder"
                name="reminder"
                {...register("reminder")}
                className="w-full px-1 py-2 text-sm rounded-md bg-custom-gray border focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="30 minute before event">30 minute before event</option>
                <option value="1 hour before event">1 hour before event</option>
                <option value="2 hour before event">2 hour before event</option>
                <option value="3 hour before event">3 hour before event</option>
                <option value="4 hour before event">4 day before event</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
         
          >
            
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;
