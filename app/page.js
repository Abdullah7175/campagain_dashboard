"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Home() {
  const [topCardsData, setTopCardsData] = useState({ Registered: 0, Resolved: 0, Pending: 0 });
  const [sdata, setsData] = useState({ total_registered: 0, webpage: 0, Mobile_App: 0, Call_Center_CC: 0 });
  const [pivotData, setPivotData] = useState([]);

  const [townPivot, setTownPivot] = useState([]);
  const [firstHalfTowns, setFirstHalfTowns] = useState([]);
  const [secondHalfTowns, setSecondHalfTowns] = useState([]);
  
  const [townPivot2, setTownPivot2] = useState([]);
  const [firstHalfTowns2, setFirstHalfTowns2] = useState([]);
  const [secondHalfTowns2, setSecondHalfTowns2] = useState([]);


  useEffect(() => {
    // Fetch data for top cards
    async function fetchTopCards() {
      try {
        const response = await fetch("/api/cards"); // Endpoint for top cards
        const data = await response.json();
        setTopCardsData(data);
      } catch (error) {
        console.error("Error fetching top cards data:", error);
      }
    }

    fetchTopCards();
    const interval = setInterval(() => {
      fetchTopCards();
    }, 10000); // Refresh every 10 seconds
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch data for top cards
    async function fetchs() {
      try {
        const response = await fetch("/api/complain_sources"); // Endpoint for top cards
        const data = await response.json();
        setsData(data);
      } catch (error) {
        console.error("Error fetching top cards data:", error);
      }
    }

    fetchs();
    const interval = setInterval(() => {
      fetchs();
    }, 11000); // Refresh every 10 seconds
  
    return () => clearInterval(interval);
    
  }, []);

  useEffect(() => {
    const fetchPivotData = async () => {
      try {
        const response = await fetch("/api/piviot"); // Replace with your actual API endpoint
        const data = await response.json();
        setPivotData(data);
      } catch (error) {
        console.error("Failed to fetch pivot data:", error);
      }
    };

    fetchPivotData();
    const interval = setInterval(() => {
      fetchPivotData();
    }, 12000); // Refresh every 10 seconds
  
    return () => clearInterval(interval);
  }, []);


// Pivot Table Town wise and complain type damage id 22
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("/api/dashboard"); 
      const result = await response.json();

      const towns = Array.from(new Set(result.map(item => item.Town)));
      const halfIndex = Math.ceil(towns.length / 2);

      setFirstHalfTowns(towns.slice(0, halfIndex));
      setSecondHalfTowns(towns.slice(halfIndex));

      const townPivotData = [
        {
          category: "Registered",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).reduce((acc, item) => acc + item.Total_Complaints, 0).toFixed(0)
            ])
          )
        },
        {
          category: "Pending",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).reduce((acc, item) => acc + item.Pending, 0).toFixed(0)
            ])
          )
        },
        {
          category: "Resolved",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).reduce((acc, item) => acc + item.Resolved, 0).toFixed(0)
            ])
          )
        },
        {
          category: "Percentage",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).length > 0
                ? (
                    result
                      .filter(item => item.Town === town)
                      .reduce((acc, item) => acc + (item.Percentage_Resolved || 0), 0) / 
                    result.filter(item => item.Town === town).length
                  ).toFixed(0) + "%"
                : "N/A"
            ])
          )
        }
      ];

      setTownPivot(townPivotData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  fetchData();
  const interval = setInterval(() => {
    fetchData();
  }, 13000); // Refresh every 13 seconds

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  async function fetchData2() {
    try {
      const response = await fetch("/api/dashboard2"); 
      const result = await response.json();

      const towns = Array.from(new Set(result.map(item => item.Town)));
      const halfIndex = Math.ceil(towns.length / 2);

      setFirstHalfTowns2(towns.slice(0, halfIndex));
      setSecondHalfTowns2(towns.slice(halfIndex));

      const townPivotData2 = [
        {
          category: "Registered",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).reduce((acc, item) => acc + item.Total_Complaints, 0).toFixed(0)
            ])
          )
        },
        {
          category: "Pending",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).reduce((acc, item) => acc + item.Pending, 0).toFixed(0)
            ])
          )
        },
        {
          category: "Resolved",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).reduce((acc, item) => acc + item.Resolved, 0).toFixed(0)
            ])
          )
        },
        {
          category: "Percentage",
          ...Object.fromEntries(
            towns.map(town => [
              town,
              result.filter(item => item.Town === town).length > 0
                ? (
                    result
                      .filter(item => item.Town === town)
                      .reduce((acc, item) => acc + (item.Percentage_Resolved || 0), 0) / 
                    result.filter(item => item.Town === town).length
                  ).toFixed(0) + "%"
                : "0"
            ])
          )
        }
      ];

      setTownPivot2(townPivotData2);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  fetchData2();
  const interval = setInterval(() => {
    fetchData2();
  }, 14000); // Refresh every 14 seconds

  return () => clearInterval(interval);
}, []);

return (
  <div  className="bg-[url(/CMC2.jpg)] bg-cover bg-no-repeat bg-opacity-70 min-h-screen flex flex-col overflow-x-auto text-gray-800"> 
    {/* Header */} 
    <div className="flex flex-col sm:flex-row items-center w-full max-xl justify-between ">
      {/* Logo */} 
      <Image src="/kl.png" alt="Logo" width={180} height={100} />

      {/* Page Title */} 
      <div className="text-2xl sm:text-6xl font-bold flex-1 text-center text-white">
        CMC | KARACHI WATER & SEWERAGE CORPORATION<div className="text-xl sm:text-4xl mt-2 font-bold flex-1 text-center text-white">
        COMPLAIN MANAGEMENT CENTER
      </div>
      </div>
    </div>

    {/* Main Content */} 
    <main className="flex-grow flex flex-col text-center py-0">

      <div className="flex flex-col sm:flex-row items-center w-full max-xl justify-center sm:justify-between ">
      {/* Logo */} 
      <Link href="https://complain.kwsc.gos.pk/" className="text-white flex items-center font-bold text-xl">
        <img
          src="/track.png"
          alt="KWSC Logo"
          className="ml-6 cursor-pointer mr-4 w-[60px] h-[50px]"
        /> Track Complaint
      </Link>

      {/* Page Title */} 
      <div className="text-center font-semibold flex-1 text-gray-800">
        <h2 className="text-2xl mt-1 font-bold text-white">MANHOLE CAMPAIGN LIVE REPORT</h2>
        <p className="text-white">Campaign Starting Date: 8th, January 2025</p>
        
      </div>
    </div>

      {/* Top Cards */} 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 px-2">
        <div className="bg-[#4285eb] p-6 rounded-xl flex items-center justify-between shadow-lg max-w-auto">
          <h3 className="text-lg font-semibold text-white">Total Complaints Registered</h3>
          <p className="text-2xl font-bold text-white">{topCardsData.Registered}</p>
        </div>
        <div className="bg-[#3ef150] p-6 rounded-xl flex items-center justify-between shadow-lg max-w-auto ">
          <h3 className="text-lg font-semibold text-white">Total Complaints Resolved</h3>
          <p className="text-2xl font-bold text-white leading-none">{topCardsData.Resolved}
          <br/><span className="text-white font-bold text-sm  ml-1">{((topCardsData.Resolved / topCardsData.Registered) * 100).toFixed(2)}%</span>
          </p>
        </div>
        <div className="bg-[#f03232] p-6 rounded-xl flex items-center justify-between shadow-lg max-w-auto ">
          <h3 className="text-lg font-semibold text-white">Total Complaints Pending</h3>
          <p className="text-2xl font-bold text-white leading-none">{topCardsData.Pending}
          <br/><span className="text-white font-bold text-sm  ml-1">{((topCardsData.Pending / topCardsData.Registered) * 100).toFixed(2)}%</span>
          </p>
          
        </div>
      </div>

      <div className="text-center font-semibold text-white mt-5">
        <h2 className="text-2xl font-bold text-white">SOURCE OF COMPLAINTS</h2>
      </div>

      {/* Small Cards */} 
      <div className="flex justify-center items-center w-full px-2 mt-5">
        <div className="flex flex-row gap-2">
          <div className="bg-[#235eb6] p-4 rounded-lg shadow-md  h-15">
            <h3 className="text-lg font-semibold text-white ">
              Web-Portal: <span className="font-bold text-white">{sdata.webpage}</span>
            </h3>
          </div>
          <div className="bg-[#efa459] p-4 rounded-lg shadow-md h-15">
            <h3 className="text-lg font-semibold text-white">
              Mobile-App: <span className="font-bold text-white">{sdata.Mobile_App}</span>
            </h3>
          </div>
          <div className="bg-[#3ef150] p-4 rounded-lg shadow-md h-15">
            <h3 className="text-lg font-semibold text-white">
              Call Center: <span className="font-bold text-white">{sdata.Call_Center_CC}</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Pivot Table Town wise */} 
      <div className="pt-4 py-32 px-2 rounded-lg flex items-center max-w-auto">
        <table className="min-w-full shadow-lg rounded">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-2">Sub-Type</th>
              <th className="p-2">Received</th>
              <th className="p-2">Resolved</th>
              <th className="p-2">Pending</th>
              <th className="p-2">Resolved Percentage</th>
            </tr>
          </thead>
          <tbody>
            {pivotData.map((row, index) => (
              <tr key={index} className="text-center odd:bg-blue-200 even:bg-blue-400">
                <td className="border p-2">{row.type}</td>
                <td className="border p-2">{row.total_registered}
                </td>
                <td className="border p-2">{row.resolved}</td>
                <td className="border p-2">{row.pending}</td>
                <td className="border p-2">{row.resolved_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Open Manhole */} 
      <div className="text-center font-semibold  text-white -mt-24">
        <h2 className="text-2xl font-bold">OPEN MANHOLE TOWN WISE</h2>
      </div>

      <div className="px-2  w-[1440px] sm:w-full">
        <table className="my-3 p-6 w-full bg-white shadow-lg rounded max-w-auto">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-300">Category</th>
              {firstHalfTowns.map((town, index) => (
                <th key={`first-half-${index}`} className="border p-2 bg-gray-300">{town}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {townPivot.map((row, index) => (
              <tr key={`pivot-row-${index}`} className="odd:bg-blue-200 even:bg-blue-400">
                <td className="border px-4 py-2 ">{row.category}</td>
                {firstHalfTowns.map(town => (
                  <td key={`town-${town}-${index}`} className="border px-4 py-2 text-center">
                    {typeof row[town] === 'number' ? row[town].toFixed(2) : row[town] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <table className="p-6 w-full bg-white shadow-lg rounded max-w-auto">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-300">Category</th>
              {secondHalfTowns.map(town => (
                <th key={town} className="border p-2 bg-gray-300">{town}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {townPivot.map((row, index) => (
              <tr key={`pivot-row-${index}`} className="odd:bg-blue-200 even:bg-blue-400">
                <td className="border  px-4 py-2">{row.category}</td>
                {secondHalfTowns.map(town => (
                  <td key={town} className="border  px-4 py-2 text-center">
                    {typeof row[town] === 'number' ? row[town].toFixed(2) : row[town] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Damage Manhole */} 
      <div className="text-center font-semibold  text-white mt-5 max-w-auto">
        <h2 className="text-2xl font-bold">DAMAGE MANHOLE TOWN WISE</h2>
      </div>

      <div className="px-2 w-[1440px] sm:w-full">
        <table className="my-3 p-6 w-full bg-white shadow-lg rounded max-w-auto">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-300">Category</th>
              {firstHalfTowns2.map((town, index) => (
                <th key={`first-half-${index}`} className="border p-2 bg-gray-300">{town}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {townPivot2.map((row, index) => (
              <tr key={`pivot-row-${index}`} className="odd:bg-blue-200 even:bg-blue-400">
                <td className="border  px-4 py-2">{row.category}</td>
                {firstHalfTowns2.map(town => (
                  <td key={`town-${town}-${index}`} className="border  px-4 py-2 text-center">
                    {typeof row[town] === 'number' ? row[town].toFixed(2) : row[town] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <table className="p-6 w-full bg-white shadow-lg rounded-xl max-w-auto">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-300">Category</th>
              {secondHalfTowns2.map(town => (
                <th key={town} className="border p-2 bg-gray-300">{town}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {townPivot2.map((row, index) => (
              <tr key={`pivot-row-${index}`} className="odd:bg-blue-200 even:bg-blue-400">
                <td className="border  px-4 py-2">{row.category}</td>
                {secondHalfTowns2.map(town => (
                  <td key={town} className="border  px-4 py-2 text-center">
                    {typeof row[town] === 'number' ? row[town].toFixed(2) : row[town] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>

    {/* Footer */} 
    <footer className="bg-gray-800 text-white py-3 w-[1440px] md:w-full mt-2">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Karachi Water and Sewerage Corporation</p>
      </div>
    </footer>
  </div>
);
}

