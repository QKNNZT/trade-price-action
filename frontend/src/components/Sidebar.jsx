// components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBarChart2,
  FiBook,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiTarget,
  FiSettings,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { motion } from "framer-motion";

// NHẬN theme & onToggleTheme từ App
export default function Sidebar({ theme = "dark", onToggleTheme }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isDark = theme === "dark";

  const menuItems = [
    { to: "/", icon: FiBook, label: "Trade Log" },
    { to: "/dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/playbook", icon: FiSettings, label: "Playbook / System" },
    { to: "/backtest", icon: FiTarget, label: "Backtest Tool", badge: "NEW" },
    { to: "/monthly", icon: FiCalendar, label: "Monthly Review" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <motion.div
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`
          fixed left-0 top-0 h-screen border-r shadow-2xl z-50 flex flex-col
          ${
            isDark
              ? "bg-[#0F1117] border-[#2A2F36] text-gray-100"
              : "bg-white border-gray-200 text-gray-900"
          }
        `}
      >
        {/* Header */}
        <div
          className={`
            p-6 flex items-center justify-between border-b
            ${
              isDark
                ? "border-[#2A2F36]/50"
                : "border-gray-200 bg-white/80 backdrop-blur"
            }
          `}
        >
          <motion.h1
            animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -50 : 0 }}
            className="text-2xl font-bold text-[#F0B90B] whitespace-nowrap overflow-hidden"
          >
            Trade Manager
          </motion.h1>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              p-2 rounded-xl transition-all hover:scale-110
              ${
                isDark
                  ? "hover:bg-[#1A1D23] text-gray-400 hover:text-[#F0B90B]"
                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
              }
            `}
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
                        : isDark
                        ? "hover:bg-[#1A1D23] text-gray-300 hover:text-white"
                        : "hover:bg-gray-100 text-gray-700 hover:text-black"
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
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
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
                  <div
                    className={`
                      absolute left-full ml-2 px-3 py-2 text-sm rounded-lg opacity-0 
                      group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10 
                      border shadow-2xl
                      ${
                        isDark
                          ? "bg-black/95 text-white border-gray-700"
                          : "bg-white text-gray-900 border-gray-200"
                      }
                    `}
                  >
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
        {/* Footer + Theme Toggle */}
        <div
          className={`
    p-4 border-t
    ${
      isDark
        ? "border-[#2A2F36]/50 bg-[#0F1117]"
        : "border-gray-200 bg-white/80 backdrop-blur"
    }
  `}
        >
          {isCollapsed ? (
            // === SIDEBAR THU GỌN: chỉ hiện icon tròn ===
            <button
              onClick={onToggleTheme}
              className={`
        w-10 h-10 mx-auto flex items-center justify-center rounded-2xl border
        transition-all
        ${
          isDark
            ? "bg-[#181B23] border-[#2A2F36] text-gray-100 hover:bg-[#1F2230]"
            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        }
      `}
              title={isDark ? "Dark theme" : "Light theme"} // tooltip nhỏ
            >
              {isDark ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>
          ) : (
            // === SIDEBAR ĐẦY ĐỦ: giữ nguyên nút gạt đẹp ===
            <button
              onClick={onToggleTheme}
              className={`
        w-full flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium border transition-colors mb-3
        ${
          isDark
            ? "bg-[#181B23] border-[#2A2F36] text-gray-100 hover:bg-[#1F2230]"
            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        }
      `}
            >
              <span className="flex items-center gap-2">
                {isDark ? <FiMoon size={16} /> : <FiSun size={16} />}
                <span>{isDark ? "Dark theme" : "Light theme"}</span>
              </span>

              {/* Switch */}
              <span
                className={`
          relative inline-flex h-5 w-9 items-center rounded-full transition
          ${isDark ? "bg-gray-500" : "bg-gray-300"}
        `}
              >
                <span
                  className={`
            inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform
            ${isDark ? "translate-x-1" : "translate-x-4"}
          `}
                />
              </span>
            </button>
          )}

          {/* Text footer chỉ hiện khi không thu gọn */}
          {!isCollapsed && (
            <>
              <p className="text-gray-500 text-xs">
                © 2025 • Built with ❤️ & Grok
              </p>
              <p className="text-xs mt-2 text-gray-500">
                Price Action Trading System
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Đẩy nội dung chính */}
      <div
        className="transition-all duration-400"
        style={{ marginLeft: isCollapsed ? 80 : 280 }}
      />
    </>
  );
}
