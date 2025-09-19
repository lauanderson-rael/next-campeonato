import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

// export interface User {
//   name?: string | null;
//   email?: string | null;
//   image?: string | null;
// }

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    return redirect("/");
  }
  return (
    <div>
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
  );
}
