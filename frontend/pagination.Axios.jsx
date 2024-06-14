import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  const [items, setItems] = useState([]); // State to store fetched items
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const fetchItems = async (page) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${itemsPerPage}`
      );
      setItems(response.data);

      // Assuming the API sends total count of items in headers
      const totalItems = response.headers['x-total-count'];
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Posts List</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="p-4 border rounded shadow-sm">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
