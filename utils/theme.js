import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  '2xl': '1536px',
})

const theme = extendTheme({
  breakpoints,
  components: {
    Button: {
      defaultProps: {
        //colorScheme: "kali",
      },
      baseStyle: {
        display: "flex",
        justifyContent: "center",
        alignItem: "center",
        border: "1px",
      },
    },
  },
  colors: {
    kali: {
      100: "#46254A", // american purple
      200: "#294A25", // pomona green
      300: "#34254A", // russian violet
      400: "#F4C824", // deep lemon
      500: "#F03B361", // rajah
      600: "#B82623", // firebrick
      700: "#F74D38", // ogre odor
      800: "#0c0101", // black
      900: "#fffefe", // white
    },
  },
});

export default theme;
