"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Image, Skeleton } from "@nextui-org/react";
import { MdOutlineDelete, MdModeEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomModal from "@/components/block/modal";
import { Input } from "@nextui-org/react";

export default function CarListing() {
  const [listing, setListing] = useState([]);
  const [filteredListing, setFilteredListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredListing(
        listing.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredListing(listing);
    }
  }, [searchQuery, listing]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/listing");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.length === 0) {
        setNotFound(true);
      } else {
        const sortedData = data.sort((b, a) => a.date.localeCompare(b.date));
        setListing(sortedData);
        setFilteredListing(sortedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`/api/listing`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setListing(listing.filter((item) => item._id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    deleteItem(deleteItemId);
    setIsDeleteModalVisible(false);
  };

  const renderSkeleton = () => (
    <div className="listingCard p-4 mb-4 rounded-lg flex flex-col gap-1 shadow-md bg-white">
      <Skeleton className="h-[180px] w-full rounded-xl mb-2" />
      <Skeleton className="h-5 w-full mb-1" />
      <Skeleton className="h-5 w-3/4 mb-1" />
    </div>
  );

  return (
    <div className="px-0 py-0 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <p className="font-bold text-xl mb-4 md:mb-0">Car Listing Page</p>
        <Input
          type="text"
          placeholder="Search listings"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/4"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-4">Error: {error}</p>}

      {notFound && !loading && <p className="text-center mt-4">Not Found</p>}

      {!loading && !error && !notFound && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredListing.map((item, index) => (
            <div
              key={item._id}
              className="listingCard shadow-md p-4 mb-4 rounded-lg flex flex-col gap-1 bg-white"
            >
              <div className="relative">
                <p
                  className={`absolute top-2 left-2 z-50 text-white text-sm px-2 py-1 rounded-md font-medium ${
                    item.visibility === "Active" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {item.visibility}
                </p>
                <img
                  src={item.image}
                  className="h-[170px] w-full rounded-md mb-2"
                  alt={item.title}
                />
                <div className="flex gap-2 absolute bottom-4 right-2 z-50">
                  <i className="w-min h-min p-2 rounded-lg bg-primary-100 cursor-pointer text-lg text-black shadow-inner">
                    <Link
                      href={{
                        pathname: "/dashboard/listing/new/view",
                        query: { id: item._id },
                      }}
                    >
                      <MdOutlineRemoveRedEye />
                    </Link>
                  </i>
                  <i className="w-min h-min p-2 rounded-lg bg-primary-50 cursor-pointer text-lg text-black shadow-inner">
                    <Link
                      href={{
                        pathname: "/dashboard/listing/new/update",
                        query: { id: item._id },
                      }}
                    >
                      <MdModeEdit />
                    </Link>
                  </i>
                  <i
                    onClick={() => handleDeleteClick(item._id)}
                    className="w-min h-min p-2 rounded-lg bg-red-50 cursor-pointer text-lg text-black shadow-inner"
                  >
                    <MdOutlineDelete />
                  </i>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="relative">
                  <h2 className="text-base font-semibold">
                    {item?.title?.length > 25 ? `${item.title.substring(0, 25)}...` : item.title}
                  </h2>
                  <div className="flex flex-col md:flex-row gap-2">
                    <p className="text-black dark:text-white">
                      Make: {item.make}
                    </p>
                    <p className="text-black dark:text-white">
                      Model: {item.model}
                    </p>
                  </div>
                  <p className="absolute top-0 left-0 text-6xl opacity-10 font-bold">
                    {index + 1}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={2000} />

      <CustomModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
      </CustomModal>
    </div>
  );
}
