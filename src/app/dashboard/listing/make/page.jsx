"use client";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Input, Button, Spinner } from "@nextui-org/react";
import CustomModal from '@/components/block/modal';

export default function Make() {
    const [makeData, setMakeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMake, setNewMake] = useState("");
    const [newImage, setNewImage] = useState("");
    const [selectedMake, setSelectedMake] = useState(null);
    const [error, setError] = useState("");
    const [deleteMakeId, setDeleteMakeId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const apiEndpoint = "/api/listing/make";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setMakeData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMake = async (e) => {
        e.preventDefault();
        if (!newMake.trim() || !newImage.trim()) {
            setError("Category name and image URL are required");
            return;
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ make: newMake, image: newImage })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewMake("");
            setNewImage("");
            setError("");
            fetchData();
        } catch (error) {
            console.error("Error adding new make:", error);
            setError("Failed to add new category");
        }
    };

    const handleUpdateMake = async () => {
        if (!selectedMake || !newMake.trim() || !newImage.trim()) {
            setError("Select a make, and provide category name and image URL");
            return;
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedMake._id,
                    updateData: { make: newMake, image: newImage }
                })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewMake("");
            setNewImage("");
            setSelectedMake(null);
            setError("");
            fetchData();
        } catch (error) {
            console.error("Error updating make:", error);
            setError("Failed to update category");
        }
    };

    const handleDeleteMake = async (id) => {
        try {
            const response = await fetch(apiEndpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            fetchData();
        } catch (error) {
            console.error("Error deleting make:", error);
            setError("Failed to delete category");
        }
    };

    const openDeleteModal = (id) => {
        setDeleteMakeId(id);
        setIsDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteMakeId(null);
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteMake = () => {
        handleDeleteMake(deleteMakeId);
        closeDeleteModal();
    };

    if (loading) return <div className="flex w-full h-full items-center justify-center mt-60"> <Spinner color="primary" size="lg" /></div>;

    return (
        <div className="p-0 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:space-x-6">
                <div className="w-full sm:w-1/2 p-4 rounded-lg shadow-md mb-4 sm:mb-0">
                    <h2 className="text-xl font-bold mb-4">
                        {selectedMake ? "Update Make" : "Add New Make"}
                    </h2>
                    <form onSubmit={selectedMake ? (e) => { e.preventDefault(); handleUpdateMake(); } : handleAddMake}>
                        <Input
                            label="Make Brand Name"
                            labelPlacement="outside" type="text"
                            value={newMake}
                            onChange={(e) => setNewMake(e.target.value)}
                            placeholder="Tata"
                            className="p-2 w-full mb-4"
                        />
                        <Input
                            label="Make Logo Url"
                            labelPlacement="outside" type="text"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="https://image-vasu.jpg"
                            className="p-2 w-full mb-4"
                        />
                        <Button className="bg-black text-white" type="submit">
                            {selectedMake ? "Update" : "Add"}
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </form>
                </div>

                <div className="w-full sm:w-1/2 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Make List</h2>
                    <ul className="list-disc pl-0 md:pl-5 mb-4">
                        <li className="flex flex-wrap justify-between items-center px-5 py-2 mb-1">
                            <p className="flex-1">Image</p>
                            <p className="flex-1">Make</p>
                            <p className="flex-1 text-center">Edit</p>
                            <p className="flex-1 text-center">Delete</p>
                        </li>
                    </ul>
                    <ul className="list-disc pl-0 md:pl-5">
                        {makeData.map((makeItem) => (
                            <li key={makeItem._id} className="flex flex-wrap justify-between items-center px-5 py-2 mb-4 rounded-md bg-slate-50">
                                <img src={makeItem.image} alt={makeItem.make} className="bg-white w-14 h-14 object-cover mr-4 rounded-full shadow-md p-2" />
                                <p className="font-medium flex-1">{makeItem.make}</p>
                                <button
                                    onClick={() => {
                                        setSelectedMake(makeItem);
                                        setNewMake(makeItem.make);
                                        setNewImage(makeItem.image);
                                    }}
                                    className="h-8 w-8 shadow-inner rounded-full flex justify-center items-center bg-teal-50 flex-shrink-0 mb-2 sm:mb-0"
                                >
                                    <MdModeEdit />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(makeItem._id)}
                                    className="h-8 w-8 shadow-inner rounded-full flex justify-center items-center bg-red-50 flex-shrink-0"
                                >
                                    <MdDelete />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <CustomModal
                isOpen={isDeleteModalVisible}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteMake}
                title="Confirm Deletion"
            >
                <p>Are you sure you want to delete this make? This action cannot be undone.</p>
            </CustomModal>
        </div>
    );
}
