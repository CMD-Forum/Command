import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";

export default async function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {

	const session = await auth.api.getSession({
        headers: await headers(),
    })

  	if (!session?.user || session.user.role !== "admin") forbidden();
  	else return <>{children}</>
}