
async function handler(err, req, res, next) {
    const statusCode = 400 || 501 || err.status;
    const message = err.message || "something went wrong"
    res.send({
        message,
        status: "error",
        success: "false",
        statusCode: statusCode
    })
}
module.exports = { handler }