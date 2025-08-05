import { create } from '@storybook/theming';

export default create({
    base: 'dark',
    // fontBase: '"Inter", sans-serif',
    // fontCode: 'monospace',
    brandTitle: 'Command UI',
    brandUrl: 'https://github.com/CMD-Forum/Command',
    brandImage: '/storybook/StorybookLogo.png',
    brandTarget: '_self',

    colorPrimary: 'white',
    colorSecondary: 'white',

    appBg: '#09090b',
    appContentBg: '#09090b',
    appPreviewBg: '#09090b',
    appBorderColor: '#1d1d20',
    appBorderRadius: 4,

    textColor: '#ffffff',
    textInverseColor: '#000000',

    barTextColor: '#d1d5db',
    barSelectedColor: '#ffffff',
    barHoverColor: '#ffffff',
    barBg: '#09090b',

    inputBg: '#09090b',
    inputBorder: '#1d1d20',
    inputTextColor: '#ffffff',
    inputBorderRadius: 4,
});