import axios from "axios";

const P_URL="https://mridulverma-cropprediction.hf.space/predict"

export async function predictCrop(inputData) {
  try {
    const response = await axios.post(
      P_URL,      // Hugging Face Model Endpoint
      inputData,
      {
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    );

    return response.data; // This is the JSON output from Hugging Face
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
}
