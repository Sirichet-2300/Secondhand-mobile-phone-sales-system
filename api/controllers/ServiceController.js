const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {
    ServiceController: {
        create: async (req, res) => {
            try {
                await prisma.service.create({
                    data: {
                        name: req.body.name,
                        price: req.body.price,
                        remark: req.body.remark,
                        payDate: new Date(),
                    },
                });
                res.json({ message: 'Service record created successfully.' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        list: async (req, res) => {
            try {
                const services = await prisma.service.findMany({
                    orderBy: {
                        payDate: 'desc',
                    },
                });
                res.json(services);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        update: async (req, res) => {
            try {
                await prisma.service.update({
                    where: { id:req.params.id },
                    data: {
                        name: req.body.name,
                        price: req.body.price,
                        remark: req.body.remark,
                    },
                });
                res.json({ message: 'Service record updated successfully.' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
        remove: async (req, res) => {
            try {
                await prisma.service.delete({
                    where: { id:req.params.id },
                });
                res.json({ message: 'Service record deleted successfully.' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }}
    }
}
