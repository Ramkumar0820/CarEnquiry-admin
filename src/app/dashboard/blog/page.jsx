"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Image, Skeleton, Input } from "@nextui-org/react";
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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPosts(
        posts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/posts");
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

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`/api/posts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setPosts(posts.filter((post) => post._id !== id));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
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
      <Skeleton className="h-[180px] w-[100%] rounded-xl mb-2" />
      <Skeleton className="h-5 w-[100%] mb-1" />
      <Skeleton className="h-5 w-[60%] mb-1" />
    </div>
  );

  return (
    <div className="p-0 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-5">
        <p className="font-bold text-xl">Blog Post Listing</p>
        <Input
          type="text"
          placeholder="Search posts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/4"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {notFound && !loading && <p className="text-center mt-4">No posts found</p>}

      {!loading && !error && !notFound && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredPosts.map((post, index) => (
            <div
              key={post._id}
              className="listingCard shadow-md p-4 mb-4 rounded-lg flex flex-col gap-1 bg-white"
            >
              <div className="relative block">
                <p
                  className={`absolute top-2 left-2 z-50 text-white text-sm px-2 py-1 rounded-md font-medium ${post.visibility === "Active" ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                  {post.visibility}
                </p>
                <img
                  src={post.thumbnail}
                  className="h-[170px] w-full rounded-md mb-2 block m-0"
                  alt={post.title}
                />
                <div className="flex gap-2 absolute bottom-4 right-2 z-50">
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
                </div>

              </div>
              <div className="flex flex-col relative">
                <h2 className="text-base font-semibold">
                  {post.title.length > 25 ? `${post.title.substring(0, 25)}...` : post.title}
                </h2>
                <div className="flex gap-5 justify-between"><p>Cat : {post.category}</p><p>Date : {post.date}</p></div>
                <p className="absolute top-0 left-0  text-6xl opacity-10 font-bold text-gray-500">
                  {index + 1}
                </p>
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
        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
      </CustomModal>
    </div>
  );
}
