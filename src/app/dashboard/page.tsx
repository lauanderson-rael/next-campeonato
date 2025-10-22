import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export interface User {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default async function Dashboard() {
  const session: User | null = await getServerSession();

  if (!session) {
    return redirect("/");
  }
  return (
    <div className="w-full h-screen">
      <div className="flex flex-col gap-4 p-2 ">
        <h2 className="text-2xl">Dashboard</h2>
        <p>Olá {session.user?.name}</p>
        <div>Email: {session.user?.email}</div>

        <img
          src={session.user?.image!}
          className="img-fluid rounded-top "
          width={150}
          height={150}
          alt=""
        />
      </div>
    </div>
  );
}
