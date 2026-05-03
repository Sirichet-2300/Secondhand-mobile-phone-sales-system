const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  ProductController: {
    create: async (req, res) => {
      try {
        const qty = req.body.qty;

        if (qty>1000){
          res.status(400).json({ error: "qty must be less than 1000" });
          return;
        }
        for(let i=0; i < qty; i++){
        await prisma.product.create({
          data: {
            release: req.body.release,
            name: req.body.name,
            color: req.body.color,
            price: req.body.price,
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            customerAddress: req.body.customerAddress,
            remark: req.body.remark ?? "",
            serial: req.body.serial ?? "",
          }
        });
      }
        res.json({ message: "Success" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    },
    list: async (req, res) => {
      try {
        const products = await prisma.product.findMany({
          orderBy: { id: "asc" },
          where:{
            status:{not: "delete"}
          }
        });
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },
    update: async (req, res) => {
      try {
        await prisma.product.update({
          where: { id: req.params.id },
          data: {
            release: req.body.release,
            name: req.body.name,
            color: req.body.color,
            price: req.body.price,
            customerName: req.body.customerName,
            customerPhone: req.body.customerPhone,
            customerAddress: req.body.customerAddress,
            remark: req.body.remark ?? "",
            serial: req.body.serial ?? "",
          }
        });
        console.log(req.body);
        res.json({ message: "Success" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },
  remove: async (req, res) => {
    try {
      await prisma.product.delete({
        where: { id: req.params.id },
      });
      res.json({ message: "Success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}}
};
