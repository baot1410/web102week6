import { useState, useEffect } from 'react'
import './App.css'

import Header from "./components/Header"
import NavBar from "./components/NavBar"
import Card from "./components/Card"
import WeatherList from "./components/WeatherList"

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
const [weatherData, setWeatherData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tempFilter, setTempFilter] = useState("")
  const [activeView, setActiveView] = useState("dashboard")

  // Fetch weather data for multiple cities
  const cities = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Chicago", lat: 41.8781, lon: -87.6298 },
    { name: "Houston", lat: 29.7604, lon: -95.3698 },
    { name: "Phoenix", lat: 33.4484, lon: -112.074 },
    { name: "Philadelphia", lat: 39.9526, lon: -75.1652 },
    { name: "San Antonio", lat: 29.4241, lon: -98.4936 },
    { name: "San Diego", lat: 32.7157, lon: -117.1611 },
    { name: "Dallas", lat: 32.7767, lon: -96.797 },
    { name: "San Jose", lat: 37.3382, lon: -121.8863 },
    { name: "Austin", lat: 30.2672, lon: -97.7431 },
    { name: "Jacksonville", lat: 30.3322, lon: -81.6557 },
    { name: "Miami", lat: 25.7617, lon: -80.1918 },
    { name: "Seattle", lat: 47.6062, lon: -122.3321 },
    { name: "Denver", lat: 39.7392, lon: -104.9903 },
    { name: "Boston", lat: 42.3601, lon: -71.0589 },
    { name: "Las Vegas", lat: 36.1699, lon: -115.1398 },
    { name: "Portland", lat: 45.5152, lon: -122.6784 },
    { name: "Nashville", lat: 36.1627, lon: -86.7816 },
    { name: "Atlanta", lat: 33.749, lon: -84.388 },
  ]

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const promises = cities.map(async (city) => {
          const response = await fetch(
            `https://api.weatherbit.io/v2.0/current?lat=${city.lat}&lon=${city.lon}&key=${API_KEY}&units=I`,
          )
          const data = await response.json()
          return {
            ...data.data[0],
            cityName: city.name,
          }
        })

        const results = await Promise.all(promises)
        setWeatherData(results)
        setFilteredData(results)
      } catch (error) {
        console.error("Error fetching weather data:", error)
      }
    }

    fetchWeatherData()
  }, [])

  // Filter data based on search and temperature filter
  useEffect(() => {
    let filtered = weatherData

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.weather.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (tempFilter) {
      filtered = filtered.filter((item) => {
        const temp = item.temp
        switch (tempFilter) {
          case "cold":
            return temp < 50
          case "mild":
            return temp >= 50 && temp < 70
          case "warm":
            return temp >= 70 && temp < 85
          case "hot":
            return temp >= 85
          default:
            return true
        }
      })
    }

    setFilteredData(filtered)
  }, [searchTerm, tempFilter, weatherData])

  // Calculate summary statistics
  const getStats = () => {
    if (weatherData.length === 0) return { avgTemp: 0, maxTemp: 0, minTemp: 0 }

    const temps = weatherData.map((item) => item.temp)
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
    const maxTemp = Math.max(...temps).toFixed(1)
    const minTemp = Math.min(...temps).toFixed(1)

    return { avgTemp, maxTemp, minTemp }
  }

  const stats = getStats()

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <NavBar activeView={activeView} setActiveView={setActiveView} />
        <div className="dashboard">
          {activeView === "dashboard" && (
            <>
              <div className="cards-container">
                <Card title="Average Temp" value={`${stats.avgTemp}°F`} />
                <Card title="Highest Temp" value={`${stats.maxTemp}°F`} />
                <Card title="Lowest Temp" value={`${stats.minTemp}°F`} />
              </div>
              <WeatherList
                data={filteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
              />
            </>
          )}
          {activeView === "search" && (
            <div className="search-view">
              <h2>Search Weather Data</h2>
              <WeatherList
                data={filteredData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
              />
            </div>
          )}
          {activeView === "about" && (
            <div className="about-view">
              <h2>About WeatherDash</h2>
              <p>This dashboard displays current weather data for major US cities using the WeatherBit API.</p>
              <p>Features include real-time weather data, search functionality, and temperature filtering.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
