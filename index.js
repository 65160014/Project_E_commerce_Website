const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const app = express();

// การตั้งค่าการใช้ session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'SecondHandMarket'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// การตั้งค่า template engine
app.set('view engine', 'ejs');

// ตั้งค่า body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use(express.static('public'));

// Route สำหรับหน้าแรก (index.ejs)
app.get('/', (req, res) => {
    let query = "SELECT * FROM products WHERE status = 'In stock'";
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { products: results });
    });
});

// Route สำหรับหน้าแสดงสินค้าทั้งหมด (products.ejs) รวมถึงการค้นหาและจัดเรียง
app.get('/products', (req, res) => {
    // ดึงค่าการค้นหาและการจัดเรียงจาก query string
    let search = req.query.search || '';
    let sortBy = req.query.sort || 'ProductName ASC';  // Default: A-Z

    // คำสั่ง SQL สำหรับการค้นหาและเรียงลำดับสินค้า
    let query = `SELECT * FROM products WHERE status = 'In stock' AND ProductName LIKE ? ORDER BY ${sortBy}`;

    // ค้นหาข้อมูลจากฐานข้อมูลโดยใช้เงื่อนไขการค้นหาและจัดเรียง
    db.query(query, [`%${search}%`], (err, results) => {
        if (err) throw err;
        // ส่งข้อมูลสินค้า คำค้นหา และการจัดเรียงไปที่หน้า products.ejs
        res.render('products', { products: results, search: search, sort: sortBy });
    });
});



// Route สำหรับหน้าแสดงรายละเอียดสินค้า (single_product.ejs)
app.get('/product/:id', (req, res) => {
    let query = "SELECT * FROM products WHERE ProductID = ? AND status = 'In stock'";
    db.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('single_product', { product: result[0] });
    });
});

// Route สำหรับการเพิ่มสินค้าลงตะกร้า
app.post('/add-to-cart', (req, res) => {
    const productID = req.body.productID;
    const quantity = req.body.quantity || 1;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // เพิ่มสินค้าลงตะกร้า
    req.session.cart.push({ productID, quantity });
    res.redirect('/');
});

// Route สำหรับการลบสินค้าจากตะกร้า
app.post('/remove-from-cart', (req, res) => {
    const productID = req.body.productID;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Filter out the item to be removed
    req.session.cart = req.session.cart.filter(item => item.productID != productID);

    // Redirect back to the cart page
    res.redirect('/cart');
});



// Route สำหรับหน้าตะกร้าสินค้า (cart.ejs)
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    let productIDs = cart.map(item => item.productID);

    if (productIDs.length === 0) {
        res.render('cart', { products: [], total: 0 });
    } else {
        let query = "SELECT * FROM products WHERE ProductID IN (?)";
        db.query(query, [productIDs], (err, products) => {
            if (err) throw err;

            // คำนวณราคา
            let total = products.reduce((sum, product) => {
                const item = cart.find(i => i.productID == product.ProductID);
                return sum + (product.product_price * item.quantity);
            }, 0);

            res.render('cart', { products, total });
        });
    }
});

// Route สำหรับหน้าชำระเงิน (place_order.ejs)
app.get('/place_order', (req, res) => {
    const cart = req.session.cart || [];
    let productIDs = cart.map(item => item.productID);

    let query = "SELECT * FROM products WHERE ProductID IN (?)";
    db.query(query, [productIDs], (err, products) => {
        if (err) throw err;
        let total = products.reduce((sum, product) => {
            const item = cart.find(i => i.productID == product.ProductID);
            return sum + (product.product_price * item.quantity);
        }, 0);
        res.render('place_order', { products, total });
    });
});

// Route สำหรับการส่งข้อมูลการสั่งซื้อ
// Route สำหรับการส่งข้อมูลการสั่งซื้อ
app.post('/complete_order', (req, res) => {
    const { name, email, city, address, phone, paymentMethod } = req.body;
    const cart = req.session.cart || [];

    let productIDs = cart.map(item => item.productID);
    let query = "SELECT * FROM products WHERE ProductID IN (?)";

    db.query(query, [productIDs], (err, products) => {
        if (err) throw err;

        // คำนวณ total cost
        let total = products.reduce((sum, product) => {
            const item = cart.find(i => i.productID == product.ProductID);
            return sum + (product.product_price * item.quantity);
        }, 0);

        // บันทึกข้อมูลการสั่งซื้อในตาราง orders
        let orderQuery = "INSERT INTO orders (totalcost, name, email, city, address, phone) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(orderQuery, [total, name, email, city, address, phone], (err, result) => {
            if (err) throw err;
            let orderID = result.insertId;

            // เปลี่ยนสถานะสินค้าใน products เป็น "sold"
            let updateProductStatusQuery = "UPDATE products SET status = 'Sold' WHERE ProductID IN (?)";
            db.query(updateProductStatusQuery, [productIDs], (err, result) => {
                if (err) throw err;

                // รวม ProductID ทั้งหมดในคำสั่งซื้อเป็นสตริงที่ขั้นด้วย ","
                let productIDsString = cart.map(item => item.productID).join(',');

                // บันทึกรายการสินค้าลงใน order_items
                let orderItemsQuery = "INSERT INTO order_items (OrderID, ProductID) VALUES (?, ?)";
                db.query(orderItemsQuery, [orderID, productIDsString], (err, result) => {
                    if (err) throw err;

                    // บันทึกข้อมูลการชำระเงิน รวมถึงการระบุ payment_method
                    let paymentQuery = "INSERT INTO payments (OrderID, status, payment_method) VALUES (?, ?, ?)";
                    let paymentMethodValue = paymentMethod === 'COD' ? 'COD' : 'CreditCard';

                    // บันทึกข้อมูลในตาราง payments รวม payment_method
                    db.query(paymentQuery, [orderID, 'Pending', paymentMethodValue], (err, result) => {
                        if (err) throw err;

                        // ล้างตะกร้า
                        req.session.cart = [];
                        res.redirect(`/complete_transaction?orderID=${orderID}`);
                    });
                });
            });
        });
    });
});


// Route สำหรับหน้าแสดงคำสั่งซื้อที่เสร็จสมบูรณ์ (completetransaction.ejs)
app.get('/complete_transaction', (req, res) => {
    let orderID = req.query.orderID;

    let query = "SELECT * FROM orders WHERE OrderID = ?";
    db.query(query, [orderID], (err, result) => {
        if (err) throw err;

        let paymentQuery = "SELECT * FROM payments WHERE OrderID = ?";
        db.query(paymentQuery, [orderID], (err, paymentResult) => {
            if (err) throw err;

            res.render('completetransaction', {
                order: result[0],
                payment: paymentResult[0]
            });
        });
    });
});

// Server Start
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
