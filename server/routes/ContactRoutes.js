import { Router } from "express";
import authenticateJWT from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactController.js";

const contactRoute = Router();
 contactRoute.post('/search',authenticateJWT,searchContacts);
 contactRoute.get('/get-contact',authenticateJWT,getContactsForDMList)
 contactRoute.get('/get-all-contact',authenticateJWT,getAllContacts)

export default contactRoute;