import { createTheme, MantineColorsTuple } from '@mantine/core';

const laosGreen: MantineColorsTuple = [
    '#e6ffee',
    '#d3f9e0',
    '#a8f2c0',
    '#7aea9f',
    '#53e383',
    '#3bdf70',
    '#2bdd66',
    '#1ac455',
    '#0eaf49',
    '#00963c'
];

export const theme = createTheme({
    primaryColor: 'laosGreen',
    colors: {
        laosGreen,
    },
    fontFamily: 'Inter, sans-serif',
});
