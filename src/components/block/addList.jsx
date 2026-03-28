"use client";
import { useState, useEffect } from "react";
import { Input, Button, Select, SelectItem, CheckboxGroup, Checkbox, } from "@nextui-org/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, editorConfig } from "@/lib/editorConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { useRouter } from "next/navigation";

const todayDate = new Date().toISOString().split("T")[0];

const PostList = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    // image: "",
    image: null,
    price: "",
    priceCurrency: "INR",
    description: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    mileageUnit: "KMPL",
    // itemCondition: "New",
    // availability: "InStock",
    vin: "",
    bodyType: "",
    color: "",
    driveWheelConfiguration: "Front Wheel Drive",
    numberOfDoors: "",
    fuelType: "Petrol",
    vehicleEngine: "",
    vehicleSeatingCapacity: " ",
    vehicleTransmission: "Manual",
    carFeature: [],
    carSafetyFeature: [],
    cylinders: "",
    visibility: "Active",
    offerType: "New Year Offer",
    date: todayDate,
  }); 

  const [makeData, setMakeData] = useState([]);
  const [modelData, setModelData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [featureData, setFeatureData] = useState([]);
  const [safetyFeatureData, setSafetyFeatureData] = useState([]);
  const [isModelDisabled, setIsModelDisabled] = useState(true);

  // const [availabilityOptions] = useState(["InStock", "OutOfStock"]);
  const [mileageUnitOptions] = useState(["KMPL", "SMI"]);
  const [priceCurrencyOptions] = useState(["NGN", "INR", "USD", "EUR", "GBP"]);
  // const [itemConditionOptions] = useState(["New", "Used"]);
  const [fuelTypeOptions] = useState([
    "Petrol",
    "Diesel",
    "Electric",
    "Hybrid",
  ]);
  const [transmissionOptions] = useState([
    "Automatic",
    "Manual",
    "Semi-Automatic",
  ]);
  const [driveTypeOptions] = useState([
    "Front Wheel Drive",
    "Rear Wheel Drive",
    "All Wheel Drive",
    "Four Wheel Drive",
  ]);
  const [visibilityOptions] = useState(["Active", "Inactive"]);
  const [offerTypeOptions] = useState(["Sold", "New Year Offer"]);
  useEffect(() => {
    fetchData("/api/listing/make", setMakeData);
    fetchData("/api/listing/type", setTypeData);
    fetchData("/api/listing/color", setColorData);
    fetchData("/api/listing/features", setFeatureData);
    fetchData("/api/listing/safety-features", setSafetyFeatureData);
  }, []);
  useEffect(() => {
    if (formData.make) {
      fetchModelData(formData.make);
      setIsModelDisabled(false);
    } else {
      setModelData([]);
      setIsModelDisabled(true);
    }
  }, [formData.make]);
  const fetchData = async (url, setState) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };
  const fetchModelData = async (make) => {
    try {
      const response = await fetch(`/api/listing/model?make=${make}`);
      const data = await response.json();
      setModelData(data);
    } catch (error) {
      console.error("Error fetching model data:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prevData) => ({ ...prevData, description: data }));
  };
  const handleCheckboxChange = (name, values) => {
    setFormData((prevData) => ({ ...prevData, [name]: values }));
  };

  const requiredFields = [
  "title",
  "price",
  "make",
  "model",
  // "year",
  // "color",
  // "numberOfDoors",
  "vehicleSeatingCapacity",
  "date",
];

  const handleSubmit = async (e) => {
    e.preventDefault();

     for (let field of requiredFields) {
       const value = formData[field];

       if (!value || value.toString().trim() === "") {
         toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1")}`);
         return;
       }
     }

     if (!formData.image) {
       toast.error("Please upload a car image");
       return;
     }
    //  if (!formData.description || formData.description.trim() === "") {
    //    toast.error("Please enter description");
    //    return;
    //  }

    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (value === null || value === undefined || value === "") return;

      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch("/api/listing", {
        method: "POST",
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Something went wrong");
      } else {
        toast.success(data.message);
        router.replace('/dashboard/listing')
      }
    } catch (error) {
      toast.error(error.message);
    }
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
      color="default"
      labelPlacement="outside"
    />
  );
  const renderSelectField = (
    label,
    name,
    value,
    options,
    isDisabled = false
  ) => (
       <Select
        label={label}
        variant="bordered"
        placeholder={`Select ${label}`}
        name={name}
        color="secondary"
        value={value}
        selectedKeys={value ? [value] : []}
        labelPlacement="outside"
        isDisabled={isDisabled}
        onChange={(e) =>
          handleInputChange({ target: { name, value: e.target.value } })
        }
      >
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </Select>
  );
  return (
    <div>
      <h3 className="ml-2 font-bold">Add New Listing</h3>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {renderInputField("title", "title", "Enter title", "Title")}
          {/* {renderInputField("image", "image", "Enter image URL", "Image URL", "file")} */}
          <div className="flex flex-col w-full gap-1.5">
            <label
              htmlFor="image"
              className="text-sm font-medium text-gray-900"
            >
              Choose Car
            </label>
            <div
              onClick={() => document.getElementById("image")?.click()}
              className="h-10 flex items-center px-4 rounded-xl bg-gray-100 text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition">
              {formData.image ? formData.image.name : "Upload image"}
            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setFormData((prev) => ({
                  ...prev,
                  image: file,
                }));
              }}
            />
          </div>
          {renderInputField(
  "price",
  "price",
  "Enter price per km",
  "Price (₹ / KM)"
)}
        </div>
        <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {renderSelectField(
            "Price Currency",
            "priceCurrency",
            formData.priceCurrency,
            priceCurrencyOptions,
          )}
          {renderSelectField(
            "Make",
            "make",
            formData.make,
            makeData.map((make) => make.make),
          )}
          {renderSelectField(
            "Model",
            "model",
            formData.model,
            modelData.map((model) => model.model),
            isModelDisabled,
          )}
        </div>
        <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {renderInputField("year", "year", "Enter car year", "Year", "number")}
          {/* {renderSelectField(
            "Item Condition",
            "itemCondition",
            formData.itemCondition,
            itemConditionOptions,
          )}
          {renderSelectField(
            "Availability",
            "availability",
            formData.availability,
            availabilityOptions,
          )} */}
          {/* {renderInputField( 
            "mileage",
            "mileage",
            "Enter car mileage",
            "Mileage",
            "number",
          )}
          {renderSelectField(
            "Mileage Unit",
            "mileageUnit",
            formData.mileageUnit,
            mileageUnitOptions,
          )} */}
        </div>
        {/* <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {renderSelectField(
            "Item Condition",
            "itemCondition",
            formData.itemCondition,
            itemConditionOptions,
          )}
          {renderSelectField(
            "Availability",
            "availability",
            formData.availability,
            availabilityOptions,
          )}
          {renderInputField("vin", "vin", "Enter vin", "Vin")}
        </div> */}
        <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {/* {renderSelectField(
            "Body Type",
            "bodyType",
            formData.bodyType,
            typeData.map((type) => type.type),
          )} */}
          {renderSelectField(
            "Color",
            "color",
            formData.color,
            colorData.map((color) => color.color),
          )}
          {renderInputField(
            "numberOfDoors",
            "numberOfDoors",
            "Enter number of doors",
            "Number of Doors",
            "number",
          )}
          {renderSelectField(
            "Fuel Type",
            "fuelType",
            formData.fuelType,
            fuelTypeOptions,
          )}
          {/* {renderSelectField(
            "Drive Type",
            "driveWheelConfiguration",
            formData.driveWheelConfiguration,
            driveTypeOptions,
          )} */}
        </div>
        {/* <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {renderInputField(
            "numberOfDoors",
            "numberOfDoors",
            "Enter number of doors",
            "Number of Doors",
            "number",
          )}
          {renderSelectField(
            "Fuel Type",
            "fuelType",
            formData.fuelType,
            fuelTypeOptions,
          )}
          {renderInputField(
            "vehicleEngine",
            "vehicleEngine",
            "Enter vehicle engine size in L",
            "Engine Size",
          )}
        </div> */}
        {/* <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {renderInputField(
            "cylinders",
            "cylinders",
            "Enter cylinders",
            "Cylinders",
            "number",
          )}
          {renderInputField(
            "vehicleSeatingCapacity",
            "vehicleSeatingCapacity",
            "Enter vehicle seating capacity",
            "Vehicle Seating Capacity",
            "number",
          )}
          {renderSelectField(
            "Vehicle Transmission",
            "vehicleTransmission",
            formData.vehicleTransmission,
            transmissionOptions,
          )}
        </div> */}
        <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
          {renderSelectField(
            "Visibility",
            "visibility",
            formData.visibility,
            visibilityOptions,
          )}
          {renderInputField(
            "vehicleSeatingCapacity",
            "vehicleSeatingCapacity",
            "Enter vehicle seating capacity",
            "Vehicle Seating Capacity",
            "number",
          )}
          {/* {renderSelectField(
            "Offer Type",
            "offerType",
            formData.offerType,
            offerTypeOptions,
          )} */}
          {renderInputField("date", "date", "Enter date", "Date", "date")}
        </div>
        <div className="flex flex-col gap-3">
          <CheckboxGroup
            label="Car Features"
            orientation="horizontal"
            value={formData.carFeature}
            onChange={(values) => handleCheckboxChange("carFeature", values)}
          >
            {featureData.map((feature) => (
              <Checkbox key={feature.feature} value={feature.feature}>
                {feature.feature}
              </Checkbox>
            ))}
          </CheckboxGroup>
          <CheckboxGroup
            label="Car Safety Features"
            orientation="horizontal"
            value={formData.carSafetyFeature}
            onChange={(values) =>
              handleCheckboxChange("carSafetyFeature", values)
            }
          >
            {safetyFeatureData.map((safetyFeature) => (
              <Checkbox
                key={safetyFeature.feature}
                value={safetyFeature.feature}
              >
                {safetyFeature.feature}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
        {/* <div>
          <p htmlFor="description" className="font-bold pb-3">
            Description
          </p>
          <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={formData.description}
            onChange={handleEditorChange}
          />
        </div> */}
        <Button type="submit" className="bg-black text-white">
          Sumbit
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default PostList;
