// const Joi = require('joi');  // for schema validation (some data must be require from server side)

// module.exports.listingSchema = Joi.object({   // what is study it 
//     listing : Joi.object({                       
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         image: Joi.string().allow("",null),
//         price: Joi.number().required().min(0),
//         location: Joi.string().required(),
//         country: Joi.string().required()    
//     }).required(),
// });

const Joi = require('joi');  // for schema validation

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    category: Joi.string().required(), // Add this line for category
    country: Joi.string().required()
});



module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),  // Ensure rating is between 1 and 5
    comment: Joi.string().required()  // Make sure to use lowercase 'comment'
  }).required(),
});
