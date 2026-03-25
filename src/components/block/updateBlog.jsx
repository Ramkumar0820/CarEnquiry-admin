// "use client";
// import { useState, useEffect } from "react";
// import { Input, Button, Select, SelectItem } from "@nextui-org/react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import { ClassicEditor, editorConfig } from "@/lib/editorConfig";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // const BlogId = "66afcce7dad4f0262ab86d5c"

// const Page = ({BlogId}) => {


//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     thumbnail: "",
//     category: "",
//     tag: "",
//     date: "",
//     visibility: "active",
//   });
//   const [categories, setCategories] = useState([]);

//   const [visibilityOptions] = useState(["Active", "Inactive"]);


//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("/api/posts/cat");
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//     fetchListingData();
//   }, []);

//   const fetchListingData = async () => {
//     try {
//       const response = await fetch("/api/posts/");
//       const data = await response.json();
//       const filteredData = data.find((item) => item._id === BlogId);
//       if (filteredData) {
//         setFormData(filteredData);
//         console.log(filteredData);
//       } else {
//         console.error("No data found with the specified _id");
//       }
//     } catch (error) {
//       console.error("Error fetching listing data:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleEditorChange = (event, editor) => {
//     const data = editor.getData();
//     setFormData((prevData) => ({ ...prevData, content: data }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { _id, ...updateData } = formData;

//       const response = await fetch("/api/posts", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: BlogId,
//           updateData,
//         }),
//       });

//       const contentType = response.headers.get("content-type");
//       if (!response.ok) {
//         if (contentType && contentType.includes("application/json")) {
//           const errorData = await response.json();
//           toast.error(errorData.message);
//         } else {
//           toast.error(`Error: ${response.status} - ${response.statusText}`);
//         }
//       } else {
//         const data = await response.json();
//         toast.success(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div>
//       <h3 className="ml-2 font-bold mb-4">Add New Post</h3>


//       <div className="ml-2 mb-4 flex gap-4 md:flex-row flex-col">
//       <Input
//             clearable
//             underlined
//             placeholder="Enter Title"
//             label="Post Main Title"
//             labelPlacement="outside"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//           />
//         <Input
//           clearable
//           underlined
//           placeholder="Thumbnail URL"
//           labelPlacement="outside"
//           label="Thumbnail"
//           name="thumbnail"
//           value={formData.thumbnail}
//           onChange={handleInputChange}
//         />
//         <Input
//           clearable
//           underlined
//           placeholder="Enter tags, separated by commas (e.g., Vasu, Theme, Cars)"
//           labelPlacement="outside"
//           label="Tags"
//           name="tag"
//           value={formData.tag}
//           onChange={handleInputChange}
//         />

//       </div>
//       <div className="ml-2 mb-4 flex gap-4 md:flex-row flex-col">
//         <Select
//           clearable
//           underlined
//           placeholder="Select Category"
//           labelPlacement="outside"
//           label="Category"
//           selectedKeys={[formData.category]}
//           name="category"
//           value={formData.category}
//           onChange={handleSelectChange}
//         >
//           {categories.map((category) => (
//             <SelectItem key={category.category} value={category.category}>
//               {category.category}
//             </SelectItem>
//           ))}
//         </Select>

//         <Input
//           type="date"
//           labelPlacement="outside"
//           label="Date"
//           name="date"
//           value={formData.date}
//           onChange={handleInputChange}
//         />
//         <Select
//           clearable
//           underlined
//           placeholder="Select Visibility"
//           labelPlacement="outside"
//           label="Visibility"
//           name="visibility"
//           value={formData.visibility}
//           selectedKeys={[formData.visibility]}
//           onChange={handleSelectChange}
//         >
//           {visibilityOptions.map((visibilityOptions) => (
//             <SelectItem key={visibilityOptions} value={visibilityOptions}>
//               {visibilityOptions}
//             </SelectItem>
//           ))}
//         </Select>
//       </div>
//       <div className="ml-2 mb-4">
//         <CKEditor
//           editor={ClassicEditor}
//           config={editorConfig}
//           data={formData.content}
//           onChange={handleEditorChange}
//         />
//       </div>
//       <Button className="bg-black text-white" onClick={handleSubmit}>
//         Submit
//       </Button>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Page;
