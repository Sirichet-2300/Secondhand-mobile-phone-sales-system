const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  CompanyController: {
    create: async (req, res) => {
        try {
            const oldCompany = await prisma.company.findFirst();
            const payload = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                taxCode: req.body.taxCode
            }
            if (oldCompany) {
                await prisma.company.update({
                    where: { id: oldCompany.id },
                    data: payload
                });
            }else {
                await prisma.company.create({data: payload});
            }
            res.json({ message: "Company created successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    list: async (req, res) => {
        try {
            const company = await prisma.company.findFirst();
            res.json(company);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
  }
};