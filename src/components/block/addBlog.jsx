// "use client";
// import { useState, useEffect } from "react";
// import { Input, Button, Select, SelectItem } from "@nextui-org/react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import { ClassicEditor, editorConfig } from "@/lib/editorConfig";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Page = () => {
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
//   }, []);

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

//   const handleSubmit = async () => {
//     try {
//       console.log("Submitting form data:", formData); // Debugging: log form data

//       const response = await fetch("/api/posts", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Network response was not ok");
//       }

//       const result = await response.json();
//       toast.success("Post added successfully!");
//       setFormData({
//         title: "",
//         content: "",
//         thumbnail: "",
//         category: "",
//         tag: "",
//         date: "",
//         visibility: "active",
//       });
//     } catch (error) {
//       toast.error(`Failed to add post: ${error.message}`);
//       console.error("Error:", error);
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
