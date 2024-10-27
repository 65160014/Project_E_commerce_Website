-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 27, 2024 at 10:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `secondhandmarket`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `totalcost` decimal(10,2) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `ItemID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `ProductID` varchar(255) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `PaymentID` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `ProductName` varchar(255) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_detail` text NOT NULL,
  `status` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `ProductName`, `product_price`, `product_image`, `product_detail`, `status`) VALUES
(1, 'Used iPhone 12', 12000.00, 'iphone12.jpg', 'This iPhone 12 is in good working condition with a few minor scratches on the back cover and sides. The screen is intact and free from cracks. It’s a 64GB model in black, fully unlocked for use with any carrier. The battery health is still at 85%, meaning it holds a good charge. Comes with the original box, but no charger or headphones included. Perfect for users looking for a solid phone at a discounted price.', 'In stock'),
(2, 'Second-hand Mountain Bike', 5500.00, 'MOUNTAIN-BIKE.jpg', 'This is a well-maintained 21-speed mountain bike, perfect for both off-road and city rides. It features an aluminum frame for lightness and durability, along with front suspension to absorb shocks from bumpy terrains. The tires are almost new, replaced just two months ago. The bike also includes a rear cargo rack and an upgraded saddle for extra comfort on longer rides. Some minor scratches on the frame, but nothing that affects functionality.', 'In stock'),
(3, 'Used Sony Headphones', 1200.00, 'Sony-Headphones.jpg', 'These Sony noise-canceling headphones offer crystal-clear sound with deep bass and clear highs. They’ve been used for about a year but are still in excellent condition with no visible signs of wear. The ear cushions are soft and comfortable, and the adjustable headband fits any head size. Perfect for those who need a quiet listening experience while commuting or working. The original audio cable and carrying pouch are included.', 'In stock'),
(4, 'Second-hand Laptop (Dell XPS 13)', 18000.00, 'dell-laptop.jpg', 'This is a Dell XPS 13, a compact ultrabook featuring a 13-inch Full HD display. The laptop is powered by an Intel i7 processor, 16GB of RAM, and a 512GB SSD, making it great for multitasking and professional work. It’s only two years old and still performs like new. The laptop has some minor wear on the keyboard and palm rest but no functional issues. It comes with the original charger and a protective sleeve. Battery life remains strong, lasting up to 7 hours on a single charge.', 'In stock'),
(5, 'Used PlayStation 4', 7000.00, 'ps4.jpg', 'This is a PlayStation 4 with 500GB of storage, perfect for casual gaming and entertainment. The console is in good condition and includes two original DualShock controllers (one slightly used, the other in great shape). It comes with five pre-installed popular games, including FIFA and Call of Duty. The original HDMI and power cables are also included, along with the box. Some minor surface scratches on the console, but it works flawlessly.', 'In stock'),
(6, 'Second-hand Sofa Set', 3000.00, 'sofa.jpg', 'This comfortable 3-seater sofa is upholstered in a durable grey fabric, perfect for a living room or home office. The cushions are still firm, and the fabric shows no major signs of wear aside from some slight discoloration on one armrest. The wooden legs are sturdy and in excellent condition. This sofa is about 3 years old and comes from a pet-free, smoke-free household. It is easy to clean and can be disassembled for easy transportation.', 'In stock'),
(7, 'Used Samsung Galaxy Tab S6 Lite', 8500.00, 'samsung_tab_s6_lite.jpg', 'This Samsung Galaxy Tab S6 is a high-performance tablet with a 10.5-inch Super AMOLED display. It’s the 128GB version, and the original stylus pen is included, making it perfect for note-taking, drawing, and other productivity tasks. It has some light scratches on the back cover but no damage to the screen or functionality. The battery is still in great condition, lasting a full day of heavy use. It also comes with a protective case and the original charger.', 'In stock'),
(8, 'Second-hand Office Chair', 2000.00, 'Office-Chair.jpg', 'This ergonomic office chair is in excellent condition, designed to provide comfort during long working hours. It features an adjustable backrest, seat height, and armrests to cater to different body types. The mesh backrest ensures breathability, while the padded seat offers great cushioning. The wheels roll smoothly, and the base is sturdy. Some slight wear on the seat fabric, but the chair is fully functional with no mechanical issues.', 'In stock'),
(9, 'Used Nikon D3500 Camera', 9500.00, 'NikonD3500.jpg', 'This Nikon D3500 is a 24-megapixel DSLR camera, perfect for both beginner and amateur photographers. It comes with an 18-55mm lens, a great all-around lens for various types of photography. The camera body and lens are in near-perfect condition with no scratches or dents. The battery still holds a full charge, and the camera comes with the original charger, camera strap, and a 16GB memory card. Great for travel, portraits, or landscape photography.', 'In stock'),
(10, 'Second-hand Gaming PC', 25000.00, 'PC.jpg', 'This gaming PC is built for high-performance gaming and content creation. It features an Intel i9 processor, 16GB of RAM, and a GTX 1660 graphics card, making it capable of running modern AAA games at high settings. It has a 1TB hard drive for ample storage, along with a 256GB SSD for faster boot times. The case is sleek, with RGB lighting and efficient cooling. The system is 2 years old, well-maintained, and runs smoothly. Includes a wireless gaming mouse and keyboard.', 'In stock'),
(11, 'Used MacBook Pro 2020', 45000.00, 'macbookpro2020.jpg', 'MacBook Pro 13-inch, 2020 model, Intel Core i5, 8GB RAM, 256GB SSD. Screen in perfect condition, slight scratches on the lid. Comes with original charger.', 'In stock'),
(12, 'Second-hand JBL Bluetooth Speaker', 3200.00, 'jblspeaker.jpg', 'JBL Flip 5 portable speaker, delivers excellent sound quality, waterproof and perfect for outdoor use. No visible damage, battery life still strong.', 'In stock'),
(13, 'Used Xbox One', 6000.00, 'xboxone.jpg', 'Xbox One 500GB model. Includes one controller and 3 games (Halo, Forza, FIFA). The console is in good condition with some light surface wear.', 'In stock'),
(14, 'Second-hand AirPods Pro', 6500.00, 'airpodspro.jpg', 'AirPods Pro with active noise cancellation. Used for 6 months, still in excellent working condition. Comes with the original charging case and box.', 'In stock'),
(15, 'Used GoPro HERO8 Black', 9000.00, 'goprohero8.jpg', 'GoPro HERO8 Black action camera, 4K video recording, waterproof up to 10m. Some minor scratches on the lens cover, but video quality remains unaffected.', 'In stock'),
(16, 'Second-hand Kindle Paperwhite', 4000.00, 'kindle.jpg', 'Kindle Paperwhite, 6-inch display, 8GB storage. In very good condition, no damage to the screen. Comes with a leather case and charging cable.', 'In stock'),
(17, 'Used Dyson V11 Vacuum Cleaner', 12000.00, 'dysonv11.jpg', 'Dyson V11 cordless vacuum, used for a year, still in great working condition. Comes with all original accessories and charging dock.', 'In stock'),
(18, 'Second-hand Electric Guitar (Fender)', 9500.00, 'fenderguitar.jpg', 'Fender Stratocaster electric guitar, excellent sound quality. Slight cosmetic wear on the body but no impact on performance. Includes a soft carrying case.', 'In stock'),
(19, 'Used Nikon Z6 Mirrorless Camera', 45000.00, 'nikonz6.jpg', 'Nikon Z6 full-frame mirrorless camera, 24.5MP sensor, great for professional photography. Camera body only, in near-mint condition. Includes charger and strap.', 'In stock'),
(20, 'Second-hand Samsung Galaxy S10+', 10000.00, 'galaxys10plus.jpg', 'Samsung Galaxy S10+, 128GB storage, ceramic white. The phone has been well maintained, only light scuffs on the sides. Comes with original box and charger.', 'In stock'),
(21, 'Used LG 4K Smart TV (55-inch)', 16000.00, 'lg4ktv.jpg', '55-inch LG Smart TV, 4K Ultra HD resolution, HDR support. The screen is in perfect condition, used for less than 2 years. Includes the remote and original packaging.', 'In stock'),
(22, 'Second-hand Apple Watch Series 6', 8500.00, 'applewatch6.jpg', 'Apple Watch Series 6, GPS model, 40mm aluminum case. The watch is in excellent condition, barely any signs of wear. Comes with the original box and charger.', 'In stock'),
(23, 'Used Canon Pixma Printer', 1500.00, 'canonprinter.jpg', 'Canon Pixma inkjet printer, ideal for home or small office use. Printer works well, minor ink stains around the cartridge area. Includes power cable.', 'In stock'),
(24, 'Second-hand Gaming Chair', 4500.00, 'gamingchair.jpg', 'Ergonomic gaming chair with lumbar support and adjustable armrests. Used for a year, fabric in good condition, some wear on the armrests. Still very comfortable.', 'In stock'),
(25, 'Used Huawei MatePad Pro', 11000.00, 'matepadpro.jpg', 'Huawei MatePad Pro, 10.8-inch display, 6GB RAM, 128GB storage. Comes with a keyboard case and M-Pen. Slight scratch on the screen but functions perfectly.', 'In stock'),
(26, 'Second-hand Nespresso Coffee Machine', 2500.00, 'nespresso.jpg', 'Nespresso Inissia coffee machine, used for a few months. Well maintained, works perfectly, no visible damage. Comes with the original box and manuals.', 'In stock'),
(27, 'Used Bose QuietComfort 35 II', 7000.00, 'boseqc35.jpg', 'Bose QuietComfort 35 II wireless noise-cancelling headphones. Slight wear on the ear cushions, but still performs exceptionally well. Includes the case and charging cable.', 'In stock'),
(28, 'Second-hand Sony PS5', 25000.00, 'ps5.jpg', 'Sony PlayStation 5, disc version. Includes two DualSense controllers and 4 games. The console is in excellent condition, only used for 6 months.', 'In stock'),
(29, 'Used Lenovo ThinkPad X1 Carbon', 32000.00, 'thinkpadx1.jpg', 'Lenovo ThinkPad X1 Carbon, 8th Gen, Intel i7, 16GB RAM, 512GB SSD. The laptop is lightweight and in perfect working condition, only minor wear on the keyboard.', 'In stock'),
(30, 'Second-hand Garmin Forerunner 245', 6000.00, 'garminforerunner.jpg', 'Garmin Forerunner 245, GPS running watch. Excellent for tracking runs and workouts. Minor scuffs on the band, the screen is in perfect condition.', 'In stock');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`PaymentID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
