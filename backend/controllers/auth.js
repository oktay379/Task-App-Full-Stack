import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


export const verifyUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ error: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
export const verify = async (req, res) => {
    return res.json(req.user);
}



export const register = async (req, res) => {
    try {
		const { username, email, password, confirmPassword, gender } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

        const user = await UserModel.findOne({ email });

		if (user) {
			return res.status(400).json({ error: "Email already exists" });
		}

        if(password.length < 5) {
            return res.status(500).json({msg: "At Least 5 Characters"});
        };

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = await UserModel.create({
            email,
            username,
            password: hashedPassword,
            gender,
            file: gender === "male" ? boyProfilePic : girlProfilePic,
        });

		res.status(201).json({
            status: true,
            newUser
        });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
}



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if(!user) {
            return res.status(500).json({msg: "Invalid Email"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            return res.status(500).json({msg: "Password Wrong."});
        }

        const token = jwt.sign(
            {
                email: user.email, 
                username: user.username,
                id: user._id,
				file: user.file, 
            }, 
            process.env.KEY, 
            {expiresIn: "15d"}
        );
        res.cookie("token", token, {httpOnly: true, secure: true, maxAge: 15 * 24 * 60 * 60 * 1000});

        return res.status(201).json({status: true, msg: "Success.", token});
    } catch (err) {
        return res.status(500).json(err);
    }
}



export const logout = async (req, res) => {
    res.clearCookie("token");
    return res.json("Success");
}