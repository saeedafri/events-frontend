import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Duration() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <label>Date</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="MMMM d, yyyy"
      />
    </div>
  );
}

export default Duration;
