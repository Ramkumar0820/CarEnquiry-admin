"use client";
import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
  Spinner,
} from "@nextui-org/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, editorConfig } from "@/lib/editorConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const PostList = ({ listingId }) => {
  // Add new fields to initialFormData
  const initialFormData = {
    title: "",
    // image: null,
    price: "",
    priceCurrency: "USD",
    description: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    mileageUnit: "KMT",
    itemCondition: "",
    availability: "",
    vin: "",
    bodyType: "",
    color: "",
    driveWheelConfiguration: "",
    numberOfDoors: "",
    fuelType: "",
    vehicleEngine: "",
    vehicleSeatingCapacity: "",
    vehicleTransmission: "",
    carFeature: [],
    carSafetyFeature: [],
    cylinders: "",
    visibility: "Active", // New field
    offerType: "New", // New field
    date: "", // New field for date
  };

  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [makeData, setMakeData] = useState([]);
  const [modelData, setModelData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [featureData, setFeatureData] = useState([]);
  const [safetyFeatureData, setSafetyFeatureData] = useState([]);
  const [isModelDisabled, setIsModelDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const options = {
    availabilityOptions: ["InStock", "OutOfStock"],
    mileageUnitOptions: ["KMPL", "SMI"],
    priceCurrencyOptions: ["INR", "USD", "EUR", "GBP", "NGN"],
    itemConditionOptions: ["New", "Used"],
    fuelTypeOptions: ["Petrol", "Diesel", "Electric", "Hybrid"],
    transmissionOptions: ["Automatic", "Manual", "Semi-Automatic"],
    driveTypeOptions: [
      "Front Wheel Drive",
      "Rear Wheel Drive",
      "All Wheel Drive",
      "Four Wheel Drive",
    ],
    visibilityOptions: ["Active", "Inactive"], // New options
    offerTypeOptions: ["New", "Offer", "Sold"], // New options
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchData("/api/listing/make", setMakeData),
        fetchData("/api/listing/color", setColorData),
        fetchData("/api/listing/type", setTypeData),
        fetchData("/api/listing/features", setFeatureData),
        fetchData("/api/listing/safety-features", setSafetyFeatureData),
        fetchListingData(),
      ]);
      setIsLoading(false);
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    if (formData.make) {
      fetchData(`/api/listing/model?make=${formData.make}`, setModelData);
      setIsModelDisabled(false);
    } else {
      setModelData([]);
      setIsModelDisabled(true);
    }
  }, [formData.make]);

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  const fetchListingData = async () => {
    try {
      const response = await fetch("/api/listing/");
      const data = await response.json();
      const filteredData = data.find((item) => item._id === listingId);
      if (filteredData) {
        setFormData(filteredData);
        console.log(filteredData);
      } else {
        console.error("No data found with the specified _id");
      }
    } catch (error) {
      console.error("Error fetching listing data:", error);
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

     form.append("id", listingId);

     Object.keys(formData).forEach((key) => {
       if (key === "_id" || key === "image") return;
       const value = formData[key];

       if (value === null || value === undefined || value === "") return;

        if (Array.isArray(value)) {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
     });

     if (imageFile) {
       form.append("image", imageFile);
     }

     try {
       const response = await fetch("/api/listing", {
         method: "PUT",
         body: form,
       });

       const data = await response.json();

       if (!response.ok) {
         toast.error(data.error || "Something went wrong");
       } else {
         toast.success(data.message);
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
      required
      placeholder={placeholder}
      label={label}
      color="default"
      labelPlacement="outside"
    />
  );

  const renderSelectField = (label, name, options, isDisabled = false) => (
    <Select
      label={label}
      variant="bordered"
      placeholder={`Select ${label}`}
      name={name}
      color="secondary"
      value={formData[name]}
      selectedKeys={[formData[name]]}
      labelPlacement="outside"
      isDisabled={isDisabled}
      onChange={handleInputChange}
    >
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </Select>
  );

  console.log("formData", formData)

  return (
    <div>
      {isLoading ? (
        <div className="flex w-full h-full items-center justify-center mt-60 ">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        <>
          <h3 className="ml-2 font-bold">Update Listing</h3>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
              {renderInputField("title", "title", "Enter title", "Title")}
              {/* {renderInputField("image", "image", "Enter image URL", "Image URL")} */}
              <div className="flex flex-col w-full gap-1.5">
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-gray-900"
                >
                  Car image
                </label>
                <div
                  onClick={() => document.getElementById("image")?.click()}
                  className="h-10 flex items-center px-4 rounded-xl bg-gray-100 text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition"
                >
                  {imageFile ? imageFile.name : formData.image ? formData.image : "Upload image"}
                </div>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageFile(file)
                  }}
                />
              </div>
              {renderInputField("price", "price", "Enter price", "Price")}
            </div>
            <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
              {renderSelectField(
                "Price Currency",
                "priceCurrency",
                options.priceCurrencyOptions,
              )}
              {renderSelectField(
                "Make",
                "make",
                makeData.map((make) => make.make),
              )}
              {renderSelectField(
                "Model",
                "model",
                modelData.map((model) => model.model),
                isModelDisabled,
              )}
            </div>
            {/* <div className="flex justify-center items-center gap-3 flex-col md:flex-row"> */}

{/* 
              {renderSelectField(
                "Availability",
                "availability",
                options.availabilityOptions,
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
                options.mileageUnitOptions,
              )} */}
            {/* </div> */}
            {/* <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
              {renderSelectField(
                "Condition",
                "itemCondition",
                options.itemConditionOptions,
              )}
              {renderSelectField(
                "Availability",
                "availability",
                options.availabilityOptions,
              )}
              {renderInputField("vin", "vin", "Enter VIN number", "VIN")}
            </div> */}
            <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
              {renderSelectField(
                "Color",
                "color",
                colorData.map((color) => color.color),
              )}
              {/* {renderInputField(
                "numberOfDoors",
                "numberOfDoors",
                "Enter number of doors",
                "Number of Doors",
                "number",
              )} */}
              {renderSelectField(
                "Fuel Type",
                "fuelType",
                options.fuelTypeOptions,
              )}
              {/* {renderSelectField(
                "Body Type",
                "bodyType",
                typeData.map((type) => type.type),
              )}
              {renderSelectField(
                "Drive Type",
                "driveWheelConfiguration",
                options.driveTypeOptions,
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
                options.fuelTypeOptions,
              )}
              {renderInputField(
                "vehicleEngine",
                "vehicleEngine",
                "Enter engine description",
                "Engine",
              )}
            </div> */}
            {/* <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
              {renderInputField(
                "vehicleSeatingCapacity",
                "vehicleSeatingCapacity",
                "Enter seating capacity",
                "Seating Capacity",
                "number",
              )}
              {renderSelectField(
                "Vehicle Transmission",
                "vehicleTransmission",
                options.transmissionOptions,
              )}
              {renderInputField(
                "cylinders",
                "cylinders",
                "Enter number of cylinders",
                "Cylinders",
                "number",
              )}
            </div> */}
            <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
              {renderSelectField(
                "Visibility",
                "visibility",
                options.visibilityOptions,
              )}
              {/* {renderSelectField(
                "Offer Type",
                "offerType",
                options.offerTypeOptions,
              )} */}
              {renderInputField(
                "vehicleSeatingCapacity",
                "vehicleSeatingCapacity",
                "Enter seating capacity",
                "Seating Capacity",
                "number",
              )}
              {renderInputField("date", "date", "Enter date", "Date", "date")}
            </div>
            <div className="flex justify-center items-center gap-3 flex-col md:flex-row">
              <CheckboxGroup
                label="Car Features"
                value={formData.carFeature}
                orientation="horizontal"
                color="secondary"
                onChange={(values) =>
                  handleCheckboxChange("carFeature", values)
                }
              >
                {featureData.map((feature, index) => (
                  <Checkbox key={index} value={feature.feature}>
                    {feature.feature}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
            <div className="flex justify-center items-center gap-3 flex-col md:flex-row flex-c">
              <CheckboxGroup
                label="Safety Features"
                value={formData.carSafetyFeature}
                color="secondary"
                orientation="horizontal"
                onChange={(values) =>
                  handleCheckboxChange("carSafetyFeature", values)
                }
              >
                {safetyFeatureData.map((safetyFeature, index) => (
                  <Checkbox key={index} value={safetyFeature.feature}>
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
            <div>
              <Button type="submit" className="bg-black text-white">
                Update
              </Button>
            </div>
          </form>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default PostList;
