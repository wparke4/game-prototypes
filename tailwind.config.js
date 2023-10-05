/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

const colors = require("tailwindcss/colors");

module.exports = {
  theme: {
    fontFamily: {
      mono: [
        "Vinila",
        "Space Grotesk",
        "Helvetica",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
      ],
      sans: [
        "Space Grotesk",
        "ui-sans-serif",
        "system-ui",
        "Helvetica",
        "sans-serif",
      ],
      serif: [
        "Space Grotesk",
        "ui-serif",
        "Georgia",
        "Cambria",
        "Times New Roman",
        "Times",
        "serif",
      ],
    },
    screens: {
      "2xs": "320px",
      xs: "376px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
      size: {
        xs: "640px",
        sm: "780px",
        md: "900px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      truegray: colors.neutral,
      warmgray: colors.stone,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      slate: colors.slate,
      rose: colors.rose,
      redS2: "#F94343",
      gray: colors.gray,
      grayDark: "#1B1C1F",
      yellow: colors.yellow,
      yellowLight: "#FFFEAE",
      pink: "#F9B7DB",
      pinkNeon: "#F9B7DB",
      pinkLight: "#FFE1E1",
      purple: "#7470E7",
      violet: "#E1DDF9",
      greenS2: "#57D1BF",
      blueLight: "#D7F4F0",
      blueDark: "#404571",
      dark: "#11041D",
    },
    extend: {
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "10xl": "102rem",
      },
      gridTemplateColumns: {
        20: "repeat(20, minmax(0, 1fr))",
      },
      fontSize: {
        "3xs": ".55rem",
        "2xs": ".65rem",
        sm2: ".82rem",
        base2: ".9rem",
        lg2: "1.125rem",
        "2.5xl": "1.635rem",
        "3.5xl": "2.06rem",
        "4.5xl": "2.625rem",
        "5.5xl": "3.325rem",
        "7.5xl": "5.25rem",
        "10xl": "10rem",
      },
      left: {
        "1/2": "50%",
      },
      spacing: {
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        108: "28rem",
        128: "32rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      lineHeight: {
        tighter: "1.15",
      },
      opacity: {
        15: "0.15",
      },
      transitionDelay: {
        0: "0ms",
        400: "400ms",
        600: "600ms",
        800: "800ms",
        1200: "1200ms",
        1500: "1500ms",
        2000: "2000ms",
        3000: "3000ms",
      },
      minHeight: {
        12: "3rem",
        14: "3.5rem",
      },
      opacity: {
        7.5: ".075",
      },
      letterSpacing: {
        lg: "0.25em",
        xl: "0.5em",
        "2xl": "0.75em",
        "3xl": "1em",
      },
      scale: {
        "-1": "-1",
        102: "1.02",
        103: "1.03",
        200: "2",
      },
      screens: {
        xs2: "400px",
      },
      height: {
        13: "3.25rem",
        15: "3.75rem",
        18: "4.5rem",
        30: "7.5rem",
        128: "32rem",
      },
      width: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        13: "3.25rem",
        15: "3.75rem",
        18: "4.5rem",
        72: "18rem",
        84: "21rem",
        96: "24rem",
        128: "32rem",
        192: "48rem",
        500: "500px",
        600: "600px",
        700: "700px",
        800: "800px",
        1000: "1000px",
      },
      inset: {
        "1/5": "20%",
        "1/6": "16.6%",
        "1/10": "10%",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
        6: "6px",
      },
      borderRadius: {
        xs: "0.1rem",
        xl: "1rem",
        "5xl": "1.4rem",
        "2xl": "2rem",
        "2.5xl": "2.5rem",
        "3xl": "3rem",
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ["hover", "focus"],
    },
    extend: {
      zIndex: ["hover"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    //themes: true,
    themes: ["light"],
    /*themes: [
      {
        mytheme: {
          primary: "#fc83f6",

          secondary: "#d328b7",

          accent: "#f4c18d",

          neutral: "#292334",

          "base-100": "#3E3D51",

          info: "#567CC8",

          success: "#23E1AB",

          warning: "#BB9A07",

          error: "#F63757",
        },
      },
    ],
    */
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: true,
  },
  content: [
    "components/**/*.vue",
    "layouts/**/*.vue",
    "pages/**/*.vue",
    "plugins/**/*.js",
    "nuxt.config.js",
  ],
};
