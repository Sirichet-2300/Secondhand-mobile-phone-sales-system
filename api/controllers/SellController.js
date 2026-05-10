const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    SellController: {
        create: async (req, res) => {
            try {
                const serial = req.body.serial;
                const product = await prisma.product.findFirst({

                    where: { serial: serial },
                });
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
                res.status(500).json({ message: error.message });
            }
        },
        list: async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: {
                        status: 'pending',
                    },
                    orderBy: {
                        id: 'desc',
                    },
                    include: {
                        product: true
                    }
                });
                res.json(sells);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        remove: async (req, res) => {
            try {
                await prisma.sell.delete({
                    where: { id: req.params.id },
                });
                res.json({ message: 'Sell record removed successfully.' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
    },
    confirm: async (req, res) => {
        try {
            await prisma.sell.updateMany({
                where: { status: 'pending' },
                data: { status: 'paid',
                    payDate: new Date()
                 },
            });
            res.json({ message: 'Sell records confirmed successfully.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
}