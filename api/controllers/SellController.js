const { PrismaClient } = require('@prisma/client');
const { info } = require('console');
const prisma = new PrismaClient()

module.exports = {
    SellController: {
        create: async (req, res) => {
            try {
                const serial = req.body.serial;
                const product = await prisma.product.findFirst({

                    where: {
                        serial: serial,
                        status: 'instock'
                    },
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
                    select: {
                        product: {
                            select: {
                                name: true,
                                serial: true,
                            }
                        },
                        id: true,
                        price: true,
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
                const sells = await prisma.sell.findMany({
                    where: { status: 'pending' },
                });
                for (const sell of sells) {
                    await prisma.product.update({
                        where: { id: sell.productId },
                        data: { status: 'sold' }
                    });
                }
                await prisma.sell.updateMany({
                    where: { status: 'pending' },
                    data: {
                        status: 'paid',
                        payDate: new Date()
                    },
                });
                res.json({ message: 'Sell records confirmed successfully.' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        dashboard: async (req, res) => {
            try {
                const year = Number(req.params.year) ?? new Date().getFullYear();
                const startDate = new Date(`${year}-01-01`);
                const endDate = new Date(`${year + 1}-01-01`);
                const income = await prisma.sell.aggregate({
                    _sum: { price: true },
                    where: { status: 'paid',
                        payDate: {
                        gte: startDate,
                        lt: endDate,
                    }
                     }
                    
                });
                const countRepair = await prisma.service.count();
                const countSell = await prisma.sell.count({
                    where: { status: 'paid',
                        payDate: {
                        gte: startDate,
                        lt: endDate,
                    }
                     }
                    
                });
                return res.json({
                    totalIncome: income._sum.price ?? 0,
                    totalRepair: countRepair,
                    totalSale: countSell,
                    totalSell: countSell,
                });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        history: async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: { status: 'paid' },
                    orderBy: { id: 'desc' },
                    include: {
                        product: {
                            select: {
                                name: true,
                                serial: true,
                            }
                        }
                    }
                });
                res.json(sells);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
    },
    info: async (req, res) => {
        try {
            const sell = await prisma.sell.findUnique({
                where: { id: req.params.id, status: 'paid' },
                include: {
                    product: true}
            });
            res.json(sell);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
}
