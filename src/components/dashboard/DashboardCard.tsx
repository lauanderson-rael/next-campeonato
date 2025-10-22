import Link from "next/link";

export default function DashboardCard({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="bg-white border rounded-lg p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-green-600 text-5xl">{icon}</div>
      <div className="flex-1" />
      {href ? (
        <Link href={href} className="bg-green-600 text-white px-6 py-2.5 rounded-md font-medium w-full text-center hover:bg-green-700 transition-colors">
          {title}
        </Link>
      ) : (
        <button className="bg-green-600 text-white px-6 py-2.5 rounded-md font-medium w-full hover:bg-green-700 transition-colors">
          {title}
        </button>
      )}
    </div>
  );
}
