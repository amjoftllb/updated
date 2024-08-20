import React, { useState } from "react";

function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">This is a Modal</h2>
        <p className="mb-4">This is a simple modal built with Tailwind CSS.</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Close Modal
        </button>
      </div>
    </div>
  );
}

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => setModalIsOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Open Modal
      </button>

      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </div>
  );
}

export default App;

