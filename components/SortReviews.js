
import React from 'react';

const SortReviews = ({ onSortChange }) => {
  return (
    <div className="sort-reviews">
      <select 
        className="sort-select"
        onChange={(e) => onSortChange(e.target.value)}
        defaultValue="recent"
      >
        <option value="recent">Most Recent</option>
        <option value="highest">Highest to Lowest Rating</option>
        <option value="lowest">Lowest to Highest Rating</option>
      </select>
    </div>
  );
};

export default SortReviews;