-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 26, 2024 at 04:47 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `submitly`
--

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `course` varchar(128) NOT NULL,
  `professor` varchar(64) NOT NULL,
  `test` smallint NOT NULL,
  `language` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `id` int NOT NULL,
  `name` varchar(64) NOT NULL,
  `Student_Roster` tinyint NOT NULL COMMENT 'Going to link to a set of other students',
  `department` varchar(32) NOT NULL,
  `professor` smallint UNSIGNED NOT NULL,
  `TA` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'list of TAs',
  `assignments` int UNSIGNED NOT NULL,
  `description` varchar(1000) NOT NULL, -- Addition day of client demonstration
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submission`
--

DROP TABLE IF EXISTS `submission`;
CREATE TABLE IF NOT EXISTS `submission` (
  `id` int NOT NULL,
  `filename` varchar(128) NOT NULL,
  `size` double NOT NULL,
  `grade` tinyint DEFAULT NULL,
  `hash` varchar(256) NOT NULL,
  `uploader` int NOT NULL,
  `date_uploaded` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Edition` smallint NOT NULL,
  `course` varchar(128) NOT NULL,
  `plage_grade` tinyint DEFAULT NULL,
  `path` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unit_tests`
--

DROP TABLE IF EXISTS `unit_tests`;
CREATE TABLE IF NOT EXISTS `unit_tests` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `language` varchar(16) NOT NULL,
  `size` double NOT NULL,
  `path` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL,
  `FirstName` varchar(32) NOT NULL,
  `LastName` varchar(32) NOT NULL,
  `TrentID` int UNSIGNED NOT NULL,
  `user_type` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `FirstName`, `LastName`, `TrentID`, `user_type`) VALUES
(0, 'Ian', 'Beattie', 674504, 0),
(1, 'Sasha', 'Goone', 834543, 3),
(2, 'Chris', 'Warner', 765487, 3),
(3, 'Iris', 'Smith', 234634, 2),
(4, 'Riley', 'Wood', 605418, 3),
(5, 'Caleb', 'Cohen', 124537, 3),
(6, 'Mira', 'Till', 296219, 2),
(7, 'Natalie', 'King', 827072, 3),
(8, 'Maya', 'Prince', 188534, 1),
(9, 'Drew', 'Walker', 252530, 1),
(10, 'Declan', 'Marshall', 135792, 1),
(11, 'Leah', 'Oak', 188877, 3),
(12, 'Annie', 'Ward', 316526, 3),
(13, 'Sam', 'Wheeler', 380522, 3);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
