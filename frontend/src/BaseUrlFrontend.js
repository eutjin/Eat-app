const baseUrlFrontend = process.env.REACT_APP_NODE_ENV === "production"
? "https://gunaesik.com"
: "http://localhost:3000"
console.log("ENV", process.env.REACT_APP_NODE_ENV)
export default baseUrlFrontend;