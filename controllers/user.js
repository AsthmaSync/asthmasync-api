import { UserModel } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserValidator, registerUserValidator, updateUserValidator } from "../validators/user.js";
import { mailtransporter } from "../utils/mail.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TriggersModel } from "../models/triggers.js";
import {SymptomsModel} from "../models/symptoms.js";
import {MedicationModel} from "../models/medication.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registerUser = async (req, res, next) => {
    try {
        // Validate request body
        const { error, value } = registerUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        // Check if the user already exists
        const user = await UserModel.findOne({ email: value.email });
        if (user) {
            return res.status(409).json({ message: 'User already exists!' });
        }

        // Hash the user's password
        const hashedPassword = bcrypt.hashSync(value.password, 10);

        // Save the new user into the database
        const newUser = await UserModel.create({
            ...value,
            password: hashedPassword
        });

        // Load the email HTML template
        let emailHtml;
        try {
            emailHtml = fs.readFileSync(path.join(__dirname, '../utils/regMail.html'), 'utf8');
        } catch (fileError) {
            console.error('Error reading email template:', fileError.message);
            return res.status(500).json({ message: 'Error sending confirmation email.' });
        }

        // Send confirmation email
        try {
            await mailtransporter.sendMail({
                from: 'gidodoom@gmail.com',
                to: value.email,
                subject: 'Welcome to AsthmaSync! Your Account is Ready!',
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
            return res.status(500).json({ message: 'Registration successful, but failed to send confirmation email.' });
        }

        // Respond with success message
        res.status(200).json({ message: `Registration successful! Welcome to AsthmaSync, ${value.name}!` });
    } catch (error) {
        next(error);
    }
};


export const signInUser = async (req, res, next) => {
    try {
        const { error, value } = loginUserValidator.validate(req.body)
        if (error) {
            return res.status(422).json(error)
        }
        const user = await UserModel.findOne({ email: value.email })
        if (!user) {
            return res.status(404).json('Account does not exist!')
        }
        const correctPassword = bcrypt.compareSync(value.password, user.password)
        if (!correctPassword) {
            return res.status(404).json('Invalid credentials!')
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: "24h" }

        )

        res.json({
            message: 'Sign In Succesful!',
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
            .select({ password: false });

        res.json(user);


    } catch (error) {
        next(error)

    };
}

export const updateProfile = async (req, res, next) => {
    try {
        const { error, value } = updateUserValidator.validate({
            ...req.body,
        });
        if (error) {
            return res.status(422).json(error);

        }
        // Check if password update is requested
        if (value.password) {
            // Hash the password before updating
            value.password = bcrypt.hashSync(value.password, 10);
        }

        await UserModel.findByIdAndUpdate(req.auth.id, value, { new: true });
        res.json('Profile Updated!')

    } catch (error) {
        next(error)

    }
}

export const getUserData = async (req, res, next) => {
    try {
        const { filter = "{}", limit = 10, skip = 0, sort = "{}" } = req.query;

        // Parse the query parameters
        const parsedFilter = JSON.parse(filter);
        const parsedSort = JSON.parse(sort);

        // Fetch data from all collections concurrently
        const [triggers, symptoms, medication] = await Promise.all([
            TriggersModel.find({ ...parsedFilter, user: req.auth.id })
                .sort(parsedSort)
                .limit(limit)
                .skip(skip),
            SymptomsModel.find({ ...parsedFilter, user: req.auth.id })
                .sort(parsedSort)
                .limit(limit)
                .skip(skip),
            MedicationModel.find({ ...parsedFilter, user: req.auth.id })
                .sort(parsedSort)
                .limit(limit)
                .skip(skip)
        ]);

        // Combine the results into a single response
        res.status(200).json({
            triggers,
            symptoms,
            medication
        });

    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

