// Image URL Resolver
export const resolveImageUrl = (image) => {
  if (!image) return "/nodata.jpg";

  // already absolute (http / https)
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  // relative → prefix backend base URL
  return `${baseUrl}${image}`;
};


// Currency Symbol Mapper
export const getCurrencySymbol = (currency) => {
  const symbols = {
    NGN: "₦",
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  return symbols[currency] || "$"; 
};
