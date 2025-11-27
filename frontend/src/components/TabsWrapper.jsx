import { useState } from "react";

export default function TabsWrapper({ tabs }) {
    const [active, setActive] = useState(Object.keys(tabs)[0]);

    return (
        <div>
            {/* ---- TOP TAB BAR ---- */}
            <div className="flex gap-2 mb-6 bg-gray-900 p-2 rounded-xl w-fit">
                {Object.keys(tabs).map((key) => (
                    <button
                        key={key}
                        onClick={() => setActive(key)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-semibold transition 
                            ${active === key
                                ? "bg-gray-700 text-white shadow"
                                : "text-gray-300 hover:text-white hover:bg-gray-800"}
                        `}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* ---- ACTIVE TAB CONTENT ---- */}
            <div className="mt-4">
                {tabs[active]}
            </div>
        </div>
    );
}
