import express from 'express';
import TokenVerifier from '../middlewares/TokenVerifier';
import {body, validationResult} from 'express-validator';
import {IEvent} from "../models/IEvent";
import Event from "../models/Event";
const eventsRouter:express.Router = express.Router();


/*
@usage: Upload an event
@url: http://127.0.0.1:5000/events/upload
@method: POST
@fields: name, image, price, date, info, type
@access: PRIVATE
*/
// logic
eventsRouter.post("/upload", [
    body('name').not().isEmpty().withMessage('Name is Required'),
    body('image').not().isEmpty().withMessage('Image is Required'),
    body('price').not().isEmpty().withMessage('Price is Required'),
    body('date').not().isEmpty().withMessage('Date is Required'),
    body('info').not().isEmpty().withMessage('Info is Required'),
    body('type').not().isEmpty().withMessage('Type is Required')
], TokenVerifier,async(request:express.Request,response:express.Response) => {
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({
            errors : errors.array()
        });
    }
    try {
        let {name, image, price, date, info, type} = request.body;
        // check if event with the same name
        let event:IEvent | null = await Event.findOne({name : name});
        if(event){
            return response.status(401).json({
                errors : [
                    {
                    msg : 'Event is Already Exists'
                    }
                ]
            });
        }

        // create an event
        event = new Event({ name, image, price, date, info, type});
        event = await event.save();
        response.status(200).json({
            msg : 'Upload Event is Success'
        });

        // TODO Uploads Event Logic
        response.status(200).json({
            msg: 'Upload Events'
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
@usage: GET all FREE Events
@url: http://127.0.0.1:5000/events/upload
@method: GET
@fields: no-fields
@access: PUBLIC
*/
// logic
eventsRouter.get("/free", async(request:express.Request,response:express.Response) => {
    
    try {
        // TODO Get All FREE Events Logic
        let events:IEvent[] | null = await Event.find({type : 'FREE' });
        if(!events){
            return response.status(400).json({
                errors:[
                   {
                       msg : 'No Events Found'
                   }
                ]
            })
        }
        response.status(200).json({
            events : events
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
@usage: GET all PRO Events
@url: http://127.0.0.1:5000/events/pro
@method: GET
@fields: no-fields
@access: PUBLIC
*/
// logic

eventsRouter.get("/pro", async(request:express.Request,response:express.Response) => {
    
    try {
        // TODO Get All FREE Events Logic
        let events:IEvent[] | null = await Event.find({type : 'PRO' });
        if(!events){
            return response.status(400).json({
                errors:[
                   {
                       msg : 'No Events Found'
                   }
                ]
            })
        }
        response.status(200).json({
            events : events
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
@usage: GET a single Event 
@url: http://127.0.0.1:5000/events/:eventId
@method: GET
@fields: no-fields
@access: PUBLIC
*/
// logic
eventsRouter.get("/:eventId",async(request:express.Request,response:express.Response) => {
    
    try {
        let {eventId} = request.params;
        // TODO Get a single Event Logic
        response.status(200).json({
            msg: 'Get a single Event'
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
 
 
 
export default eventsRouter;