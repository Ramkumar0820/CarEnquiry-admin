"use client";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Input, Button, Spinner } from "@nextui-org/react";
import CustomModal from '@/components/block/modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Types() {
    const [typesData, setTypesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newType, setNewType] = useState("");
    const [newImage, setNewImage] = useState("");
    const [selectedType, setSelectedType] = useState(null);
    const [error, setError] = useState("");
    const [deleteTypeId, setDeleteTypeId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const typesApiEndpoint = "/api/listing/type";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(typesApiEndpoint);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setTypesData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddType = async (e) => {
        e.preventDefault();
        if (!newType.trim() || !newImage.trim()) {
            setError("Type name and image URL are required");
            return;
        }

        try {
            const response = await fetch(typesApiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: newType, image: newImage })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewType("");
            setNewImage("");
            setError("");
            fetchData();
            toast.success("Type added successfully!");
        } catch (error) {
            console.error("Error adding new type:", error);
            setError("Failed to add new type");
            toast.error("Failed to add new type");
        }
    };

    const handleUpdateType = async () => {
        if (!selectedType || !newType.trim() || !newImage.trim()) {
            setError("Select a type and provide a new name and image URL");
            return;
        }

        try {
            const response = await fetch(typesApiEndpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedType._id,
                    updateData: { type: newType, image: newImage }
                })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewType("");
            setNewImage("");
            setSelectedType(null);
            setError("");
            fetchData();
            toast.success("Type updated successfully!");
        } catch (error) {
            console.error("Error updating type:", error);
            setError("Failed to update type");
            toast.error("Failed to update type");
        }
    };

    const handleDeleteType = async (id) => {
        try {
            const response = await fetch(typesApiEndpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            fetchData();
            toast.success("Type deleted successfully!");
        } catch (error) {
            console.error("Error deleting type:", error);
            setError("Failed to delete type");
            toast.error("Failed to delete type");
        }
    };

    const openDeleteModal = (id) => {
        setDeleteTypeId(id);
        setIsDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteTypeId(null);
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteType = () => {
        handleDeleteType(deleteTypeId);
        closeDeleteModal();
    };

    if (loading) return <div className="flex w-full h-full items-center justify-center mt-60"> <Spinner color="primary" size="lg" /></div>;

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="w-full lg:w-1/2 p-4 rounded-lg shadow-md bg-white">
                    <h2 className="text-xl font-bold mb-10">
                        {selectedType ? "Update Type" : "Add New Type"}
                    </h2>
                    <form onSubmit={selectedType ? (e) => { e.preventDefault(); handleUpdateType(); } : handleAddType}>
                        <Input
                            label="Type Name"
                            labelPlacement="outside"
                            type="text"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            placeholder="Type Name"
                            className="w-full mb-6"
                        />
                        <Input
                            label="Type Image URL"
                            labelPlacement="outside"
                            type="text"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="https://image-url.jpg"
                            className="w-full mb-6"
                        />
                        <Button className="w-full bg-black text-white" type="submit">
                            {selectedType ? "Update" : "Add"}
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </form>
                </div>

                <div className="w-full lg:w-1/2 p-4 rounded-lg shadow-md bg-white">
                    <h2 className="text-xl font-bold mb-4">Type List</h2>
                    <ul className="list-disc pl-5 space-y-4">
                        {typesData.map((typeItem) => (
                            <li key={typeItem._id} className="flex justify-between items-center p-4 rounded-md bg-slate-50">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={typeItem.image}
                                        alt={typeItem.type}
                                        className="bg-white w-14 h-14 object-contain object-center rounded-full shadow-md"
                                    />
                                    <p className="font-medium">{typeItem.type}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedType(typeItem);
                                            setNewType(typeItem.type);
                                            setNewImage(typeItem.image);
                                        }}
                                        className="h-8 w-8 shadow-inner rounded-full flex justify-center items-center bg-teal-50">
                                        <MdModeEdit />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(typeItem._id)}
                                        className="h-8 w-8 shadow-inner rounded-full flex justify-center items-center bg-red-50">
                                        <MdDelete />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <CustomModal
                isOpen={isDeleteModalVisible}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteType}
                title="Confirm Deletion">
                <p>Are you sure you want to delete this type? This action cannot be undone.</p>
            </CustomModal>

            <ToastContainer />
        </div>
    );
}
