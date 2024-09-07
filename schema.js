const Joi = require('joi');

// ---------------------Listing Schema-----------------
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null),
        country : Joi.string().required(),
        location : Joi.string().required(),
        category: Joi.string().valid(
            "None", "Trending", "Rooms", "Top Cities", 
            "Mountains", "Castles", "Amazing Pools", 
            "Camping", "Farms", "Arctic", "Domes", "Golfing", "Beach", "Desert"
        ).required(),
    }).required()
});

// ---------------------Review Schema-----------------
module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
});