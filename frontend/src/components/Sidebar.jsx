// components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBarChart2,
  FiBook,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiTarget, // Icon mới cho Backtest (siêu hợp!)
  FiSettings, // Dự phòng
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Thứ tự menu được sắp xếp theo tần suất sử dụng thực tế của trader pro
  const menuItems = [
    { to: "/", icon: FiBook, label: "Trade Log" },
    { to: "/dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/playbook", icon: FiSettings, label: "Playbook / System" },
    { to: "/backtest", icon: FiTarget, label: "Backtest Tool", badge: "NEW" }, // Đã thêm + badge nổi bật
    { to: "/monthly", icon: FiCalendar, label: "Monthly Review" },
    // { to: "/setups", icon: FiZap, label: "Setup Library" }, // tương lai
    // { to: "/journal", icon: FiEdit3, label: "Journal" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <motion.div
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen bg-[#0F1117] border-r border-[#2A2F36] shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-[#2A2F36]/50">
          <motion.h1
            animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -50 : 0 }}
            className="text-2xl font-bold text-[#F0B90B] whitespace-nowrap overflow-hidden"
          >
            Trade Manager
          </motion.h1>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl hover:bg-[#1A1D23] transition-all hover:scale-110 text-gray-400 hover:text-[#F0B90B]"
          >
            {isCollapsed ? (
              <FiChevronRight size={20} />
            ) : (
              <FiChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link key={item.to} to={item.to} className="block group relative">
                <motion.div
                  whileHover={{ x: isCollapsed ? 8 : 4 }}
                  className={`
                    flex items-center rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${
                      active
                        ? "bg-[#F0B90B] text-black shadow-lg font-semibold"
                        : "hover:bg-[#1A1D23] text-gray-300 hover:text-white"
                    }
                    ${
                      isCollapsed
                        ? "justify-center py-3"
                        : "justify-start gap-4 px-4 py-3"
                    }
                  `}
                >
                  <Icon size={22} className={active ? "text-black" : ""} />

                  {/* Badge "NEW" cho Backtest */}
                  {item.badge && !isCollapsed && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && isCollapsed && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                  )}

                  <motion.span
                    animate={{
                      opacity: isCollapsed ? 0 : 1,
                      width: isCollapsed ? 0 : "auto",
                    }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                </motion.div>

                {/* Tooltip khi thu gọn */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-black/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 border border-gray-700 shadow-2xl">
                    <div className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-6 border-t border-[#2A2F36]/50 text-center">
            <p className="text-gray-500 text-xs">
              © 2025 • Built with ❤️ & Grok
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Price Action Trading System
            </p>
          </div>
        )}
      </motion.div>

      {/* Đẩy nội dung chính */}
      <div
        className="transition-all duration-400"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      />
    </>
  );
}
