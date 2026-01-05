import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import moment from "moment";
import crypto from "crypto";
import qs from "qs";

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const placeOrder = async (req, res) => {

    try {
        if (!req.userId || !req.body.items || !req.body.amount || !req.body.address) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng" });
        }

        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save()
        // Don't clear cart yet - wait for payment verification

        let tmnCode = process.env.VNP_TMNCODE;
        let secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        let returnUrl = process.env.VNP_RETURN_URL;

        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const orderId = newOrder._id.toString(); // Use order ID as transaction reference
        const amount = req.body.amount; // VNPAY yêu cầu VNĐ * 100

        const bankCode = ''; // Hoặc để trống nếu không chỉ định ngân hàng

        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': `Thanh toan don hang ${orderId}`,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate
        };

        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        // Bước 1: Sort lại keys
        vnp_Params = sortObject(vnp_Params);

        // Bước 2: Tạo chuỗi hash
        let signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        // Bước 3: Gắn hash vào URL
        vnp_Params['vnp_SecureHash'] = signed;
        let payment_url = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

        res.status(200).json({ success: true, payment_url: payment_url })
    }
    catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const verifyOrder = async (req, res) => {
    try {
        let vnp_Params = { ...req.body };
        let secureHash = vnp_Params.vnp_SecureHash;

        delete vnp_Params.vnp_SecureHash;
        delete vnp_Params.vnp_SecureHashType;

        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
        const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        if (secureHash === signed && vnp_Params.vnp_ResponseCode === "00") {
            // Payment successful - update order and clear cart
            const orderId = vnp_Params.vnp_TxnRef;
            const order = await orderModel.findByIdAndUpdate(orderId, {
                payment: true,
                status: "Food Processing"
            });

            if (order) {
                // Clear cart after successful payment
                await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
                return res.status(200).json({ success: true, message: "Payment verified successfully" });
            } else {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
        } else {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
}

// listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        if (!req.body.orderId || !req.body.status) {
            return res.status(400).json({ success: false, message: "Missing orderId or status" });
        }
        
        const order = await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.status(200).json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
}

// api reports revenue
const reportsRevenue = async (req, res) => {
    console.log("Thống kê doanh thu từ", req.query.startDate, "đến", req.query.endDate);
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Vui lòng cung cấp startDate và endDate' });
    }

    try {
        const revenueData = await orderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    status: 'Delivered'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalRevenue: { $sum: "$amount" },
                    countOrders: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json(revenueData);
    } catch (err) {
        console.error("Lỗi khi thống kê doanh thu:", err);
        res.status(500).json({ error: 'Lỗi server khi thống kê doanh thu' });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, reportsRevenue };