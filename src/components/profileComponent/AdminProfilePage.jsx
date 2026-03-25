"use client";

import { useEffect, useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";
import useAuthStore from "@/store/useAuthStore.js";
import CountryCode from "@/utils/CountryCode";
import PhoneLengthByCountry from "@/utils/PhoneLength";

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userId = user?._id || null;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileImg: null,
    email: "",
    companyName: "",
    gender: "",
    dob: "",
    phone: "",
    phoneCode: CountryCode[0].dial_code,
    availability: "Active",
  });

  const [previewImg, setPreviewImg] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(CountryCode[0]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (previewImg) URL.revokeObjectURL(previewImg);
    };
  }, [previewImg]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // ✅ clear error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validate function
  const validate = () => {
  const newErrors = {};

  if (!formData.firstName.trim())
    newErrors.firstName = "First name is required";

  if (!formData.lastName.trim())
    newErrors.lastName = "Last name is required";

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    newErrors.email = "Invalid email address";
  }

  if (!formData.companyName.trim())
    newErrors.companyName = "Company name is required";

  // ✅ gender & dob removed — optional fields

  if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^\d+$/.test(formData.phone)) {
    newErrors.phone = "Phone must be numeric";
  } else {
    const expectedLength = PhoneLengthByCountry[selectedCountry.code];
    if (expectedLength && formData.phone.length !== expectedLength) {
      newErrors.phone = `Phone must be ${expectedLength} digits`;
    }
  }

  if (!formData.availability)
    newErrors.availability = "Availability is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const renderInputField = (id, name, placeholder, label, type = "text") => (
    <Input
      type={type}
      id={id}
      name={name}
      value={formData[name]}
      onChange={handleInputChange}
      fullWidth
      placeholder={placeholder}
      label={label}
      readOnly={!isEditing}
      labelPlacement="outside"
      className="disabled:opacity-100"
      isInvalid={!!errors[name]} // ✅ show error state
      errorMessage={errors[name]} // ✅ show error message
    />
  );

  const renderSelectField = (label, name, value, options, isDisabled = false) => (
    <Select
      label={label}
      variant="bordered"
      placeholder={`Select ${label}`}
      name={name}
      value={value}
      selectedKeys={value ? [value] : []}
      labelPlacement="outside"
      isDisabled={!isEditing || isDisabled}
      isInvalid={!!errors[name]} // ✅ show error state
      errorMessage={errors[name]} // ✅ show error message
      onChange={(e) => {
        handleInputChange({ target: { name, value: e.target.value } });
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }}
    >
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </Select>
  );

  const genderOptions = ["male", "female", "other"];
  const availabilityOptions = ["Active", "Inactive"];

  const mapAdminToForm = (admin) => {
    const matchedCountry =
      CountryCode.find((c) => c.dial_code === admin?.phoneCode) || CountryCode[0];
    setSelectedCountry(matchedCountry);

    return {
      firstName: admin?.firstName || "",
      lastName: admin?.lastName || "",
      profileImg: admin?.profileImg || null,
      email: admin?.email || "",
      companyName: admin?.companyName || "",
      gender: admin?.gender || "",
      dob: admin?.dob ? new Date(admin.dob).toISOString().split("T")[0] : "",
      phone: admin?.phone || "",
      phoneCode: matchedCountry.dial_code,
      availability: admin?.availability || "Active",
    };
  };

  const fetchData = async (url, setState) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setState(mapAdminToForm(data?.admin));
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    if (userId) fetchData(`/api/admin/${userId}`, setFormData);
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Run validation before submitting
    if (!validate()) return;

    const form = new FormData();
    const allowedFields = [
      "firstName", "lastName", "email", "companyName",
      "gender", "dob", "phone", "phoneCode", "availability", "profileImg",
    ];

    allowedFields.forEach((key) => {
      const value = formData[key];
      if (value !== null && value !== undefined && value !== "") {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch(`/api/admin/${userId}`, {
        method: "PUT",
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        toast.success(data.message || "Profile updated successfully");
        fetchData(`/api/admin/${userId}`, setFormData);
        setIsEditing(false);
        setPreviewImg(null);
        setErrors({}); // ✅ clear errors on success
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProfileImage = () => {
    if (previewImg) return previewImg;
    if (typeof formData.profileImg === "string") {
      if (formData.profileImg.startsWith("/uploads")) return `/api${formData.profileImg}`;
      return formData.profileImg;
    }
    return "/lastlogin.svg";
  };

  return (
    <div className="rounded-2xl shadow-sm">
      <div className="p-2 md:p-8 grid grid-cols-1 items-center gap-10">
        {/* Avatar */}
        <div className="flex flex-col items-start gap-4">
          <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-[160px] h-[160px] rounded-full">
              <Image
                src={getProfileImage()}
                alt="Profile Image"
                width={40}
                height={40}
                className="object-contain w-full h-full rounded-full"
              />
            </div>
            <input
              type="file"
              id="profileImg"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const previewUrl = URL.createObjectURL(file);
                setPreviewImg(previewUrl);
                setFormData((prev) => ({ ...prev, profileImg: file }));
              }}
            />
          </div>
          <div>
            {isEditing && (
              <label
                htmlFor="profileImg"
                className="bg-blue flex items-center justify-between gap-3 p-2 rounded-full shadow cursor-pointer"
              >
                <FiCamera size={18} /> <span>Edit</span>
              </label>
            )}
          </div>
        </div>

        {/* Profile info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Admin Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField("firstName", "firstName", "Enter first name", "First Name")}
            {renderInputField("lastName", "lastName", "Enter last name", "Last Name")}

            <Input
              type="email"
              label="Email"
              value={formData.email}
              readOnly
              labelPlacement="outside"
            />

            {renderInputField("companyName", "companyName", "Company Name", "Company Name")}
            {renderSelectField("Gender", "gender", formData.gender, genderOptions)}
            {renderInputField("dob", "dob", "", "Date of Birth", "date")}

            {/* Phone Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-start">
                <div className="flex flex-col w-[30%] md:w-[25%]">
                  <select
                    className="form-control py-2 rounded-xl border border-default-200 text-sm h-[40px]"
                    value={selectedCountry.code}
                    disabled={!isEditing}
                    onChange={(e) => {
                      const country = CountryCode.find((c) => c.code === e.target.value);
                      if (country) {
                        setSelectedCountry(country);
                        setFormData((prev) => ({
                          ...prev,
                          phoneCode: country.dial_code,
                          phone: "",
                        }));
                        setErrors((prev) => ({ ...prev, phoneCode: "", phone: "" }));
                      }
                    }}
                  >
                    {CountryCode.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.dial_code} ({country.code})
                      </option>
                    ))}
                  </select>
                  {errors.phone && (
                    <p className="text-tiny text-danger mt-1 invisible">_</p>
                  )}
                </div>

                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  placeholder="Enter Phone Number"
                  labelPlacement="outside"
                  className="w-[70%] md:w-[75%] disabled:opacity-100"
                  readOnly={!isEditing}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const maxLength = PhoneLengthByCountry[selectedCountry.code] || 10;
                    setFormData((prev) => ({
                      ...prev,
                      phone: val.slice(0, maxLength),
                    }));
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                />
              </div>
            </div>

            {renderSelectField("Availability", "availability", formData.availability, availabilityOptions)}
          </div>

          <div className="flex justify-end gap-3">
            {isEditing ? (
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewImg(null);
                    setErrors({}); // ✅ clear errors on cancel
                    fetchData(`/api/admin/${userId}`, setFormData);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  Update
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}