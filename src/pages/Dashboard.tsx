import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  BarChart,
  LineChart,
  Settings,
  Users,
  Bell,
  ChevronDown,
  Goal,
  RefreshCw,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

interface Activity {
  _id: string;
  username: string;
  site: string;
  date: string;
  last_updated: string;
  total_time_spent: number;
  timestamp?: string;
}

function Dashboard(): JSX.Element {
  const [data, setData] = useState<Activity[]>([]);
  const [graphData, setGraphData] = useState<
    Record<string, { date: string; timeSpent: number }[]>
  >({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [mostVisitedSite, setMostVisitedSite] = useState("");

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      id: "dashboard",
      to: "/dashboard",
    },
    {
      icon: <Goal size={20} />,
      label: "Set Your Goals",
      id: "goals",
      to: "/goalform",
    },
    {
      icon: <Users size={20} />,
      label: "Users",
      id: "users",
      to: "/User",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      id: "settings",
    },
  ];

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/activities");
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const json = await res.json();
      setData(json);
      processDataForGraph(json);
      calculateStats(json);
      setError(null);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (activities: Activity[]) => {
    // Count unique users
    const uniqueUsers = new Set(activities.map(activity => activity.username));
    setUserCount(uniqueUsers.size);
    
    // Calculate total time spent
    const total = activities.reduce((sum, activity) => sum + activity.total_time_spent, 0);
    setTotalTimeSpent(total);
    
    // Find most visited site
    const siteCounts: Record<string, number> = {};
    activities.forEach(({ site }) => {
      siteCounts[site] = (siteCounts[site] || 0) + 1;
    });
    
    const mostVisited = Object.entries(siteCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    setMostVisitedSite(mostVisited);
  };

  const processDataForGraph = (activities: Activity[]) => {
    const grouped: Record<string, { date: string; timeSpent: number }[]> = {};
    activities.forEach(({ site, date, total_time_spent }) => {
      const d = new Date(date).toISOString().split("T")[0];
      if (!grouped[site]) grouped[site] = [];
      
      // Check if there's already an entry for this site and date
      const existingEntry = grouped[site].find(entry => entry.date === d);
      if (existingEntry) {
        existingEntry.timeSpent += total_time_spent;
      } else {
        grouped[site].push({ date: d, timeSpent: total_time_spent });
      }
    });
    setGraphData(grouped);
  };

  const generateDateRange = (startDate: Date, numDays: number): string[] => {
    const dates: string[] = [];
    const d = new Date(startDate);
    for (let i = 0; i < numDays; i++) {
      dates.unshift(d.toISOString().split("T")[0]);
      d.setDate(d.getDate() - 1);
    }
    return dates;
  };

  const pieChartData = {
    labels: Object.keys(graphData),
    datasets: [
      {
        label: "Total Time Spent (mins)",
        data: Object.values(graphData).map(siteData => 
          siteData.reduce((sum, entry) => sum + entry.timeSpent, 0)
        ),
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#f43f5e",
          "#22d3ee",
          "#ec4899",
          "#14b8a6",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getBarChartData = () => {
    const grouped: Record<string, Record<string, number>> = {};
    const datesSet = new Set<string>();
    
    data.forEach(({ site, date, total_time_spent }) => {
      const d = new Date(date).toISOString().split("T")[0];
      datesSet.add(d);
      if (!grouped[site]) grouped[site] = {};
      grouped[site][d] = (grouped[site][d] || 0) + total_time_spent;
    });

    const sortedDates = Array.from(datesSet).sort();
    return {
      labels: sortedDates,
      datasets: Object.entries(grouped).map(([site, values], i) => ({
        label: site,
        data: sortedDates.map((d) => values[d] || 0),
        backgroundColor: `hsl(${(i * 50) % 360}, 70%, 60%)`,
        borderRadius: 6,
      })),
    };
  };

  const getLineChartData = () => {
    const allDates = new Set<string>();
    let latestDate = new Date();

    Object.values(graphData).forEach((entries) => {
      entries.forEach(({ date }) => {
        const parsed = new Date(date);
        if (!isNaN(parsed.getTime())) {
          allDates.add(date);
          if (parsed > latestDate) latestDate = parsed;
        }
      });
    });

    const minDays = 4;
    generateDateRange(latestDate, minDays).forEach((d) => allDates.add(d));
    const sortedDates = Array.from(allDates).sort();

    const datasets = Object.entries(graphData).map(([site, entries], i) => {
      const map: Record<string, number> = {};
      entries.forEach(({ date, timeSpent }) => {
        map[new Date(date).toISOString().split("T")[0]] = timeSpent;
      });

      return {
        label: site,
        data: sortedDates.map((d) => map[d] || 0),
        borderColor: `hsl(${(i * 60) % 360}, 70%, 60%)`,
        backgroundColor: "transparent",
        tension: 0.3,
        fill: false,
      };
    });

    return { labels: sortedDates, datasets };
  };

  const getUsersPerSite = () => {
    const sitesUsers: Record<string, Set<string>> = {};
    
    data.forEach(({ site, username }) => {
      if (!sitesUsers[site]) sitesUsers[site] = new Set();
      sitesUsers[site].add(username);
    });
    
    return {
      labels: Object.keys(sitesUsers),
      datasets: [
        {
          label: "Number of Users",
          data: Object.values(sitesUsers).map(users => users.size),
          backgroundColor: `hsl(210, 70%, 60%)`,
          borderRadius: 6,
        }
      ]
    };
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-gray-700">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          R-Watch
        </div>
        <nav className="mt-4 space-y-1">
          {menuItems.map((item) =>
            item.to ? (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 space-x-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 space-x-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Navbar */}
        <nav className="sticky top-0 bg-[#1e293b]/80 backdrop-blur-sm border-b border-gray-700 px-6 py-4 flex justify-between items-center z-50">
          <div className="text-xl font-semibold">Global Analytics Dashboard</div>
          <div className="flex items-center space-x-8 text-gray-300">
          <Link to="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>Home</span>
            </div>
          </Link>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-white">
              <span>Tools</span>
              <ChevronDown size={18} />
            </div>
            <span className="cursor-pointer hover:text-white">Contact Us</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <button className="px-4 py-1 border border-white/20 rounded-full hover:bg-white/10">
                Log in
              </button>
            </Link>
            <button className="px-4 py-1 bg-white/10 rounded-full hover:bg-white/20">
              Schedule a Call
            </button>
          </div>
        </nav>

        {/* Data Controls */}
        <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchAllData}
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Data
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
          </div>
        </div>

        {/* Main Dashboard */}
        <main className="p-8 space-y-12">
          {error && (
            <div className="bg-red-800/30 text-red-200 border border-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-xl p-6 border border-blue-500/20">
              <div className="text-blue-300 mb-2 flex items-center gap-2">
                <Users size={16} />
                <span>Total Users</span>
              </div>
              <div className="text-3xl font-bold">{userCount}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/30 to-green-800/30 rounded-xl p-6 border border-green-500/20">
              <div className="text-green-300 mb-2 flex items-center gap-2">
                <BarChart size={16} />
                <span>Total Time (mins)</span>
              </div>
              <div className="text-3xl font-bold">{totalTimeSpent.toLocaleString()}</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-xl p-6 border border-purple-500/20">
              <div className="text-purple-300 mb-2 flex items-center gap-2">
                <PieChart size={16} />
                <span>Most Visited Site</span>
              </div>
              <div className="text-3xl font-bold text-ellipsis overflow-hidden">
                {mostVisitedSite || "N/A"}
              </div>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="text-center text-gray-400 pt-20">
              {loading ? "Loading data..." : "No data to display. Click Refresh Data to load."}
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
                <div className="w-full lg:w-1/2 bg-gray-900/40 rounded-xl p-4 h-[400px] flex flex-col">
                  <h2 className="text-lg font-semibold text-center mb-4">
                    Overall Time Spent by Site
                  </h2>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[350px] h-[300px]">
                      <Pie
                        data={pieChartData}
                        options={{ maintainAspectRatio: false }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 bg-gray-900/40 rounded-xl p-4 h-[400px] flex flex-col">
                  <h2 className="text-lg font-semibold text-center mb-4">
                    Users per Site
                  </h2>
                  <div className="flex-1">
                    <Bar
                      data={getUsersPerSite()}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 rounded-xl p-4 flex flex-col">
                <h2 className="text-lg font-semibold text-center mb-4">
                  Daily Time per Site
                </h2>
                <div className="h-80">
                  <Bar
                    data={getBarChartData()}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>

              <div className="bg-gray-900/40 rounded-xl p-4 flex flex-col">
                <h2 className="text-lg font-semibold text-center mb-4">
                  Site Activity Over Time
                </h2>
                <div className="h-80">
                  <Line 
                    data={getLineChartData()} 
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;