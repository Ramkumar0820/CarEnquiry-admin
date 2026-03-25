"use client";
import React, { useEffect, useState } from "react";
import SubAdminModal from "./SubAdminModal";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@nextui-org/react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import CustomModal from "../block/modal";

const AdminRolesTable = () => {
  const [modal, setModal] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [adminDetail, setAdminDetail] = useState(null);
   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.length === 0) {
      } else {
        setAdminList(data?.admins);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalVisible(true);
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
     
      }

      setAdminList(adminList.filter((item) => item._id !== id));

    } catch (error) {
      console.error("Error deleting item:", error);
     
    }
  };

  const handleConfirmDelete = () => {
    deleteItem(deleteItemId);
    setIsDeleteModalVisible(false);
  };
  return (
    <div>
      <div className=" w-full p-4 rounded-lg shadow-md">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h2 className="text-sm md:text-xl font-bold ">Sub Admin List</h2>
          <Button type="button" color="primary" onClick={() => setModal(true)}>
            Add Sub Admin
          </Button>
        </div>
        <div className="overflow-x-auto">
        <div
          className="grid gap-4 px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-700"
          style={{ gridTemplateColumns: "2fr 3fr 2fr 60px 60px",
            minWidth: "600px",
           }}
        >
          <p>Name</p>
          <p>Email</p>
          <p>Company</p>
          <p className="text-center">Edit</p>
          <p className="text-center">Delete</p>
        </div>
        <div className="divide-y">
          {adminList.map((admin) => (
            <div
              key={admin._id}
              className="grid gap-4 px-6 py-4 items-center hover:bg-gray-50 transition"
              style={{ gridTemplateColumns: "2fr 3fr 2fr 60px 60px",
                minWidth: "600px",
               }}
            >
              <p className="font-medium">
                {admin.firstName} {admin.lastName}
              </p>

              <p className="text-gray-600 truncate">{admin.email}</p>

              <p className="text-gray-600">{admin.companyName}</p>

              <div className="flex justify-center">
                <button
                  className="h-8 w-8 rounded-full flex items-center justify-center bg-teal-100 text-teal-700 hover:bg-teal-200"
                  onClick={() => {
                    setAdminDetail(admin);
                    setModal(true);
                  }}
                >
                  <MdModeEdit size={18} />
                </button>
              </div>

              <div className="flex justify-center">
                <button   onClick={() => handleDeleteClick(admin._id)} className="h-8 w-8 rounded-full flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200">
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          ))}

          {adminList.length === 0 && (
            <p className="text-center py-6 text-gray-500">
              No sub admins found
            </p>
          )}
        </div>
        </div>
      </div>
      <CustomModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete this Inquiry? This action cannot be
          undone.
        </p>
      </CustomModal>

      <ToastContainer />
      <SubAdminModal
        isOpen={modal}
        onClose={() => {
          setModal(false);
          setAdminDetail(null);
        }}
        title={adminDetail ? "Edit Sub Admin" : "Add Sub Admin"}
        adminDetail={adminDetail}
        refreshList={fetchData}
      ></SubAdminModal>
    </div>
  );
};

export default AdminRolesTable;
