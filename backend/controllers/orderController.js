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
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} })

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
        const orderId = moment(date).format('DDHHmmss'); // đảm bảo duy nhất
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
        
        res.json({ success: true, payment_url: payment_url })
    }
    catch (error) {
        console.error("Error placing order:", error);
        res.json({ success: false, message: "Internal server error" });
    }
}

const verifyOrder = (req, res) => {
  let vnp_Params = { ...req.body };
  let secureHash = vnp_Params.vnp_SecureHash;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", process.env.VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed && vnp_Params.vnp_ResponseCode === "00") {
    // Có thể cập nhật trạng thái đơn hàng tại đây
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "error" });
    }
}

// listing orders for admin panel
const listOrders = async (req, res) => {
    try{
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: "error" });
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders,updateStatus }