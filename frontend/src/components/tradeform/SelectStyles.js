export const darkSelect = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    color: "white",
  }),
  menu: (styles) => ({ ...styles, backgroundColor: "#1e293b" }),
  singleValue: (styles) => ({ ...styles, color: "white" }),
  input: (styles) => ({ ...styles, color: "white" }),
  option: (styles) => ({
    ...styles,
    backgroundColor: "#1e293b",
    color: "white",
    "&:hover": { backgroundColor: "#334155" },
  }),
};
