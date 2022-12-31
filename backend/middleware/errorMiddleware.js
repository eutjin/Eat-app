const errorHandler = (err, req, res, next)=>{
// console.log("res", res)
    // const statusCode= res.status.code? res.status.code : 500
    const statusCode= res.statusCode? res.statusCode : 500
    res.status(statusCode)
    
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null: err.stack
    })
    }
    
    module.exports ={
        errorHandler
    }