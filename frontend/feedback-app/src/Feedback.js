// src/FeedbackForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const FeedbackForm = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0); // Default rating as 0
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const newFeedback = { phone, name, feedback, rating };
    console.log('Submitting feedback:', newFeedback); // Debugging statement

    try {
      const endpoint = 'http://localhost:5000/feedback';
      const response = await axios.post(endpoint, newFeedback);
      console.log('Server response:', response); // Debugging statement
      alert('Feedback submitted successfully!');
    } catch (error) {
      console.log(error.response.data.error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An error occurred while submitting the feedback.');
      }
    }
  };

  return (
    <div className="feedback-container">
      <h1>Thank you for visiting!</h1>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <hr />
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h2>Customer Feedback Form</h2>
        <hr />
        <div>
          <label>Phone:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}/>
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Feedback:</label>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
        </div>
        <div>
          <label>Rating:</label>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
