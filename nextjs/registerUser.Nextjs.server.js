import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/lib/(utils)/apiResponse";
import user from "@/model/user.models";
import uploadOnCloudinary from "@/lib/(utils)/cloudinary";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  try {
    const data = await request.formData();

    // Extract fields from FormData
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const gender = data.get("gender");
    const birthDate = data.get("birthDate");
    const hobbies = data.get("hobbies");
    const email = data.get("email");
    const password = data.get("password");
    const file = data.get("avatar");

    if (!firstName ||!lastName ||!gender ||!birthDate ||!hobbies ||!email ||!password) {
      return Response.json(
        new ApiResponse(400, null, "All fields are required"),
        { status: 400 }
      );
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return Response.json(
        new ApiResponse(400, null, "E-mail already exists"),
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = `/tmp/${file.name}`;
    await writeFile(path, buffer);

    const avatarLocalPath = path;

    if (!avatarLocalPath) {
      return Response.json(
        new ApiResponse(400, null, "Profile Picture is required"),
        { status: 400 }
      );
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      return Response.json(
        new ApiResponse(400, null, "Unable to upload profile photo"),
        { status: 400 }
      );
    }
    const newUser = await user.create({
      avatar: avatar.secure_url,
      firstName,
      lastName,
      gender,
      birthDate,
      hobbies,
      email,
      password,
    });
    const createdUser = await user.findById(newUser._id).select("-password");
    return Response.json(
      new ApiResponse(200, createdUser, "User created successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      new ApiResponse(
        500,
        error?.message,
        "Unable to create user. Server error!"
      ),
      { status: 500 }
    );
  }
}
