import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStart } from "@/lib/dbConnect";

// ----------------- Database Connection -----------------
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState !== 1) {
    await mongoose.connect(connectionStart);
    console.log("Connected to MongoDB");
  }
};

const normalizePrice = (price) => Number(String(price || 0).replace(/,/g, ""));

// ----------------- API GET Handler -----------------
export async function GET(req) {
  try {
    await connectToDatabase();

    const db = mongoose.connection;
    const carCollection = db.collection("CrasListing");
    const inquiryCollection = db.collection("CarInquiries");

    // ----------------- Get query year -----------------
    const url = new URL(req.url);
    const queryYear = url.searchParams.get("year");
    const currentYear = new Date().getFullYear();

    // ----------------- Find all years with sales -----------------
    const yearsWithSalesRaw = await carCollection.aggregate([
      { $match: { availability: "OutOfStock", soldAt: { $ne: null } } },
      { $group: { _id: { year: { $year: "$soldAt" } } } },
      { $sort: { "_id.year": 1 } }
    ]).toArray();

    const availableYears = yearsWithSalesRaw.map(y => y._id.year);

    // Use queryYear if provided, otherwise default to current year
    const year = queryYear ? parseInt(queryYear) : currentYear;

    // ----------------- Month-wise sales for selected year -----------------
    const monthWiseSalesRaw = await carCollection.aggregate([
      {
        $match: {
          availability: "OutOfStock",
          soldAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $addFields: {
          numericPrice: {
            $convert: {
              input: {
                $replaceAll: {
                  input: { $toString: { $ifNull: ["$price", "0"] } },
                  find: ",",
                  replacement: ""
                }
              },
              to: "double",
              onError: 0,  // handles empty strings, invalid values
              onNull: 0    // handles null
            }
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$soldAt" } },
          totalSoldCars: { $sum: 1 },
          totalSoldAmount: { $sum: "$numericPrice" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]).toArray();

    const months = [
      { month: "Jan", count: 0, amount: 0 },
      { month: "Feb", count: 0, amount: 0 },
      { month: "Mar", count: 0, amount: 0 },
      { month: "Apr", count: 0, amount: 0 },
      { month: "May", count: 0, amount: 0 },
      { month: "Jun", count: 0, amount: 0 },
      { month: "Jul", count: 0, amount: 0 },
      { month: "Aug", count: 0, amount: 0 },
      { month: "Sep", count: 0, amount: 0 },
      { month: "Oct", count: 0, amount: 0 },
      { month: "Nov", count: 0, amount: 0 },
      { month: "Dec", count: 0, amount: 0 },
    ];

    monthWiseSalesRaw.forEach(item => {
      const index = item._id.month - 1;
      months[index].count = item.totalSoldCars;
      months[index].amount = item.totalSoldAmount;
    });

    const monthWiseSales = { year, months };

    // ----------------- Cars & Inventory -----------------
    const carData = await carCollection.find({}).toArray();
    const totalInquiries = await inquiryCollection.find({}).toArray();
    const pendingInquiries = totalInquiries.filter(u => u.markAsRead === false).length;

    let totalCars = carData.length;
    let inStock = 0;
    let outOfStock = 0;
    let totalInventoryAmount = 0;
    let totalSoldAmount = 0;

    carData.forEach(car => {
      const price = normalizePrice(car.price);
      totalInventoryAmount += price;

      if (car.availability === "OutOfStock") {
        outOfStock++;
        totalSoldAmount += price;
      } else {
        inStock++;
      }
    });

    // ----------------- Response -----------------
    return NextResponse.json({
      totalCars,
      inStock,
      outOfStock,
      totalInventoryAmount,
      totalSoldAmount,
      pendingInquiries,
      availableYears,
      monthWiseSales
    });

  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}