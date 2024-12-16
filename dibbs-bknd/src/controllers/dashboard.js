const { db } = require("../db/config");

const getCounts = async (req, res) => {
  try {
    const dealsQuery = `
       SELECT 
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeDeals,
         SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactiveDeals
       FROM products;
     `;
    const [deals] = await db.query(dealsQuery);

    const totalDeals = deals[0].activeDeals;

    const paidOrdersQuery =
      "SELECT COUNT(*) AS totalPaidOrders FROM orders WHERE payment_status = 'paid'";
    const [paidOrders] = await db.query(paidOrdersQuery);

    const pendingOrdersQuery =
      "SELECT COUNT(*) AS totalPendingOrders FROM orders WHERE payment_status = 'pending'";
    const [pendingOrders] = await db.query(pendingOrdersQuery);

    const faqsQuery =
      "SELECT COUNT(*) AS totalFaqs FROM faqs WHERE status = 'active'";
    const [faqs] = await db.query(faqsQuery);

    const customersQuery =
      "SELECT COUNT(*) AS totalCustomers FROM customers WHERE status = 'active'";
    const [customers] = await db.query(customersQuery);

    const couponsQuery =
      "SELECT COUNT(*) AS totalCoupons FROM discount_coupens WHERE status = 'active'";
    const [coupons] = await db.query(couponsQuery);

    res.json({
      totalDeals,
      totalPaidOrders: paidOrders[0].totalPaidOrders,
      totalPendingOrders: pendingOrders[0].totalPendingOrders,
      totalFaqs: faqs[0].totalFaqs,
      totalCustomers: customers[0].totalCustomers,
      totalCoupons: coupons[0].totalCoupons,
    });
  } catch (error) {
    console.error("Error fetching counts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserCounts = async (req, res) => {
  try {
    const { userId } = req.params;
    const dealsQuery = `
          SELECT 
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeDeals,
            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactiveDeals
          FROM products
          WHERE added_by = ?;
        `;
    const [deals] = await db.query(dealsQuery, [userId]);

    const totalDeals = deals[0].activeDeals;

    const paidOrdersQuery = `
          SELECT COUNT(*) AS totalPaidOrders 
          FROM orders 
          WHERE customer_id = ? AND payment_status = 'paid';
        `;
    const [paidOrders] = await db.query(paidOrdersQuery, [userId]);

    const pendingOrdersQuery = `
          SELECT COUNT(*) AS totalPendingOrders 
          FROM orders 
          WHERE customer_id = ? AND payment_status = 'pending';
        `;
    const [pendingOrders] = await db.query(pendingOrdersQuery, [userId]);

    res.json({
      totalDeals,
      totalPaidOrders: paidOrders[0].totalPaidOrders,
      totalPendingOrders: pendingOrders[0].totalPendingOrders,
    });
  } catch (error) {
    console.error("Error fetching user counts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getCounts, getUserCounts };
