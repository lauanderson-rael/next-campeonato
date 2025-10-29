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
      className="group bg-white border rounded-2xl p-6 flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-lg hover:border-green-700 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors duration-300">
        <div className="text-green-700 text-4xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      <h2 className="text-lg md:text-xl font-semibold text-gray-800 text-center">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-gray-600 text-center">{description}</p>
      )}

      <button className="bg-green-700 text-white px-4 py-2 rounded-md font-medium w-full hover:bg-green-800 transition-colors duration-300">
        {title}
      </button>
    </Wrapper>
  );
}
