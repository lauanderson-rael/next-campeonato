"use client";

import Link from "next/link";

export default function DashboardCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  href?: string;
}) {
  const Wrapper = href ? Link : "div";

  return (
    <Wrapper
      href={href || "#"}
      className="group bg-white border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:border-green-700 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
        <div className="text-green-700 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      <h2 className="text-base md:text-lg font-semibold text-gray-800 text-center">
        {title}
      </h2>

      {description && (
        <p className="text-xs text-gray-600 text-center leading-tight">{description}</p>
      )}

      <button className="bg-green-700 text-white px-3 py-1.5 rounded-md font-medium text-sm w-full hover:bg-green-800 transition-colors duration-300">
        {title}
      </button>
    </Wrapper>
  );
}
