-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` binary(16) NOT NULL,
  `cart_id` binary(16) NOT NULL,
  `product_id` binary(16) NOT NULL,
  `quantity` int NOT NULL,
  `selected_color` varchar(50) DEFAULT NULL,
  `selected_size` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` binary(16) NOT NULL,
  `user_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (_binary 'úN…å\ÀEüìˇ\«:™P˙\◊',_binary '±f\›\"Oü≤Y\ÕbH\À'),(_binary '\«\0]NOØG®≥{ò¬ó˚n',_binary ':I[z/DF\ÏÑΩÜ>Ú]7'),(_binary '$Å±) {J¨ª\ﬁe7\'îSú',_binary 'Zs@iwCµEÛÅ\Í\Â_|'),(_binary 'µ-êxzBè≠zmuÙ\“\Í',_binary '©UÜY9¢NMßûº*∏C®');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'T-Shirt',NULL),(2,'Shoes',NULL),(3,'Watch',NULL),(4,'Bag',NULL),(5,'Hat',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` binary(16) NOT NULL,
  `product_id` binary(16) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `selected_color` varchar(50) DEFAULT NULL,
  `selected_size` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (12,_binary 'B\Ô\Œ^QDè•\ +\—ä2\„',_binary 'y>4EO-ãy˝u]∏`F',1,450000.00,'White','M'),(13,_binary '¬Üp=K7™Sp\'˛â~',_binary 'y>4EO-ãy˝u]∏`F',1,450000.00,'Black','S');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` binary(16) NOT NULL,
  `customer_id` binary(16) NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING','PAID','SHIPPED','DELIVERED','CANCELED') DEFAULT 'PENDING',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `payment_method` enum('COD','EWALLET') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (_binary 'B\Ô\Œ^QDè•\ +\—ä2\„',_binary '±f\›\"Oü≤Y\ÕbH\À','2025-11-16 10:24:00','PENDING',450000.00,'123 ABC st, LA, 555555, ','COD'),(_binary '¬Üp=K7™Sp\'˛â~',_binary '©UÜY9¢NMßûº*∏C®','2025-11-20 11:59:11','PENDING',450000.00,'123 Test St, Test City, 12345, ','COD');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` binary(16) NOT NULL,
  `order_id` binary(16) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
  `method` enum('COD','EWALLET') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (_binary '≠E\Â¨AΩÑQ00*å',_binary '¬Üp=K7™Sp\'˛â~',495010.00,NULL,'PENDING','COD','2025-11-20 04:59:12','2025-11-20 04:59:12'),(_binary '˝éH\∆mMNöÖ$IÖ\‚\—W',_binary 'B\Ô\Œ^QDè•\ +\—ä2\„',495010.00,NULL,'PENDING','COD','2025-11-16 03:24:01','2025-11-16 03:24:01');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `product_id` binary(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,'/black-adidas-shoes.jpg','Adidas shoe',_binary 'y>4EO-ãy˝u]∏`F'),(2,'/adidas-samba-white-shoes.jpg','Adidas shoe',_binary 'y>4EO-ãy˝u]∏`F'),(3,'/white-adidas-shoes.jpg','Adidas shoe',_binary 'y>4EO-ãy˝u]∏`F'),(4,'/dior-saddle-bag.jpg','Dior bag',_binary '∞0^RSJÉÆ\◊ππò{'),(7,'/rolex-daydate-watch.jpg','Rolex watch',_binary 'ü≠{9v@mπ\‹`\Êz˘'),(8,'/white-nike-shoes.jpg','Nike shoe',_binary 'Üòü	]K.ÖUy\'cKµv'),(9,'/mu-adidas-dau-trang.png','Adidas Hat',_binary '˜\Á\—OeüL¶¡~Qz\\\Z');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` binary(16) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `description` text,
  `price` decimal(38,2) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `discount` decimal(38,2) DEFAULT NULL,
  `rating` decimal(38,2) DEFAULT NULL,
  `reviews` int DEFAULT '0',
  `stock` int DEFAULT '0',
  `size` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','AVAILABLE','REJECTED','DISCONTINUED','OUT_OF_STOCK') DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `seller_id` binary(16) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_chk_1` CHECK (((`discount` >= 0) and (`discount` <= 100))),
  CONSTRAINT `products_chk_2` CHECK (((`rating` >= 0.0) and (`rating` <= 10.0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (_binary 'Üòü	]K.ÖUy\'cKµv','Nike shoe','Luxury shoe',10000.00,'Nike',0.00,0.00,0,99,'[\"37\",\"38\",\"39\",\"40\",\"41\",\"42\",\"43\"]','[\"white\"]','AVAILABLE',2,_binary ':I[z/DF\ÏÑΩÜ>Ú]7','2025-11-22 07:03:44'),(_binary 'ü≠{9v@mπ\‹`\Êz˘','Rolex watch','Luxury',10000.00,'Rolex',0.00,0.00,0,100,'[\"Onesize\"]','[\"gold\"]','AVAILABLE',3,_binary ':I[z/DF\ÏÑΩÜ>Ú]7','2025-11-22 05:54:03'),(_binary 'y>4EO-ãy˝u]∏`F','Adidas Shoe','Shoe',450000.00,'Adidas',15.00,4.40,200,150,'[\"S\", \"M\", \"L\", \"XL\"]','[\"Black\",\"White\",\"Yellow\"]','AVAILABLE',2,_binary ':I[z/DF\ÏÑΩÜ>Ú]7','2025-11-15 03:19:09'),(_binary '∞0^RSJÉÆ\◊ππò{','Dior Bag','Shoe',100000.00,'Dior',0.00,0.00,0,50,'[\"One Size\"]','[\"Black\",\"White\",\"Yellow\"]','AVAILABLE',4,NULL,'2025-11-17 07:15:20'),(_binary '˜\Á\—OeüL¶¡~Qz\\\Z','Adidas Hat','Luxury hat',10000.00,'Adidas',0.00,0.00,0,99,'[\"37\",\"38\",\"39\",\"40\",\"41\",\"42\",\"43\"]','[\"white\"]','AVAILABLE',5,_binary ':I[z/DF\ÏÑΩÜ>Ú]7','2025-11-22 07:58:43');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` binary(16) NOT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(10) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `role` enum('ADMIN','CUSTOMER','SELLER') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary '±f\›\"Oü≤Y\ÕbH\À','Anna Lifthia','dathless','$2a$10$n423OYzbzs6OR6xWXYbHGeIqgVU2qxCSsOv.XAiqtdu2IQXSxFNpm','dathless@example.com','123 Main Street, Hanoi','0987654321',1,'CUSTOMER','2025-10-28 03:01:19','2025-11-15 00:24:04'),(_binary ':I[z/DF\ÏÑΩÜ>Ú]7','Johny Gass','user02','$2a$10$AsYld6H3/l2yLBPNy.KTxeR0XIWpn2Nirl21tQbI5Xk4Tt5xKTMsS','user02@gmail.com','111 AAA st, Tokyo, Japan | Business: Vip Seller, Tax ID: 1111','0999777333',0,'SELLER','2025-11-15 17:31:35','2025-11-15 17:31:35'),(_binary '=…ü£q\÷Cé¨ÒE^Y;','Johny Corg','johnydoe1','$2a$10$a90K.tVlq3OiBzKF3Ee/.uPcNTxErfPa9Hygj7ZPaQ7dlQbRsfHaS','john1.doe@example.com','123 Main Street, Hanoi','0999888666',1,'ADMIN','2025-10-04 00:47:04','2025-11-15 00:24:04'),(_binary 'Zs@iwCµEÛÅ\Í\Â_|','Brown Smith','johnydoe2','$2a$10$fMdz/WmvZD9.LZ3Rzip7PeIPVYh984Hbu2utvKNv.gbYIO2rcPZxC','john2.doe@example.com','123 Main Street, Hanoi','0999888777',1,'SELLER','2025-10-04 00:47:33','2025-11-15 00:24:04'),(_binary '©UÜY9¢NMßûº*∏C®','Johnson Relint','user01','$2a$10$Ap0UGwHyIAOXqfyqa8hMgO4k5i67avFVl6PXifcv0mKBRNCFpEUQa','user01@gmail.com','123 ABC st, LA, USA ','0998887776',0,'CUSTOMER','2025-11-15 17:06:27','2025-11-16 00:11:22'),(_binary '∆æÒ\–sÑBvé¬ìSëUU-','Kefla Junia','johnydoe3','$2a$10$oOfPJplJ3bNcWwphMJ7z3OPwU3cIIuTWXJGX2eGRPZ7tP3CMVSIPq','john3.doe@example.com','121 Main Street, Hanoi','0999888222',1,'CUSTOMER','2025-10-04 00:47:45','2025-11-15 00:24:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-30  5:40:04
