"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, BookOpen, Brain, BarChart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-indigo-400/20 to-pink-500/20 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, black 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <Sparkles size={14} className="mr-1.5" />
              Powered by DAIN AI
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Turn Academic Chaos Into Productive Focus
            </h1>
            
            <p className="mt-6 text-xl text-zinc-600 leading-relaxed">
              The ultimate productivity assistant that merges your Canvas courses, Google Calendar, 
              and AI-driven insights to help you achieve academic excellence.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-zinc-300">
                See How It Works
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <Calendar size={18} className="text-green-600" />
                </div>
                <span className="ml-2 text-zinc-700">Calendar Integration</span>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BookOpen size={18} className="text-purple-600" />
                </div>
                <span className="ml-2 text-zinc-700">Canvas Sync</span>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Brain size={18} className="text-blue-600" />
                </div>
                <span className="ml-2 text-zinc-700">AI Insights</span>
              </div>
            </div>
          </motion.div>
          
          {/* App Preview */}
          <motion.div 
            className="relative flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main app window */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
                <div className="h-10 bg-zinc-100 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 text-center text-xs text-zinc-500 font-medium">StudyDash</div>
                </div>
                
                <div className="p-6">
                  {/* App content mockup */}
                  <div className="flex mb-6">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Good afternoon, Alex!</h2>
                      <p className="text-xs text-zinc-500">Here's your academic progress for today</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-blue-50 rounded-md text-blue-600 text-xs font-medium">Focus Mode</div>
                      <div className="px-3 py-1 bg-indigo-50 rounded-md text-indigo-600 text-xs font-medium">AI Assistant</div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { label: "Study Streak", value: "12 days", color: "blue" },
                      { label: "Focus Score", value: "87/100", color: "purple" },
                      { label: "Trend", value: "+12%", color: "green" },
                      { label: "Progress", value: "65%", color: "indigo" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white rounded-xl border border-zinc-100 shadow-sm p-3 flex justify-between items-center">
                        <div>
                          <div className={`text-xs text-zinc-500`}>{stat.label}</div>
                          <div className={`text-sm font-bold text-${stat.color}-600`}>{stat.value}</div>
                        </div>
                        <div className={`w-6 h-6 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                          {i === 0 && <Clock size={12} className={`text-${stat.color}-500`} />}
                          {i === 1 && <Brain size={12} className={`text-${stat.color}-500`} />}
                          {i === 2 && <BarChart size={12} className={`text-${stat.color}-500`} />}
                          {i === 3 && <div className={`h-3 w-3 rounded-full bg-${stat.color}-500`} />}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart */}
                  <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-4 mb-5">
                    <div className="text-sm font-bold text-zinc-800 mb-2">Weekly Productivity</div>
                    <div className="h-28 flex items-end gap-2 justify-between px-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div 
                            className="w-6 rounded-t-sm bg-gradient-to-t from-blue-500 to-indigo-500" 
                            style={{ height: `${Math.random() * 70 + 10}px` }}
                          ></div>
                          <div className="text-[10px] text-zinc-500">{day}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Upcoming assignments */}
                  <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-4 mb-4">
                    <div className="text-sm font-bold text-zinc-800 mb-2">Upcoming Deadlines</div>
                    <div className="space-y-2">
                      {[
                        { title: "CS 401 Final Project", course: "Computer Science", priority: "high" },
                        { title: "ECON 210 Assignment", course: "Economics", priority: "medium" },
                      ].map((item, i) => (
                        <div key={i} className="border border-zinc-100 rounded-lg p-2 flex justify-between items-center">
                          <div>
                            <div className="text-xs font-medium">{item.title}</div>
                            <div className="text-[10px] text-zinc-500">{item.course}</div>
                          </div>
                          <div className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                            item.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {item.priority}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI insights preview */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-3">
                    <div className="flex items-center mb-2">
                      <Sparkles size={12} className="text-indigo-600 mr-1" />
                      <div className="text-xs font-bold text-indigo-700">AI Recommendation</div>
                    </div>
                    <div className="text-[10px] text-indigo-700">
                      Focus on CS 401 Project (30% of grade). Schedule 3 hours today to maintain your A grade.
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements behind the app */}
              <div className="absolute -top-4 -right-4 -bottom-4 -left-4 -z-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              <div className="absolute -top-2 -right-2 -bottom-2 -left-2 -z-10 bg-white/50 rounded-2xl border border-zinc-200/50 backdrop-blur-sm"></div>
              
              {/* Floating notifications */}
              <motion.div 
                className="absolute -right-12 top-20 bg-white rounded-lg shadow-lg border border-zinc-200 p-3 w-48"
                animate={{ y: [0, -5, 0], opacity: [0.9, 1, 0.9] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <div className="flex items-start gap-2">
                  <Calendar size={14} className="text-green-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium">Study Block Added</div>
                    <div className="text-[10px] text-zinc-500">CS 401 - Today at 3PM</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -left-16 bottom-32 bg-white rounded-lg shadow-lg border border-zinc-200 p-3 w-48"
                animate={{ y: [0, 5, 0], opacity: [0.9, 1, 0.9] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1.5, ease: "easeInOut" }}
              >
                <div className="flex items-start gap-2">
                  <Brain size={14} className="text-purple-500 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium">Focus Alert</div>
                    <div className="text-[10px] text-zinc-500">Your optimal study time is now!</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Brief feature section */}
      <motion.div 
        className="container mx-auto px-4 pb-32 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="bg-white rounded-xl p-6 shadow-xl shadow-blue-500/5 border border-zinc-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-zinc-800">Smart Scheduling</h3>
          <p className="text-zinc-600">Automatically finds optimal study blocks in your Google Calendar based on your peak productivity times.</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-xl shadow-purple-500/5 border border-zinc-200">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-zinc-800">Canvas Integration</h3>
          <p className="text-zinc-600">Seamlessly syncs with Canvas to prioritize assignments based on due dates, weights, and grades.</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-xl shadow-indigo-500/5 border border-zinc-200">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-zinc-800">AI Insights</h3>
          <p className="text-zinc-600">Leverages DAIN AI to analyze your learning patterns and provide personalized recommendations.</p>
        </div>
      </motion.div>
    </div>
  );
}