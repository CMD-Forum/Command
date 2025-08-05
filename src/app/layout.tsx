import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { domAnimation, LazyMotion } from "motion/react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, /*getTranslations*/ } from "next-intl/server";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { StrictMode } from "react";
import { Toaster } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumbs from "@/components/breadcrumbs";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { CommunityProvider } from "@/lib/context/community";
import Providers from "@/lib/query-provider";

import "@/app/globals.css";

export const INTER = localFont({ src: "../fonts/Inter-VariableFont.ttf" })

const METADATA_BASE_URL = process.env.NODE_ENV === "production"
	? process.env.NEXT_PUBLIC_METADATA_BASE_URL_PROD 
	: process.env.NEXT_PUBLIC_METADATA_BASE_URL_DEV;

const APP_NAME = "Command";
const APP_DEFAULT_TITLE = "Command";
const APP_TITLE_TEMPLATE = "%s - Command";
const APP_DESCRIPTION = "Command is a forum site for people to share news, interests or anything they can think of.";

export const metadata: Metadata = {
	metadataBase: METADATA_BASE_URL ? new URL(METADATA_BASE_URL) : new URL("https://cmd-forum.vercel.app/"),
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: APP_DEFAULT_TITLE,
		startupImage: ["../../public/metadata/generated/apple-splash-640-1136.jpg"],
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	twitter: {
		card: "summary",
		title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
};

export const viewport: Viewport = {
  	themeColor: "#0F1214",
};

export default async function RootLayout({
  	children,
}: Readonly<{
  	children: React.ReactNode;
}>) {

	const LOCALE = await getLocale();
	const MESSAGES = await getMessages();

	const COOKIE_STORE = await cookies()
	const DEFAULT_OPEN = COOKIE_STORE.get("sidebar_state")?.value === "true"

	// const t = await getTranslations("Layout");

	return (
		<NextIntlClientProvider messages={MESSAGES}>
			<Providers>
				<StrictMode>
					<CommunityProvider>
						<LazyMotion features={domAnimation} strict>
								<html lang={LOCALE} suppressHydrationWarning>
									<link rel="manifest" href="/manifest.json" />
									<link rel="preload" href="TextPostFallback.svg" as="image" />
									<body
										className={`${INTER.className} antialiased theme-zinc`}
									>
										<>
											{/*<div className="w-screen h-full absolute flex items-center justify-center bg-background z-[999999999]">
												<h1>{t("Error.JSDisabled")}</h1>
											</div>*/}
											<ThemeProvider
												attribute="class"
												defaultTheme="system"
												enableSystem
												disableTransitionOnChange
											>
												<div className="[--header-height:calc(theme(spacing.14))]">
													<SidebarProvider defaultOpen={DEFAULT_OPEN}>
														<AppSidebar />
														<SidebarInset>
															<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
																<div className="flex items-center gap-2 px-4">
																	<SidebarTrigger className="-ml-1" />
																	<Separator orientation="vertical" className="mr-2 h-4" />
																	<Breadcrumbs />
																</div>
															</header>
															<div className="px-50">
																{children}	
															</div>
															<Toaster richColors closeButton position="top-center" />
														</SidebarInset>
													</SidebarProvider>
												</div>										
											</ThemeProvider>
										</>
									</body>
								</html>
							
						</LazyMotion>				
					</CommunityProvider>
				</StrictMode>			
			</Providers>			
		</NextIntlClientProvider>
  	);
}
