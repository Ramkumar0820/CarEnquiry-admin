"use client";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Input, Button, Spinner } from "@nextui-org/react";
import CustomModal from '@/components/block/modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Features() {
    const [featuresData, setFeaturesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newFeature, setNewFeature] = useState("");
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [error, setError] = useState("");
    const [deleteFeatureId, setDeleteFeatureId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const featuresApiEndpoint = "/api/listing/features";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(featuresApiEndpoint);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setFeaturesData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFeature = async (e) => {
        e.preventDefault();
        if (!newFeature.trim()) {
            setError("Feature is required");
            return;
        }

        try {
            const response = await fetch(featuresApiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ feature: newFeature })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewFeature("");
            setError("");
            fetchData();
            toast.success("Feature added successfully!");
        } catch (error) {
            console.error("Error adding new feature:", error);
            setError("Failed to add new feature");
            toast.error("Failed to add new feature");
        }
    };

    const handleUpdateFeature = async () => {
        if (!selectedFeature || !newFeature.trim()) {
            setError("Select a feature and provide a new feature name");
            return;
        }

        try {
            const response = await fetch(featuresApiEndpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedFeature._id,
                    updateData: { feature: newFeature }
                })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewFeature("");
            setSelectedFeature(null);
            setError("");
            fetchData();
            toast.success("Feature updated successfully!");
        } catch (error) {
            console.error("Error updating feature:", error);
            setError("Failed to update feature");
            toast.error("Failed to update feature");
        }
    };

    const handleDeleteFeature = async (id) => {
        try {
            const response = await fetch(featuresApiEndpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            fetchData();
            toast.success("Feature deleted successfully!");
        } catch (error) {
            console.error("Error deleting feature:", error);
            setError("Failed to delete feature");
            toast.error("Failed to delete feature");
        }
    };

    const openDeleteModal = (id) => {
        setDeleteFeatureId(id);
        setIsDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteFeatureId(null);
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteFeature = () => {
        handleDeleteFeature(deleteFeatureId);
        closeDeleteModal();
    };

    if (loading) return <div className="flex w-full h-full items-center justify-center mt-60"><Spinner color="primary" size="lg" /></div>;

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="w-full md:w-1/2 p-4 rounded-lg shadow-md mb-6 md:mb-0">
                    <h2 className="text-xl font-bold mb-6">
                        {selectedFeature ? "Update Feature" : "Add New Feature"}
                    </h2>
                    <form onSubmit={selectedFeature ? (e) => { e.preventDefault(); handleUpdateFeature(); } : handleAddFeature}>
                        <Input
                            label="Feature"
                            labelPlacement="outside"
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Feature"
                            className="p-2 w-full mb-6"
                        />
                        <Button className="bg-black text-white w-full" type="submit">
                            {selectedFeature ? "Update" : "Add"}
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </form>
                </div>

                <div className="w-full md:w-1/2 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Feature List</h2>
                    <ul className="list-disc pl-5">
                        {featuresData.map((featureItem) => (
                            <li key={featureItem._id} className="flex flex-col md:flex-row justify-between items-center px-5 py-2 mb-4 rounded-md bg-slate-50">
                                <p className="font-medium">{featureItem.feature}</p>
                                <div className="flex space-x-2 mt-2 md:mt-0">
                                    <button
                                        onClick={() => {
                                            setSelectedFeature(featureItem);
                                            setNewFeature(featureItem.feature);
                                        }}
                                        className="h-8 w-8 shadow-inner rounded-full flex justify-center items-center bg-teal-50">
                                        <MdModeEdit />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(featureItem._id)}
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
                onConfirm={confirmDeleteFeature}
                title="Confirm Deletion">
                <p>Are you sure you want to delete this feature? This action cannot be undone.</p>
            </CustomModal>

            <ToastContainer />
        </div>
    );
}
