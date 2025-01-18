-- MySQL dump 10.13  Distrib 9.0.1, for macos15.1 (arm64)
--
-- Host: localhost    Database: carRental
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int NOT NULL,
  `engine_type` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `status` enum('available','reserved') NOT NULL DEFAULT 'available',
  `doors` int NOT NULL,
  `trunk_capacity` decimal(5,2) DEFAULT NULL,
  `drive_type` varchar(50) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (1,'Ford','Fiesta',2020,'Benzyna','https://media.autoexpress.co.uk/image/private/s--LfbsjpVh--/v1566927596/autoexpress/2019/08/01_33.jpg',120.00,'available',5,300.00,'2WD',NULL),(2,'Toyota','Corolla',2021,'Benzyna','https://media.autoexpress.co.uk/image/private/s--5kiRjZg4--/v1563182795/autoexpress/2019/05/01_0.jpg',150.00,'available',5,400.00,'2WD',NULL),(3,'BMW','320',2022,'Diesel','https://s1.cdn.autoevolution.com/images/news/gallery/this-one-sick-bmw-e92-m3-makes-us-think-twice-before-checking-out-an-m4-photo-gallery_14.jpg',200.00,'available',4,500.00,'4WD',NULL),(4,'Tesla','Model 3',2022,'Elektryczny','https://www.motortrend.com/uploads/sites/5/2017/07/Tesla-Model-3-lead-.jpg',250.00,'available',4,425.00,'AWD',NULL);
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `fk_product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,NULL),(2,NULL),(3,NULL),(4,NULL),(5,NULL),(6,NULL),(7,NULL),(8,NULL),(9,NULL),(10,NULL),(11,NULL),(12,NULL),(13,NULL),(14,51),(15,52),(16,53),(17,54);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `car_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `comments` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (5,53,4,'2025-02-20','2025-02-21','pending','komentarz co nie'),(6,53,3,'2025-02-21','2025-02-21','pending','orzel'),(7,53,1,'2021-10-10','2021-10-09','pending','');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john.doe@example.com','123'),(2,'jane.smith@example.com','qwerty'),(3,'kamiljamroz@wsti.pl','haslo'),(4,'kamiljamroz@wsti.pl','ldaldwla'),(5,'kamil00202@gmail.com','ldaldwla'),(6,'kamiljamroz@wsti.pl','23132131'),(7,'kamiljamroz34@wsti.pl','11312321'),(8,'johntest@gmail.com','jadulla123'),(9,'johnte22st@gmail.com','jadym123'),(10,'testelo@gmail.com','dkwakdkawkd'),(11,'kapsztyk@gmail.com','21939129'),(12,'eeeelo@gmail.com','kdwakdkaw'),(13,'dkwakdkaw@gmail.com','kdakdkwa'),(14,'dkakdkwa@gmail.com','kdakdkwa'),(15,'kamilelo@gmail.com','12345'),(16,'kamilston@gmail.com','elow29090'),(17,'kamson@gmail.com','eloelo'),(18,'kamsonelo@gmail.com','elo'),(19,'ddd','eloelo'),(20,'ddddd','dd'),(21,'kamson','ddd'),(22,'dddd','xd'),(23,'kadkakd','jadom'),(24,'elo','elo'),(25,'',''),(26,'dawdadwa',''),(27,'dwadaw',''),(28,'kemula@gmail.com',''),(29,'dkkdakd@gmail.com',''),(30,'kamilson@gma.com',''),(31,'dawdawd@gmail.com',''),(32,'xadadaw@gma.com',''),(33,'ddd@gma.c',''),(34,'kams@gmail.com',''),(35,'xxx@gmai.com',''),(36,'ddd@gmail.com',''),(37,'dkakdak@gmail.com',''),(38,'dadadak@gmail.com',''),(39,'xxx@gmail.com',''),(40,'kamson@gmail.comdad',''),(41,'ddd@gmail.comdmada',''),(42,'dkakldakdka@gmail.com',''),(43,'dkakdakdk@gmail.com','xx'),(44,'dadamdwmadm@gmail.com','!'),(45,'dd@gmail.comdamdwma',''),(46,'kamson@gmail.comdakdkadk','123456'),(47,'kamil@gmail.pl','jadom123'),(48,'toja@gmail.com','jadom1'),(49,'jadom123@gmail.com','jadom1'),(50,'eagle@gmail.com','eagle123'),(51,'kamsono123@gmail.com','eagle123'),(52,'eaglelel@gmail.com','123456'),(53,'kamsonolo@gmail.com','eagle1'),(54,'trapolo@gmail.com','eloso290901');
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

-- Dump completed on 2025-01-17 22:35:52
