import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-onboarding",
		"@storybook/addon-essentials",
		"@chromatic-com/storybook",
		"@storybook/addon-interactions",
		"@storybook/addon-docs",
		"@storybook/addon-links",
		"@storybook/addon-a11y",
		"@storybook/test-runner"
	],
	framework: {
		name: "@storybook/nextjs",
		options: {},
	},
	staticDirs: ["..\\public", "..\\src\\fonts"],
	features: {
		experimentalRSC: true,
	}
};
export default config;
