export class NotFoundError extends Error{
    constructor(){
      super("not found",{cause:404})
    }
}

export class ExpiredError extends Error{
    constructor(){
      super("otp expired... please resend code")
    }
}