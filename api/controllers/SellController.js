const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    SellController: {
        create: async (req, res) => {
            try {
                const serial = req.body.serial;
                const product = await prisma.product.findFirst({
                    
                    where: { serial:serial },
                });
                console.log("Product: ", product);
                console.log(req.body.serial);
                if (!product) {
                    res.status(400).json({ error: 'Product not found.' });
                    return;
                }
                
                await prisma.sell.create({
                    data: {
                        productId: product.id,
                        price: req.body.price,
                        payDate: new Date(),
                    },
                });
                res.json({ message: 'Sell record created successfully.' });
                
            } catch (error) {
                res.status(500).json({ message:error.message });
            }
        }
    }
}