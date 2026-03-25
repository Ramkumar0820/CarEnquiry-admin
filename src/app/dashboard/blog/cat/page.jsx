"use client";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Input, Button, Spinner } from "@nextui-org/react";
import CustomModal from "@/components/block/modal";

export default function Category() {
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");
    const [newImage, setNewImage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [error, setError] = useState("");
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const apiEndpoint = "/api/posts/cat";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setCategoryData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim() || !newImage.trim()) {
            setError("Category name and image URL are required");
            return;
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: newCategory, image: newImage })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewCategory("");
            setNewImage("");
            setError("");
            fetchData();
        } catch (error) {
            console.error("Error adding new category:", error);
            setError("Failed to add new category");
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory || !newCategory.trim() || !newImage.trim()) {
            setError("Select a category, and provide category name and image URL");
            return;
        }

        try {
            const response = await fetch(apiEndpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedCategory._id,
                    updateData: { category: newCategory, image: newImage }
                })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setNewCategory("");
            setNewImage("");
            setSelectedCategory(null);
            setError("");
            fetchData();
        } catch (error) {
            console.error("Error updating category:", error);
            setError("Failed to update category");
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const response = await fetch(apiEndpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (!response.ok) throw new Error("Network response was not ok");
            fetchData();
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete category");
        }
    };

    const openDeleteModal = (id) => {
        setDeleteCategoryId(id);
        setIsDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteCategoryId(null);
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteCategory = () => {
        handleDeleteCategory(deleteCategoryId);
        closeDeleteModal();
    };

    if (loading) return <div className="flex w-full h-full items-center justify-center mt-60 "> <Spinner color="primary" size="lg" /></div>;

    return (
        <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-10">
                        {selectedCategory ? "Update Category" : "Add New Category"}
                    </h2>
                    <form onSubmit={selectedCategory ? (e) => { e.preventDefault(); handleUpdateCategory(); } : handleAddCategory}>
                        <Input
                            label="Category Name"
                            labelPlacement="outside"
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Category Name"
                            className="w-full mb-10"
                        />
                        <Input
                            label="Category Icon Url"
                            labelPlacement="outside"
                            type="text"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="https://image-url.jpg"
                            className="w-full mb-4"
                        />
                        <Button className="w-full bg-black text-white" type="submit">
                            {selectedCategory ? "Update" : "Add"}
                        </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </form>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Category List</h2>
                    <ul className="space-y-4">
                        {categoryData.map((categoryItem) => (
                            <li key={categoryItem._id} className="flex justify-between items-center p-4 rounded-md bg-slate-50">
                                <img src={categoryItem.image} alt={categoryItem.category} className="w-12 h-12 object-cover rounded-full" />
                                <p className="flex-1 ml-4 font-medium">{categoryItem.category}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(categoryItem);
                                            setNewCategory(categoryItem.category);
                                            setNewImage(categoryItem.image);
                                        }}
                                        className="h-8 w-8 flex justify-center items-center bg-teal-50 rounded-full">
                                        <MdModeEdit />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(categoryItem._id)}
                                        className="h-8 w-8 flex justify-center items-center bg-red-50 rounded-full">
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
                onConfirm={confirmDeleteCategory}
                title="Confirm Deletion"
            >
                <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            </CustomModal>
        </div>
    );
}
