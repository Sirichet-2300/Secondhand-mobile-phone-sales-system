const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



module.exports = {
    UserController: {
        signIn: async (req, res) => {
            try {
                
                const user = await prisma.user.findFirst({
                    where: {
                        username: req.body.username,
                        password: req.body.password,
                        status: 'active'
                    }
                });

                if (!user) return res.status(401).json({message: 'User not found'});

                const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: '7d'});
                console.log("SECRET_KEY: ", process.env.SECRET_KEY);
                res.json({token:token});
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        },
        info: async (req, res) => {
            try {
                const headers = req.headers.authorization;
                const token = headers.split(' ')[1];
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const user = await prisma.user.findFirst({
                    where: { id: decoded.id},
                    select: {
                        name: true,
                        level: true,}
                });
                res.json(user);
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        }
    }
};