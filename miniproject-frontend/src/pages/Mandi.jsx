import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import "./Mandi.css";

const Mandi = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("https://indian-states-api.vercel.app/api/states");
        const data = await res.json();
        const sortedStates = data.states.sort((a, b) => a.state.localeCompare(b.state));
        setStates(sortedStates.map((s) => ({ value: s.state, label: s.state })));
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (!selectedState) {
      setDistricts([]);
      setSelectedDistrict(null);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const res = await fetch(`https://indian-states-api.vercel.app/api/districts/${selectedState.value}`);
        const data = await res.json();
        const sortedDistricts = data.districts.sort((a, b) => a.localeCompare(b));
        setDistricts(sortedDistricts.map((d) => ({ value: d, label: d })));
        setSelectedDistrict(null);
      } catch (err) {
        console.error("Failed to fetch districts:", err);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  // Mock commodity list
  useEffect(() => {
    const commodityData = [
      "Coconut",
      "Tender Coconut",
      "Rice",
      "Wheat",
      "Sugar",
      "Tomato",
      "Onion",
      "Potato",
    ];
    setCommodities(commodityData.map((c) => ({ value: c, label: c })));
  }, []);

  // Fetch mandi details
  const fetchMandiDetails = async () => {
    if (!selectedState || !selectedDistrict || !selectedCommodity) {
      alert("Please select state, district, and commodity");
      return;
    }
    console.log("Fetching mandi for:", selectedState, selectedDistrict, selectedCommodity.value);

    setLoading(true);
    try {

      const res = await fetch(`${BACKEND_URL}/mandi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: selectedState.value,
          district: selectedDistrict.value,
          crop: selectedCommodity.value,
        }),
      });
      const data = await res.json();
      // Expecting { records: [...] } format
      setResults(data.records || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch mandi data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mandi-container">
      <h1>Mandi Price Checker</h1>

      <div className="selectors">
  <Select
    options={states}
    value={selectedState}
    onChange={setSelectedState}
    placeholder="Select State"
    isSearchable
  />
  <Select
    options={districts}
    value={selectedDistrict}
    onChange={setSelectedDistrict}
    placeholder="Select District"
    isDisabled={!selectedState}
    isSearchable
  />

  {/* ✨ Replace Select with input field */}
 <CreatableSelect
  options={commodities}
  value={selectedCommodity}
  onChange={setSelectedCommodity}
  placeholder="Select or Type Commodity"
  isSearchable
  formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
  onCreateOption={(inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setCommodities((prev) => [...prev, newOption]);
    setSelectedCommodity(newOption);
  }}
/>
  <button onClick={fetchMandiDetails} disabled={loading}>
    {loading ? "Loading..." : "Fetch Prices"}
  </button>
</div>

      

      <div className="results-grid">
  {results.length === 0 && !loading && (
    <p className="no-data">No data found. Try different filters.</p>
  )}

  {results.map((item, idx) => (
    <div key={idx} className="result-card">
      <div className="result-header">
        <h3>{item.market}</h3>
        <span className="date">{item.arrival_date}</span>
      </div>

      <div className="commodity-info">
        <p>
          <strong>Commodity:</strong> {item.commodity}
        </p>
        <p>
          <strong>Variety:</strong> {item.variety || "—"} &nbsp;|&nbsp;{" "}
          <strong>Grade:</strong> {item.grade || "—"}
        </p>
      </div>

      <div className="price-box">
        <div>
          <span className="label">Min</span>
          <span className="value">₹{item.min_price}</span>
        </div>
        <div>
          <span className="label">Max</span>
          <span className="value">₹{item.max_price}</span>
        </div>
        <div>
          <span className="label">Moderate</span>
          <span className="value highlight">₹{item.modal_price}</span>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default Mandi;
