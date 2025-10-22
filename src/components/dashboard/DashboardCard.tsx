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
    <div className="bg-white border rounded-lg p-6 flex flex-col items-center gap-4 shadow-sm">
      <div className="text-green-600 text-4xl">{icon}</div>
      <div className="flex-1" />
      <button className="bg-green-600 text-white px-4 py-2 rounded-md font-medium w-full">
        {title}
      </button>
    </div>
  );
}
