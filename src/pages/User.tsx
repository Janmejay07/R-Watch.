import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

interface UserData {
  username: string;
  // Add other user fields as needed
}

function User(): JSX.Element {
  const [data, setData] = useState<Activity[]>([]);
  const [graphData, setGraphData] = useState<
    Record<string, { date: string; timeSpent: number }[]>
  >({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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

  // Verify JWT token and get user data
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("Authentication required");
          setIsLoading(false);
          return;
        }
        
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // Token invalid or expired
          localStorage.removeItem('token');
          setError("Session expired. Please login again.");
          setIsLoading(false);
          return;
        }
        
        // Token is valid, get user data
        const user = await response.json();
        setUserData(user);
        
        // Fetch user activity data
        if (user.username) {
          await fetchUserData(user.username);
        }
        
      } catch (err) {
        console.error("Auth verification error:", err);
        setError(`Authentication error: ${err instanceof Error ? err.message : String(err)}`);
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const fetchUserData = async (username: string) => {
    if (!username) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:5000/api/activities/${username}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      
      const json = await res.json();
      setData(json);
      processDataForGraph(json);
      setError(null);
      return true;
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(null);
    navigate("/login");
  };

  const processDataForGraph = (activities: Activity[]) => {
    const grouped: Record<string, { date: string; timeSpent: number }[]> = {};
    activities.forEach(({ site, date, total_time_spent }) => {
      const d = new Date(date).toISOString().split("T")[0];
      if (!grouped[site]) grouped[site] = [];
      grouped[site].push({ date: d, timeSpent: total_time_spent });
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
    labels: data.map((d) => d.site),
    datasets: [
      {
        label: "Time Spent (mins)",
        data: data.map((d) => d.total_time_spent),
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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#0f172a] text-white justify-center items-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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
          <div className="text-xl font-semibold">Analytics Dashboard</div>
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
            {userData ? (
              <>
                <span className="text-sm text-gray-300">
                  Welcome, {userData.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-1 border border-white/20 rounded-full hover:bg-white/10"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="px-4 py-1 border border-white/20 rounded-full hover:bg-white/10">
                  Log in
                </button>
              </Link>
            )}
            <button className="px-4 py-1 bg-white/10 rounded-full hover:bg-white/20">
              Schedule a Call
            </button>
          </div>
        </nav>

        {/* User Info Banner */}
        <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-[#0f172a]">
          <div className="flex items-center space-x-4">
            {userData ? (
              <div className="text-lg">
                Viewing data for: <span className="font-semibold text-blue-400">{userData.username}</span>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="text-yellow-500">
                  Please log in to view your data
                </div>
                <Link to="/login">
                  <button className="px-4 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition">
                    Go to Login
                  </button>
                </Link>
              </div>
            )}
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

          {!userData ? (
            <div className="text-center text-gray-400 pt-20">
              Please log in to see your data.
            </div>
          ) : data.length === 0 ? (
            <div className="text-center text-gray-400 pt-20">
              No data available for {userData.username}.
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
                <div className="w-full lg:w-1/2 bg-gray-900/40 rounded-xl p-4 h-[400px] flex flex-col">
                  <h2 className="text-lg font-semibold text-center mb-4">
                    Overall Time Spent (Pie)
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
                    Daily Time per Site (Bar)
                  </h2>
                  <div className="flex-1">
                    <Bar
                      data={getBarChartData()}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-5xl mx-auto">
                <h2 className="text-lg font-semibold text-center mb-4">
                  Site Activity Over Time (Line)
                </h2>
                <Line data={getLineChartData()} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default User;