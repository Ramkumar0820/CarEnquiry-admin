import React from 'react';
import { Button } from "@nextui-org/react";

function CustomModal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4">{title}</h2>
                <div className="mb-4">{children}</div>
                <div className="flex justify-end space-x-4">
                    <Button
                        color='success'
                        className='text-white'
                        onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        color='danger'>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CustomModal;
