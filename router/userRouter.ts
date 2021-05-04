import express, { request } from 'express';
import {body, validationResult} from 'express-validator';
const userRouter:express.Router = express.Router();
import {IUser} from "../models/IUser";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import TokenVerifier from "../middlewares/TokenVerifier";


/*
@usage: Register a User
@url: http://127.0.0.1:5000/users/register
@method: POST
@fields: name, email, password
@access: PUBLIC
*/
// logic
userRouter.post("/register",[
    body('name').not().isEmpty().withMessage('Name is Required'),
    body('email').not().isEmpty().withMessage('Email is Required'),
    body('password').not().isEmpty().withMessage('Password is Required')
], async(request:express.Request,response:express.Response) => {
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({
           errors : errors.array()
        });
    }
    try {
        let {name, email, password} = request.body;
        // Check if the email is exists
       let user:IUser | null = await User.findOne({email : email});
       if(user) {
           return response.status(400).json({
               errors : [
                   {msg : 'User is Already Exists'}
               ]
           });
       } 
       // encrypt the password 
       let salt = await bcrypt.genSalt(10);
       password = await bcrypt.hash(password,salt);

        // get avatar url

      let avatar = gravatar.url('email',{
          s : '300',
          r : 'pg',
          d : 'mm'

      });

        // register the user
       user = new User({name, email, password, avatar});
       user = await user.save();
        response.status(200).json({
            msg: 'Registration is Successfull...!!'
        });
    }
    catch(error){
        console.error(error);
        response.status(500).json({
            errors : [
                {
                    msg : error
                }
            ]
        })
    }
    
    
     
 });
 
 
 /*
 @usage: Login a User
 @url: http://127.0.0.1:5000/users/login
 @method: POST
 @fields: email, password
 @access: PUBLIC
 */
 // logic
 userRouter.post("/login",[
     body('email').not().isEmpty().withMessage('Email is Required'),
     body('password').not().isEmpty().withMessage('Password is Required')
 ],async(request:express.Request,response:express.Response) => {

    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({
           errors : errors.array()
        });
    }
     
     try {
         let {email, password} = request.body;
         // check for email
        let user:IUser | null = await User.findOne({email: email})
        if(!user){
            return response.status(401).json({
                errors: [
                    {
                        msg:'Invalid email'
                    }
                ]
            });
        }
         // check for password
        let isMatch:boolean = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return response.status(401).json({
                errors: [
                    {
                        msg:'Invalid Password'
                    }
                ]
            });
        }
        // create a token 
        let payload:any = {
            user:{
                id: user.id,
                name: user.name
            }
        };
        
        let secretKey:string | undefined = process.env.JWT_SECRET_KEY;
        if(secretKey){
            let token = await jwt.sign(payload,secretKey);
            response.status(200).json({
                msg:'Login is Success',
                token: token
            });
        }
     }
     catch(error){
         console.error(error);
         response.status(500).json({
             errors : [
                 {
                     msg : error
                 }
             ]
         })
     }
     
     
      
  });
 
 
  /*
 @usage: GET User Information
 @url: http://127.0.0.1:5000/users/me
 @method: GET
 @fields: no-fields
 @access: PRIVATE
 */
 // logic
 userRouter.get("/me", TokenVerifier, async(request:express.Request,response:express.Response) => {
     
     try {
         // TODO GET User Info logic
        let requestdUser:any = request.headers['user'];
        let user:IUser | null = await User.findById(requestdUser.id).select('-password');
        if(!user){
            return response.status(400).json({
                msg:[
                    'User data not found'
                ]
            })
        } 
        
         response.status(200).json({
             user: user
         });
     }
     catch(error){
         console.error(error);
         response.status(500).json({
             errors : [
                 {
                     msg : error
                 }
             ]
         })
     }   
  });
 
export default userRouter;