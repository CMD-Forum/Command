import type { Preview } from "@storybook/react";

import "../src/app/globals.css"
import "./preview.css"

import { Inter } from "./fonts";
import React from "react";

import ToastProvider from "../src/components/toast/toast";
import Toaster from "../src/components/toast/toaster";
import { domAnimation, LazyMotion } from "motion/react";
import { CommunityProvider } from "../src/lib/context/community";

import { themes } from '@storybook/theming';

import {NextIntlClientProvider} from 'next-intl';
import defaultMessages from '../translation/dictionaries/en.json';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		nextjs: {
			appDirectory: true
		},
		docs: {
			toc: true,
			theme: themes.dark
		}
	},
	decorators: [
		(Story) => (
			<div className={`${Inter.className} antialiased w-full`}>
				<NextIntlClientProvider locale="en" messages={defaultMessages}>
					<ToastProvider>
						<LazyMotion features={domAnimation} strict>
							<CommunityProvider>
								<Story />
							</CommunityProvider>
						</LazyMotion>
						<Toaster position="top-center" />
					</ToastProvider>					
				</NextIntlClientProvider>
			</div>
		),
	],
};

export default preview;
