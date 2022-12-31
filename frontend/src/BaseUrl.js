const baseUrl = process.env.NODE_ENV === "production"
? "https://dolphin-app-4xfzu.ondigitalocean.app"
: "http://localhost:5000"
console.log("ENV", process.env.NODE_ENV)
export default baseUrl;