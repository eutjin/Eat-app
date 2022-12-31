const baseUrl = process.env.NODE_ENV === "production"
? "https://gunaesik.com"
: "http://localhost:5000"
console.log("ENV", process.env.NODE_ENV)
export default baseUrl;