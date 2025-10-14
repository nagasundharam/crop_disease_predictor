//const axios = require("axios");
//require("dotenv").config();
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function mandi(state, district, crop) {
  try {
    const apiKey = process.env.MANDI_API;
    const encodedState = encodeURIComponent(state);
    const encodedDistrict = encodeURIComponent(district);
    const encodedCrop = encodeURIComponent(crop);
    const url =`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&filters[state]=${encodedState}&filters[district]=${encodedDistrict}&filters[commodity]=${encodedCrop}&limit=10`
    console.log("Making API call to:", url);
    const response = await axios.get(url);
    
    const records = response.data.records.map((item) => ({
      state: item.state,
      district: item.district,
      market: item.market,
      commodity: item.commodity,
      variety: item.variety,
      grade: item.grade,
      arrival_date: item.arrival_date,
      min_price: item.min_price,
      max_price: item.max_price,
      modal_price: item.modal_price
    }));

    return records;
  } catch (error) {
    console.error("Error fetching mandi data:", error);
    return [];
  }
};


