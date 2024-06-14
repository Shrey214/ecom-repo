import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(async (req, res, next) => {
    // throw new ErrorHandler("Some Error",402);
    // return next(new ErrorHandler("Meri Custom error",402));
    const { name, email, photo, gender, _id, dob } = req.body;
    console.log(name, email, photo, gender, _id, dob);
    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome, ${name}`,
        });
    }
    if (!name || !email || !_id || !photo || !gender || !dob) {
        return next(new ErrorHandler("Please add all fields", 400));
    }
    console.log(name, email, photo, gender, _id, dob);
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res.status(201).json({
        success: true,
        message: `Welcome,${user.name}`,
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(201).json({
        success: true,
        users,
    });
});
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById({ _id: id });
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById({ _id: id });
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 404));
    }
    await user.deleteOne({ _id: id });
    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
