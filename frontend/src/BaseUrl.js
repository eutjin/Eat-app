const baseUrl = process.env.REACT_APP_NODE_ENV === "production"
? "https://octopus-app-iahz5.ondigitalocean.app"
: "http://localhost:5000"
console.log("ENV", process.env.REACT_APP_NODE_ENV)
export default baseUrl;