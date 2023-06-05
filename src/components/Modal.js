import React from 'react';
// import './Modal.css'; // Import the CSS file for styling

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null; // If the Modal is not open, return null to prevent rendering
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <span>&times;</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
