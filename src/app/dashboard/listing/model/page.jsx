"use client";
import { useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Input, Button, Spinner, Select, SelectItem } from "@nextui-org/react";
import CustomModal from "@/components/block/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Model() {
  const [modelData, setModelData] = useState([]);
  const [makeData, setMakeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModel, setNewModel] = useState("");
  const [newImage, setNewImage] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState(null);
  const [error, setError] = useState("");
  const [deleteModelId, setDeleteModelId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const modelApiEndpoint = "/api/listing/model";
  const makeApiEndpoint = "/api/listing/make";

  useEffect(() => {
    fetchData();
    fetchMakes();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(modelApiEndpoint);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setModelData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMakes = async () => {
    try {
      const response = await fetch(makeApiEndpoint);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMakeData(data);
    } catch (error) {
      console.error("Error fetching makes:", error);
    }
  };

  const handleAddModel = async (e) => {
    e.preventDefault();
    if (!newModel.trim() || !newImage.trim() || !selectedMake) {
      setError("Make, Model name, and image URL are required");
      return;
    }

    try {
      const response = await fetch(modelApiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: newModel,
          image: newImage,
          make: selectedMake,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setNewModel("");
      setNewImage("");
      setSelectedMake("");
      setError("");
      fetchData();
      toast.success("Model added successfully!");
    } catch (error) {
      console.error("Error adding new model:", error);
      setError("Failed to add new model");
      toast.error("Failed to add new model");
    }
  };

  const handleUpdateModel = async () => {
    if (
      !selectedModel ||
      !newModel.trim() ||
      !newImage.trim() ||
      !selectedMake
    ) {
      setError("Select a model, and provide model name, image URL, and make");
      return;
    }

    try {
      const response = await fetch(modelApiEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedModel._id,
          updateData: { model: newModel, image: newImage, make: selectedMake },
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setNewModel("");
      setNewImage("");
      setSelectedModel(null);
      setSelectedMake("");
      setError("");
      fetchData();
      toast.success("Model updated successfully!");
    } catch (error) {
      console.error("Error updating model:", error);
      setError("Failed to update model");
      toast.error("Failed to update model");
    }
  };

  const handleDeleteModel = async (id) => {
    try {
      const response = await fetch(modelApiEndpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      fetchData();
      toast.success("Model deleted successfully!");
    } catch (error) {
      console.error("Error deleting model:", error);
      setError("Failed to delete model");
      toast.error("Failed to delete model");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteModelId(id);
    setIsDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModelId(null);
    setIsDeleteModalVisible(false);
  };

  const confirmDeleteModel = () => {
    handleDeleteModel(deleteModelId);
    closeDeleteModal();
  };

  if (loading)
    return (
      <div className="flex w-full h-full items-center justify-center mt-60 ">
        {" "}
        <Spinner color="primary" size="lg" />
      </div>
    );

  return (
    <div>
      <div className="flex justify-between md:p-6  flex-col md:flex-row gap-6">
        <div className="md:w-1/2 w-full p-4 rounded-lg shadow-md h-min">
          <h2 className="text-xl font-bold mb-10 ml-2">
            {selectedModel ? "Update Model" : "Add New Model"}
          </h2>
          <form
            onSubmit={
              selectedModel
                ? (e) => {
                    e.preventDefault();
                    handleUpdateModel();
                  }
                : handleAddModel
            }
          >
            <Select
              label="Make"
              variant="bordered"
              placeholder="Select Make"
              value={selectedMake}
              color="secondary"
              labelPlacement="outside"
              onChange={(e) => setSelectedMake(e.target.value)}
              className="p-2 w-full mb-10"
            >
              {makeData.map((make) => (
                <SelectItem key={make.make}>{make.make}</SelectItem>
              ))}
            </Select>
            <Input
              label="Model Name"
              labelPlacement="outside"
              type="text"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              placeholder="Model Name"
              className="p-2 w-full mb-10"
            />
            <Input
              label="Model Image URL"
              labelPlacement="outside"
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="https://image-url.jpg"
              className="p-2  w-full mb-6"
            />
            <Button className="ml-2 bg-black text-white" type="submit">
              {selectedModel ? "Update" : "Add"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>

        <div className="md:w-1/2 w-full p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Model List</h2>
          <ul className="list-disc md:pl-5">
            <li className="flex justify-between items-center px-5 py-2 mb-1">
              <p>Image</p>
              <p>Model</p>
              <p>Make</p>
              <p>Edit</p>
              <p>Delete</p>
            </li>
          </ul>
          <ul className="list-disc pl-5">
            {modelData.map((modelItem) => (
              <li
                key={modelItem._id}
                className="flex justify-between items-center px-5 py-2 mb-4 rounded-md bg-slate-50"
              >
                <img data-disableanimation
                  src={modelItem.image}
                  alt={modelItem.model}
                  className="bg-white w-14 h-14 object-cover mr-4 rounded-full shadow-md p-2"
                />
                <p className="font-medium">{modelItem.model}</p>
                <p className="font-medium">{modelItem.make}</p>
                <button
                  onClick={() => {
                    setSelectedModel(modelItem);
                    setNewModel(modelItem.model);
                    setNewImage(modelItem.image);
                    setSelectedMake(modelItem.make);
                  }}
                  className="h-8 w-8 shadow-inner rounded-full flex justify-center items-center bg-teal-50"
                >
                  <MdModeEdit />
                </button>
                <button
                  onClick={() => openDeleteModal(modelItem._id)}
                  className="h-8 w-8 shadow-inner rounded-full flex justify-center items-center bg-red-50"
                >
                  <MdDelete className="" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CustomModal
        isOpen={isDeleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteModel}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete this model? This action cannot be
          undone.
        </p>
      </CustomModal>

      <ToastContainer />
    </div>
  );
}
