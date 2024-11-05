import { UserModel } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserValidator, registerUserValidator, updateUserValidator } from "../validators/user.js";
import { mailtransporter } from "../utils/mail.js";



export const registerUser = async (req, res, next) => {
    try {
        const {error, value} = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        //check if user doesn't exist
        const user = await UserModel.findOne({email:value.email});
        if (user) {
            return res.status(409).json('User already exist!');
        }
        //Hash their password
        const hashedPasswords = bcrypt.hashSync(value.password, 10);
        //Save usr into database
        await UserModel.create({
            ...value,
            password: hashedPasswords
        });

          // Send user confirmation email
          await mailtransporter.sendMail({
            to:value.email,
            subject: 'Welcome to AsthmaSync! Your Account is Ready! ',
            text: 'Welcome to AsthmaSync – we’re thrilled to have you join our community!Your account has been successfully created, and you’re now ready to start tracking, monitoring, and managing your asthma more effectively'
          })

        // Respond to request
        res.status(200).json(`Registration successful! Welcome to AsthmaSync, ${value.name}!`);

        
    } catch (error) {
        next(error);
        
    }
}


export const signInUser = async (req, res, next) => {
    try {
        const {error, value} = loginUserValidator.validate(req.body)
        if (error){
            return res.status(422).json(error)
        }
        const user = await UserModel.findOne({email : value.email})
        if (!user){
            return res.status(404).json('Account does not exist!')
        }
        const correctPassword = bcrypt.compareSync(value.password, user.password)
        if (!correctPassword) {
            return res.status(404).json('Invalid credentials!')
        }
        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_PRIVATE_KEY,
            {expiresIn: '24h'}
            
        )

        res.json({
            message : 'Sign In Succesful!',
            accessToken: token
        })
    } catch (error) {
        next(error)
        
    }
}

export const getProfile = async (req, res, next) => {
    try {
        const user = await UserModel
        .findById(req.auth.id)
        .select({ password: false});

        res.json(user);

        
    } catch (error) {
        next(error)
        
    };
}

export const updateProfile = async ( req, rs, next) => {
    try {
        const { error, value} = updateUserValidator.validate({
            ...req.body,
        });
        if(error){
            return res.status(422).json(error);

        }

        await UserModel.findByIdAndUpdate(req.auth.id, value);
        res.json('Profile Updated!')
        
    } catch (error) {
        next (error)
        
    }
}

  export const getUserProfile = async (req, res, next) => {
    try { 
        const { filter = "{}", limit = 10, skip = 0, sort ="{}" } = req.query;
        const profile = await UserModel
        .find({
            ...JSON.parse(filter),
            user: req.auth.id
        }) 
        .sort(JSON.parse(sort))
        .limit(limit)
        .skip(skip);

        res.status(200).json(profile);
        
    } catch (error) {
        next (error)
        
    }

}
