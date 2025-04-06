import {
  ChevronDown,
  Sparkles,
  Target,
  BarChart3,
  Zap,
  Settings2,
  Search,
  BrainCircuit,
} from "lucide-react";
import { Link } from "react-router-dom";

const companies = [
  "VS Code",
  "Canva",
  "Chrome",
  "Blender",
  "Brave",
  "Edge",
  "Cursor",
  "Eclipse",
  "Postman",
  "Jupitor",
  "PyCharm",
  "IntelliJ IDEA",
  "Pulser",
  "Twitter",
  "LinkedIn",
];

const platforms = [
  {
    name: "Chrome",
    icon: "https://images.unsplash.com/photo-1633355444132-695d5876cd00?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Vs Code",
    icon: "https://images.unsplash.com/photo-1607706189992-eae578626c86?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Brave",
    icon: "https://images.unsplash.com/photo-1633355444502-721f3b299e6b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "IntelliJ IDEA",
    icon: "https://images.unsplash.com/photo-1633355444543-c5c2c8f00c3a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Cursor",
    icon: "https://images.unsplash.com/photo-1633355444234-567d8c85e4a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    name: "Eclipse",
    icon: "https://images.unsplash.com/photo-1633355444123-789ed237c000?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

const features = [
  {
    icon: Target,
    title: "Unlock Your Digital Habits",
    description:
      "Get detailed insights into your browsing and coding sessions. Know what’s helping—or hurting—your focus.",
    className: "col-span-2",
  },
  {
    icon: Settings2,
    badge: "GEN AI Powered",
    title: "Productivity made Simpler",
    description:
      "Let our AI track your activities, analyze patterns, and suggest ways to boost efficiency—so you can focus on what matters most.",
    className: "col-span-2",
  },
  {
    icon: BarChart3,
    title: "Smart Productivity Insights",
    description:
      "Gain actionable insights from your daily activity. Discover patterns, improve your habits, and make informed decisions to maximize your time and output.",
    className: "col-span-2",
  },
  {
    icon: Zap,
    title: "Intelligent Tracking Agents",
    description:
      "Let AI do the watching. Our smart agents monitor your digital activity in real-time, helping you stay focused, boost productivity, and make every second count.",
    className: "col-span-2",
  },
  {
    icon: Search,
    badge: "Advanced SEO",
    title: "Smart Usage Optimization",
    description:
      "Optimize how you spend your time online. Our intelligent tracker highlights inefficiencies, suggests improvements, and helps you build better digital habits in real-time.",
    className: "col-span-2",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Insights Generation",
    description:
      "Automatically turn your activity data into smart insights. Our AI understands your usage patterns and helps you set optimized goals for better focus and performance.",
    className: "col-span-2",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white font-['Poppins']">
      {/* Navigation Bar */}
      <nav
        className="fixed top-8 left-1/2 -translate-x-1/2 w-[1176px] h-[63px] px-6 py-4 
                    bg-[#5C60691A] border border-[#FFFFFF1A] rounded-2xl backdrop-blur-md
                    flex items-center justify-between z-50"
      >
        <div className="text-2xl font-semibold">R-Watch</div>

        <div className="flex items-center space-x-8">
          <Link to="/dashboard">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span>Dashboard</span>
            </div>
          </Link>

          <div className="flex items-center space-x-2 cursor-pointer">
            <span>Tools</span>
            <ChevronDown size={20} />
          </div>
          <span className="cursor-pointer">Contact Us</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <button className="px-6 py-2 rounded-full border border-transparent hover:border-white/20 transition-all">
              Log in
            </button>
          </Link>
          <button className="px-6 py-2 bg-[#5C60691A] rounded-full hover:bg-[#5C606940] transition-all backdrop-blur-sm">
            Schedule a Call
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 flex flex-col items-center">
        <div className="flex items-center space-x-2 px-6 py-3 bg-[#5C60691A] backdrop-blur-sm rounded-full mb-20">
          <Sparkles className="text-[#5C6069]" size={20} />
          <span className="text-sm">
            See It. Track It. Improve It. Your Digital Usage Redefined.
          </span>
        </div>

        <div className="relative">
          <div className="absolute -inset-40 bg-[#5C606940] blur-[120px] rounded-full mix-blend-plus-lighter"></div>
          <h1 className="text-8xl font-bold text-center mb-8 relative z-10">
            R-Watch
          </h1>
        </div>

        <p className="max-w-[767px] text-center text-base leading-[1.4] text-gray-300 mb-8">
          Our intelligent tracker gives you complete visibility into your online
          habits and guides you toward peak productivity – instantly and
          effortlessly.
        </p>

        <button className="px-8 py-4 bg-[#5C60691A] backdrop-blur-sm rounded-full text-lg font-medium hover:bg-[#5C606940] transition-all">
          Start Free Trial
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Try R-Watch free for 30 days
        </p>

        {/* Company Scroller */}
        <div className="relative w-full mt-20 overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:w-[100px] before:h-full before:bg-gradient-to-r before:from-[#0C0C0C] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:w-[100px] after:h-full after:bg-gradient-to-l after:from-[#0C0C0C] after:to-transparent">
          <div className="flex animate-scroll">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex-none mx-8 text-2xl font-medium text-gray-500 whitespace-nowrap"
              >
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Platform Integration Section */}
        <section className="w-full max-w-[1176px] mx-auto mt-32 px-4">
          <div className="text-center mb-16">
            <h3 className="text-2xl mb-8">R-Watch works with :</h3>
            <div className="grid grid-cols-6 gap-8">
              {platforms.map((platform, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-[#1A1A1A] rounded-2xl p-4 mb-4 flex items-center justify-center">
                    <img
                      src={platform.icon}
                      alt={platform.name}
                      className="w-12 h-12 object-contain opacity-60"
                    />
                  </div>
                  <span className="text-sm text-gray-400">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-[1176px] mx-auto mt-16 px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-[#1A1A1A] rounded-full text-sm mb-8">
              FEATURES
            </div>
            <h2 className="text-6xl font-bold mb-6">
              Feature-packed to track better
              <br />
              <span className="bg-gradient-to-r from-[#4B6CB7] to-[#182848] text-transparent bg-clip-text">
                think smarter.
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Make the most of every moment with real-time insights into your
              digital activity. Your productivity, reimagined with intelligent
              tools.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="w-[1120px] mx-auto grid grid-cols-6 gap-8 mb-32">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative bg-[#1A1A1A] rounded-3xl p-8 backdrop-blur-sm
                          border border-white/5 hover:border-white/10 transition-all
                          flex flex-col ${feature.className || ""}`}
              >
                <div className="mb-4">
                  {feature.badge && (
                    <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs mb-4">
                      {feature.badge}
                    </span>
                  )}
                  <feature.icon className="w-12 h-12 text-white/60" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 rounded-3xl transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full flex justify-center px-4 mb-20">
          <div className="w-full max-w-[1176px] bg-[#5C60691A] backdrop-blur-md border border-white/10 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-center mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-400 text-center mb-12">
              We'd love to hear from you. Let us know how we can help.
            </p>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                className="bg-[#1A1A1A] placeholder-gray-500 p-4 rounded-2xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5C6069]"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="bg-[#1A1A1A] placeholder-gray-500 p-4 rounded-2xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5C6069]"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="md:col-span-2 bg-[#1A1A1A] placeholder-gray-500 p-4 rounded-2xl border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5C6069]"
              ></textarea>
              <button
                type="submit"
                className="md:col-span-2 bg-[#5C60691A] hover:bg-[#5C606940] text-white font-semibold py-3 rounded-full transition-all border border-white/10"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
