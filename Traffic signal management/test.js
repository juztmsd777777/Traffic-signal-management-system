import React, { useState, useEffect } from 'react';
import { Play, Pause, AlertTriangle, Activity, Car, MapPin, Settings, Zap, Eye, Video, BarChart3, TrendingUp, Shield, Wifi } from 'lucide-react';

const ModernTrafficDashboard = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [autoMode, setAutoMode] = useState(true);
  const [selectedLane, setSelectedLane] = useState(0);
  const [manualOverrides, setManualOverrides] = useState({});
  const [ambulanceAlert, setAmbulanceAlert] = useState(false);
  const [flashToggle, setFlashToggle] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simulated real-time data
  const [laneData, setLaneData] = useState([
    { id: 1, vehicles: 23, ambulances: 0, greenTime: 45, status: 'active', camera: 'CAM-001' },
    { id: 2, vehicles: 18, ambulances: 1, greenTime: 60, status: 'priority', camera: 'CAM-002' },
    { id: 3, vehicles: 31, ambulances: 0, greenTime: 38, status: 'congested', camera: 'CAM-003' },
    { id: 4, vehicles: 12, ambulances: 0, greenTime: 25, status: 'normal', camera: 'CAM-004' }
  ]);

  const [trafficHistory, setTrafficHistory] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      time: i,
      lane1: Math.floor(Math.random() * 30) + 10,
      lane2: Math.floor(Math.random() * 30) + 15,
      lane3: Math.floor(Math.random() * 30) + 20,
      lane4: Math.floor(Math.random() * 30) + 8
    }))
  );

  // Animation and real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time traffic data updates
      if (isRunning) {
        setLaneData(prev => prev.map(lane => ({
          ...lane,
          vehicles: Math.max(0, lane.vehicles + Math.floor(Math.random() * 6) - 3),
          greenTime: Math.min(180, Math.max(5, lane.greenTime + Math.floor(Math.random() * 10) - 5))
        })));

        // Update history
        setTrafficHistory(prev => {
          const newEntry = {
            time: prev[prev.length - 1].time + 1,
            lane1: Math.floor(Math.random() * 30) + 10,
            lane2: Math.floor(Math.random() * 30) + 15,
            lane3: Math.floor(Math.random() * 30) + 20,
            lane4: Math.floor(Math.random() * 30) + 8
          };
          return [...prev.slice(1), newEntry];
        });
      }

      // Check for ambulance alerts
      setAmbulanceAlert(laneData.some(lane => lane.ambulances > 0));
      if (laneData.some(lane => lane.ambulances > 0)) {
        setFlashToggle(prev => !prev);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]); // ✅ only depend on isRunning

  const totalVehicles = laneData.reduce((sum, lane) => sum + lane.vehicles, 0);
  const activeLanes = laneData.filter(lane => lane.status === 'active' || lane.status === 'priority').length;
  const congestionLevel = totalVehicles > 80 ? 'Severe' : totalVehicles > 50 ? 'High' : 'Normal';

  const getStatusColor = (status) => {
    switch (status) {
      case 'priority': return 'from-red-500 to-red-600';
      case 'active': return 'from-green-500 to-green-600';
      case 'congested': return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getCongestionColor = (level) => {
    switch (level) {
      case 'Severe': return 'text-red-400';
      case 'High': return 'text-orange-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      
      {/* Ambulance Alert Overlay */}
      {ambulanceAlert && (
        <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-300 ${flashToggle ? 'bg-red-500/20' : 'bg-transparent'}`}>
          <div className="flex items-center justify-center h-screen">
            <div className={`bg-red-600/95 backdrop-blur-lg border border-red-400/50 rounded-3xl px-12 py-6 shadow-2xl transform transition-all duration-500 ${flashToggle ? 'scale-110' : 'scale-100'}`}>
              <div className="flex items-center space-x-4 text-2xl font-bold">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
                <span className="bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                  🚨 EMERGENCY VEHICLE DETECTED 🚨
                </span>
                <AlertTriangle className="w-8 h-8 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your UI unchanged... */}
    </div>
  );
};

export default ModernTrafficDashboard;
