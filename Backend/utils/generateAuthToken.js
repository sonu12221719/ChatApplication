import jwt from 'jsonwebtoken';

const generateAuthToken = (user) => {
    if(!user._id){
        return res.status(400).json({message: "User ID is required to generate token"});
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
        expiresIn: '24h' // Token will expire in 1 day
    });
    return token;
}

export default generateAuthToken;