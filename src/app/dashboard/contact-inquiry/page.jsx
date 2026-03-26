"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Image, Skeleton, Input, Button } from "@nextui-org/react";
import { MdOutlineDelete, MdModeEdit } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomModal from "@/components/block/modal";

export default function BlogPostListing() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPosts(
        posts.filter((post) =>
          post.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/listing/contact_inquiries");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.length === 0) {
        setNotFound(true);
      } else {
        setPosts(data);
        setFilteredPosts(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalVisible(true);
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`/api/listing/contact_inquiries`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setPosts(posts.filter((item) => item._id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleConfirmDelete = () => {
    deleteItem(deleteItemId);
    setIsDeleteModalVisible(false);
  };

  const handleUpdateStatus = async (id) => {
    try {
      const response = await fetch(`/api/listing/contact_inquiries`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setPosts((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, markAsRead: true } : item,
        ),
      );
      toast.success("Status Updated");
    } catch (error) {
      console.error("Error update status:", error);
      toast.error("Failed to update status");
    }
  };

  const renderSkeleton = () => (
    <div className="listingCard p-4 mb-4 rounded-lg flex gap-1 shadow-md bg-white">
      <Skeleton className="h-[180px] w-[30%] rounded-xl mb-2" />
      <div className="flex flex-col flex-1 p-3 gap-4">
        <Skeleton className="h-5 w-[100%] mb-1" />
        <Skeleton className="h-5 w-[60%] mb-1" />
        <Skeleton className="h-5 w-[50%] mb-1" />
      </div>
    </div>
  );

  return (
    <div className="p-0 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-5">
        <p className="font-bold text-xl">Contact Inquiry Data</p>
        <Input
          type="text"
          placeholder="Search inquiry"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/4"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-1 md:grid-cols-1 lg:grid-cols-1">
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

      {!loading && !error && filteredPosts.length === 0 && (
        <p className="text-center mt-4">No contact inquiry found</p>
      )}

      {!loading && !error && !notFound && (
        <div className="grid grid-cols-1">
          {filteredPosts.map((post, index) => (
            <div
              key={post._id}
              className="listingCard shadow-md p-4 mb-4 rounded-lg flex md:flex-row flex-col gap-5 bg-white"
            >
              <div className="relative block max-w-[250px] lg:w-1/3 sm:w-1/2 w-full md:mx-0 mx-auto">
                {/* <p
                  className={`absolute top-2 left-2 z-50 text-white text-sm px-2 py-1 rounded-md font-medium ${
                    post.visibility === "Active" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {post.visibility}
                </p> */}
                <img
                  src={post.productImg}
                  className="sm:h-[170px] h-[200px] w-full rounded-md mb-2 block m-0 object-cover"
                  alt={post.name}
                />
                {/* <div className="flex gap-2 absolute bottom-4 right-2 z-50">
                  <i className="w-min h-min p-2 rounded-lg bg-primary-50 cursor-pointer text-lg text-black shadow-inner">
                    <Link
                      href={{
                        pathname: "/dashboard/blog/new/update",
                        query: { id: post._id },
                      }}
                    >
                      <MdModeEdit />
                    </Link>
                  </i>
                  <i
                    onClick={() => handleDeleteClick(post._id)}
                    className="w-min h-min p-2 rounded-lg bg-red-50 cursor-pointer text-lg text-black shadow-inner"
                  >
                    <MdOutlineDelete />
                  </i>
                </div> */}
              </div>
              <div className="flex flex-1 flex-col relative">
                <h2 className="text-base font-semibold">
                  {/* {post.title.length > 25
                    ? `${post.title.substring(0, 25)}...`
                    : post.title} */}
                  {post.productName}
                </h2>
                <div className="flex flex-wrap gap-2 justify-between">
                  <p>{post.name}</p>
                  <p>Number : {post.mobile}</p>
                  <p>Email : {post.email}</p>
                </div>
                <p className="text-lg font-bold text-black">{post.message}</p>
                <div className="mt-auto flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    color={post.markAsRead === false ? "primary" : "success"}
                    isDisabled={post.markAsRead === true}
                    onClick={() => handleUpdateStatus(post._id)}
                  >
                    Mark As Read
                  </Button>
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => handleDeleteClick(post._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <CustomModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete this Contact Inquiry? This action cannot be
          undone.
        </p>
      </CustomModal>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}
