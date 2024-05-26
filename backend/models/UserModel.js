import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{   
		username: {
			type: String,
			required: true
		},
        email: {
            type: String,
            required: true,
            unique: true
        },
		password: {
			type: String,
			required: true,
			minlength: 5,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		file: {
            type: String,
			default: ""
        }
	},
	{ timestamps: true }
);

export const UserModel = mongoose.model("users", UserSchema);
