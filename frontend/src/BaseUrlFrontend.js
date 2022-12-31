const baseUrlFrontend = process.env.NODE_ENV === "production"
? "https://gunaesik.com"
: "http://localhost:3000"
console.log("ENV", process.env.NODE_ENV)
export default baseUrlFrontend;