import { addons } from '@storybook/manager-api';
import theme from './theme';
import './manager.css'; 

addons.setConfig({
     theme: theme,
});