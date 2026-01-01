import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import HomeClient from "@/app/components/home/HomeClient";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <HomeClient initialUser={session?.user || null} />;
}
