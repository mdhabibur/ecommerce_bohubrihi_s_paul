class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.name = 'BadRequestError'
        this.status = 400
    }
}

class InternalServerError extends Error {
    constructor(message){
        super(message)
        this.name = 'InternalServerError'
        this.status = 500
    }

}

//when inside next(BadRequestError or InternalServerError object) will be passed , it will call the asyncErrorHandler middleware and  these objects will be passed as arguments

module.exports = {
    BadRequestError,
    InternalServerError
}