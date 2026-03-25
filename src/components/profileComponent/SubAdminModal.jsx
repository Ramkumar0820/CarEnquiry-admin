import React, { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import CountryCode from "../../utils/CountryCode";
import PhoneLengthByCountry from "../../utils/PhoneLength";

function SubAdminModal({ isOpen, onClose, title, adminDetail, refreshList }) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "",
    phoneCode: "",
    phone: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [selectedCountry, setSelectedCountry] = useState(CountryCode[0]);
  const [errors, setErrors] = useState({});
  

  useEffect(() => {
  if (adminDetail) {
    const defaultCountry = CountryCode.find(
      (c) => c.dial_code === adminDetail.phoneCode
    ) || CountryCode[0]; // ✅ fallback to first country if not found

    setSelectedCountry(defaultCountry);
    setFormData({
      firstName: adminDetail.firstName || "",
      lastName: adminDetail.lastName || "",
      email: adminDetail.email || "",
      password: "",
      companyName: adminDetail.companyName || "",
      phone: adminDetail.phone || "",
      phoneCode: defaultCountry.dial_code, // ✅ always set from selectedCountry
    });
  } else {
    setSelectedCountry(CountryCode[0]);
    setFormData({
      ...initialState,
      phoneCode: CountryCode[0].dial_code, // ✅ set default on Add mode too
    });
  }
}, [adminDetail, isOpen]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "phoneCode") {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const renderInputField = (name, placeholder, label, type = "text") => (
    <Input
      type={type}
      name={name}
      value={formData[name]}
      onChange={handleInputChange}
      fullWidth
      placeholder={placeholder}
      label={label}
      labelPlacement="outside"
      className="disabled:opacity-100"
      isInvalid={!!errors[name]}
      errorMessage={errors[name]}
    />
  );

  const validate = () => {
    const newErrors = {};
    const isEdit = Boolean(adminDetail?._id);

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.phoneCode.trim())
      newErrors.phoneCode = "Phone code is required";

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone must be numeric";
    } else {
      // ✅ Add length validation based on selected country
      const expectedLength = PhoneLengthByCountry[selectedCountry.code];
      if (expectedLength && formData.phone.length !== expectedLength) {
        newErrors.phone = `Phone number must be ${expectedLength} digits`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const isEdit = Boolean(adminDetail?._id);
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch(
        isEdit ? `/api/admin/${adminDetail._id}` : `/api/admin`,
        { method: isEdit ? "PUT" : "POST", body: form },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        await refreshList();
        setFormData(initialState);
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[60%] max-h-[74vh] overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {renderInputField("firstName", "Enter first name", "First Name")}
              {renderInputField("lastName", "Enter last name", "Last Name")}
              {renderInputField("email", "Enter email", "Email")}
              {!adminDetail?._id &&
                renderInputField(
                  "password",
                  "Enter password",
                  "Password",
                  "password",
                )}
              {renderInputField(
                "companyName",
                "Enter company name",
                "Company Name",
              )}

              {/* ✅ Fixed Phone Section — uses useState, not react-hook-form */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-start">
                  <select
                    className="form-control py-2 w-[30%] md:w-[25%] rounded-xl border border-default-200 text-sm"
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = CountryCode.find(
                        (c) => c.code === e.target.value,
                      );
                      if (country) {
                        setSelectedCountry(country);
                        setFormData((prev) => ({
                          ...prev,
                          phoneCode: country.dial_code,
                          phone: "",
                        }));
                        setErrors((prev) => ({
                          ...prev,
                          phoneCode: "",
                          phone: "",
                        }));
                      }
                    }}
                  >
                    {CountryCode.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.dial_code} ({country.code})
                      </option>
                    ))}
                  </select>

                  <Input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    placeholder="Enter Phone Number"
                    labelPlacement="outside"
                    className="w-[70%] md:w-[75%] disabled:opacity-100"
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const maxLength =
                        PhoneLengthByCountry[selectedCountry.code] || 10;
                      setFormData((prev) => ({
                        ...prev,
                        phone: val.slice(0, maxLength),
                      }));
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex mt-6 justify-end space-x-4">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" color="success" className="text-white">
                {adminDetail ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubAdminModal;
