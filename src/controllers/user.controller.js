import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res)=>{


    const {fullName, email, userName, password} = req.body
console.log("email", email);

if (
    [fullName,email,userName,password].some((field)=> field?.trim() === "")
) {
    throw new ApiError(400,"all fields are required")
}

const existedUser = await User.findOne({
    $or: [{userName},{email}]
})

if (existedUser) {
    throw new ApiError(409,"User with userName or email already exists")
}

 const avatarLocalPath = req.files?.avatar[0]?.path;
//  const coverImageLocalPath = req.files?.coverImage[0]?.path;

 if (!avatarLocalPath) {
    throw new ApiError(400,"avatar is required")
 }

const avatar = await uploadOnCloudinary(avatarLocalPath)

// const coverImage = await uploadOnCloudinary(coverImageLocalPath)


if (!avatar) {
    throw new ApiError(400,"avatar is required")
    
}

   // Check for cover image (optional)
   let coverImageUrl = "";
   if (req.files?.coverImage?.[0]?.path) {
       const coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
       if (coverImage) {
           coverImageUrl = coverImage.url;
       }
   }


 const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImageUrl,
    email,
    password,
    userName: userName.toLowerCase()

})

 const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )

 if (!createdUser) {

    throw new ApiError(500, "Something went wrong while registering User")
    
 }

 return res.status(201).json(
   new ApiResponse(200,createdUser,"User registerd successfully")
 )

})

export {registerUser}