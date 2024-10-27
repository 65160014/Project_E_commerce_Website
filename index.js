const express = require('express'); // เรียกใช้ Express framework เพื่อสร้าง Web Application
const bodyParser = require('body-parser'); // เรียกใช้ body-parser เพื่อจัดการข้อมูลจาก form
const session = require('express-session'); // เรียกใช้ express-session สำหรับการจัดการ session
const mysql = require('mysql2'); // เรียกใช้ mysql2 สำหรับการเชื่อมต่อฐานข้อมูล MySQL

const app = express(); // สร้าง instance ของ express

// การตั้งค่า session เพื่อให้ข้อมูลของผู้ใช้ถูกเก็บไว้ตลอดการใช้งาน session
app.use(session({
    secret: 'secret', // กำหนดค่า secret เพื่อเข้ารหัสข้อมูล session
    resave: false, // ป้องกันไม่ให้บันทึก session ซ้ำหากไม่มีการเปลี่ยนแปลงข้อมูล
    saveUninitialized: true // เก็บ session ใหม่ทันทีแม้ยังไม่มีข้อมูล
}));

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost', // ชื่อโฮสต์ของเซิร์ฟเวอร์ MySQL
    user: 'root', // ชื่อผู้ใช้ฐานข้อมูล
    password: '', // รหัสผ่านฐานข้อมูล
    database: 'SecondHandMarket' // ชื่อฐานข้อมูล
});

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
db.connect(err => {
    if (err) throw err; // หากเกิดข้อผิดพลาดในการเชื่อมต่อให้แสดงข้อผิดพลาด
    console.log('Connected to database'); // แสดงข้อความเมื่อเชื่อมต่อสำเร็จ
});

// กำหนดให้ใช้ template engine แบบ ejs เพื่อแสดงผล HTML ที่มีตัวแปร
app.set('view engine', 'ejs');

// ตั้งค่า body-parser เพื่อให้สามารถเข้าถึงข้อมูลใน body ของ HTTP requests ได้
app.use(bodyParser.urlencoded({ extended: true }));

// กำหนดให้ใช้ไฟล์ในโฟลเดอร์ 'public' เป็น static files เช่น CSS, JavaScript
app.use(express.static('public'));

// Route สำหรับหน้าแรก (index.ejs)
app.get('/', (req, res) => {
    let query = "SELECT * FROM products WHERE status = 'In stock'"; // คิวรีข้อมูลสินค้าที่สถานะเป็น 'In stock'
    db.query(query, (err, results) => {
        if (err) throw err; // หากมีข้อผิดพลาดในการคิวรีให้แสดงข้อผิดพลาด
        res.render('index', { products: results, cart: req.session.cart || [] }); // ส่งข้อมูลสินค้าและตะกร้าไปที่หน้า index.ejs
    });
});

// Route สำหรับเพิ่มสินค้าในตะกร้า
app.post('/add-to-cart', (req, res) => {
    const productID = req.body.productID; // รับ productID ของสินค้าที่เพิ่มในตะกร้า
    const quantity = req.body.quantity || 1; // รับจำนวนสินค้าที่เพิ่ม (ค่าเริ่มต้น 1)

    if (!req.session.cart) { // ตรวจสอบว่ามีตะกร้าสินค้าใน session หรือไม่
        req.session.cart = []; // หากไม่มีให้สร้าง array ใหม่สำหรับเก็บสินค้าลงตะกร้า
    }

    const existingItem = req.session.cart.find(item => item.productID == productID); // ตรวจสอบว่ามีสินค้าชิ้นนี้ในตะกร้าหรือยัง
    if (!existingItem) { // หากยังไม่มีสินค้าชิ้นนี้ในตะกร้า
        req.session.cart.push({ productID, quantity }); // เพิ่มสินค้าในตะกร้า
    }

    res.setHeader('Content-Type', 'application/json'); // กำหนด header เป็น JSON
    res.json({ success: true }); // ส่ง response กลับเป็น JSON
});

// Route สำหรับหน้าแสดงสินค้าทั้งหมด
app.get('/products', (req, res) => {
    let search = req.query.search || ''; // รับค่าการค้นหาจาก query string
    let sortBy = req.query.sort || 'ProductName ASC'; // รับค่าเรียงลำดับจาก query string (ค่าเริ่มต้น A-Z)

    let query = `SELECT * FROM products WHERE status = 'In stock' AND ProductName LIKE ? ORDER BY ${sortBy}`; // คิวรีข้อมูลสินค้าโดยใช้เงื่อนไขการค้นหาและเรียงลำดับ
    db.query(query, [`%${search}%`], (err, results) => {
        if (err) throw err; // หากมีข้อผิดพลาดในการคิวรีให้แสดงข้อผิดพลาด
        res.render('products', { products: results, search: search, sort: sortBy, cart: req.session.cart || [] }); // ส่งข้อมูลสินค้า, คำค้นหา, การจัดเรียง, และตะกร้าไปที่หน้า products.ejs
    });
});

// Route สำหรับแสดงรายละเอียดสินค้าชิ้นเดียว
app.get('/product/:id', (req, res) => {
    let query = "SELECT * FROM products WHERE ProductID = ? AND status = 'In stock'"; // คิวรีข้อมูลสินค้าชิ้นเดียวตาม ProductID
    db.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('single_product', { product: result[0] }); // ส่งข้อมูลสินค้าไปที่หน้า single_product.ejs
    });
});

// Route สำหรับการลบสินค้าจากตะกร้า
app.post('/remove-from-cart', (req, res) => {
    const productID = req.body.productID; // รับ ProductID ของสินค้าที่ต้องการลบจากตะกร้า

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart = req.session.cart.filter(item => item.productID != productID); // ลบสินค้าชิ้นที่ตรงกับ ProductID ออกจากตะกร้า
    res.redirect('/cart'); // เปลี่ยนเส้นทางไปยังหน้า cart
});

// Route สำหรับหน้าตะกร้าสินค้า (cart.ejs)
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    let productIDs = cart.map(item => item.productID); // สร้าง array ของ ProductID ทั้งหมดในตะกร้า

    if (productIDs.length === 0) {
        res.render('cart', { products: [], total: 0 }); // หากไม่มีสินค้าในตะกร้า แสดงหน้า cart พร้อมข้อมูลว่าง
    } else {
        let query = "SELECT * FROM products WHERE ProductID IN (?)"; // คิวรีข้อมูลสินค้าจาก ProductID ที่อยู่ในตะกร้า
        db.query(query, [productIDs], (err, products) => {
            if (err) throw err;

            // คำนวณราคารวม
            let total = products.reduce((sum, product) => {
                const item = cart.find(i => i.productID == product.ProductID);
                return sum + (product.product_price * item.quantity); // คำนวณราคารวมของสินค้าในตะกร้า
            }, 0);

            res.render('cart', { products, total }); // ส่งข้อมูลสินค้าและราคารวมไปที่หน้า cart.ejs
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
        res.render('place_order', { products, total }); // แสดงข้อมูลสินค้าพร้อมราคารวมที่หน้า place_order.ejs
    });
});

// Route สำหรับการส่งข้อมูลการสั่งซื้อ
app.post('/complete_order', (req, res) => {
    const { name, email, city, address, phone, paymentMethod } = req.body; // รับข้อมูลจาก form
    const cart = req.session.cart || [];

    let productIDs = cart.map(item => item.productID);
    let query = "SELECT * FROM products WHERE ProductID IN (?)";

    db.query(query, [productIDs], (err, products) => {
        if (err) throw err;

        let total = products.reduce((sum, product) => {
            const item = cart.find(i => i.productID == product.ProductID);
            return sum + (product.product_price * item.quantity);
        }, 0);

        let orderQuery = "INSERT INTO orders (totalcost, name, email, city, address, phone) VALUES (?, ?, ?, ?, ?, ?)"; // สร้างคำสั่ง SQL สำหรับบันทึกข้อมูลการสั่งซื้อ
        db.query(orderQuery, [total, name, email, city, address, phone], (err, result) => {
            if (err) throw err;
            let orderID = result.insertId;

            let updateProductStatusQuery = "UPDATE products SET status = 'Sold' WHERE ProductID IN (?)";
            db.query(updateProductStatusQuery, [productIDs], (err, result) => {
                if (err) throw err;

                let productIDsString = cart.map(item => item.productID).join(',');

                let orderItemsQuery = "INSERT INTO order_items (OrderID, ProductID) VALUES (?, ?)";
                db.query(orderItemsQuery, [orderID, productIDsString], (err, result) => {
                    if (err) throw err;

                    let paymentQuery = "INSERT INTO payments (OrderID, status, payment_method) VALUES (?, ?, ?)";
                    let paymentMethodValue = paymentMethod === 'COD' ? 'COD' : 'CreditCard';

                    db.query(paymentQuery, [orderID, 'Pending', paymentMethodValue], (err, result) => {
                        if (err) throw err;

                        req.session.cart = []; // ล้างข้อมูลตะกร้า
                        res.redirect(`/complete_transaction?orderID=${orderID}`); // เปลี่ยนเส้นทางไปยังหน้าเสร็จสิ้นการทำรายการ
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

            res.render('completetransaction', { order: result[0], payment: paymentResult[0] }); // แสดงข้อมูลคำสั่งซื้อและการชำระเงินที่หน้า completetransaction.ejs
        });
    });
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ต 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000'); // แสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน
});
