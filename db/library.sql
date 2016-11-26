-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 26, 2016 at 06:15 PM
-- Server version: 5.7.14
-- PHP Version: 5.6.4-4ubuntu6.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `csrf_token` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `username`, `password`, `csrf_token`) VALUES
(5, 'sachin', 'sachin1234', 'fiusvauozzcqroqkngfayciruxhqqxgvfaobaiqa');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id_cart` int(11) NOT NULL,
  `user_id_user` int(11) NOT NULL,
  `product_id_product` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id_cart`, `user_id_user`, `product_id_product`) VALUES
(165, 4, 50),
(169, 9, 75),
(168, 9, 76),
(167, 9, 77),
(166, 16, 55),
(173, 60, 72),
(175, 60, 75),
(174, 60, 76);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id_category` int(11) NOT NULL,
  `name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id_category`, `name`) VALUES
(6, 'Fiction'),
(7, 'History');

-- --------------------------------------------------------

--
-- Table structure for table `google_users`
--

CREATE TABLE `google_users` (
  `google_id` decimal(21,0) NOT NULL,
  `google_name` varchar(60) NOT NULL,
  `google_email` varchar(60) NOT NULL,
  `google_link` varchar(60) NOT NULL,
  `google_picture_link` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `lender_product`
--

CREATE TABLE `lender_product` (
  `id_lender_product` int(11) NOT NULL,
  `user_id_user` int(11) NOT NULL,
  `product_id_product` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `lender_product_notification`
--

CREATE TABLE `lender_product_notification` (
  `id_lender_product_notification` int(11) NOT NULL,
  `name` text NOT NULL,
  `user_id_user` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lender_product_notification`
--

INSERT INTO `lender_product_notification` (`id_lender_product_notification`, `name`, `user_id_user`, `updated_at`, `status`) VALUES
(23, 'cvbnddvb', 16, '2016-08-06 08:32:19', 0),
(24, 'sdf', 16, '2016-08-06 08:32:19', 0),
(25, 'sdf', 16, '2016-08-06 08:32:58', 0),
(26, 'sdfsdf', 16, '2016-08-06 08:32:58', 0),
(27, 'Harry', 0, '2016-08-20 01:54:57', 0),
(28, 'sdfgh', 0, '2016-08-20 01:54:57', 0),
(29, 'h', 0, '2016-08-20 01:54:58', 0),
(30, 'dsfh', 0, '2016-08-20 01:54:58', 0),
(31, 'veeru', 7, '2016-08-20 07:06:58', 0),
(32, 'sdffsad', 10, '2016-11-19 11:20:38', 0),
(33, 'sdfdsadf', 10, '2016-11-19 11:20:38', 0),
(34, 'sdfgfsdf', 9, '2016-11-19 12:43:00', 0),
(35, 'asdf', 9, '2016-11-19 12:53:06', 0),
(36, 'asdffasdf', 9, '2016-11-19 12:53:17', 0),
(37, 'asdas', 9, '2016-11-19 12:53:58', 0),
(38, 'sdfgasdfsasdfd', 9, '2016-11-19 12:54:32', 0),
(39, 'Hello World', 40, '2016-11-19 10:13:56', 0),
(40, 'Hello World', 40, '2016-11-19 10:22:53', 0),
(41, 'sadf', 60, '2016-11-20 12:22:56', 0),
(42, 'sffdsf', 60, '2016-11-20 12:22:56', 0),
(43, 'sdfffffffffff', 60, '2016-11-20 12:22:56', 0),
(44, 'sdfg', 60, '2016-11-20 12:25:31', 0),
(45, 'dfg', 60, '2016-11-20 12:25:31', 0),
(46, 'sdf', 60, '2016-11-20 12:25:43', 0),
(47, 'sdf', 60, '2016-11-20 12:25:43', 0),
(48, 'sdfg', 60, '2016-11-20 12:26:43', 0),
(49, 'fghew', 60, '2016-11-20 12:26:43', 0),
(50, 'asdwq', 60, '2016-11-20 12:27:42', 0),
(51, 'qqwqwqwqw', 60, '2016-11-20 12:27:42', 0),
(52, 'k', 60, '2016-11-20 12:42:55', 0),
(53, 'mkl', 60, '2016-11-20 12:42:55', 0);

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `id_organization` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(1024) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `user_id_user` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`id_organization`, `name`, `address`, `status`, `user_id_user`, `created_at`) VALUES
(1, 'Gr Tech Park', 'Gr Tech Park Whitefield', 1, NULL, '2016-07-02 17:46:29'),
(2, 'Itpl ', 'Itpl Whitefield Bangalore', 1, NULL, '2016-07-02 17:46:47'),
(6, 'dewdew', 'dewdewdew', 0, 4, '2016-07-31 22:08:33'),
(7, 'asddhj', 'sdfghjkl', 0, 10, '2016-08-28 12:38:35');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id_product` int(11) NOT NULL,
  `admin_id_admin` int(11) NOT NULL,
  `isbn` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `category_id_category` int(11) DEFAULT NULL,
  `user_id_user` int(11) UNSIGNED DEFAULT NULL,
  `description` text,
  `pic` varchar(255) DEFAULT NULL,
  `pic_name` longtext,
  `uploaded_by` int(11) DEFAULT NULL,
  `copies` int(11) UNSIGNED NOT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id_product`, `admin_id_admin`, `isbn`, `name`, `author`, `category_id_category`, `user_id_user`, `description`, `pic`, `pic_name`, `uploaded_by`, `copies`, `updated_at`, `created_at`) VALUES
(72, 1, 'sa', 'Sdfdgf', 'Sd', 6, 0, 'Sd', 'dddd.png', '', NULL, 2, '2016-08-20 20:49:29', '2016-08-20 20:49:29'),
(73, 1, '1234', 'Sachib', '123', 7, 0, 'Sachin1234', 'aaaa.png', '', NULL, 0, '2016-08-28 11:06:00', '2016-08-28 11:06:00'),
(75, 1, 'manju', 'Manju', 'Manju', 7, 0, 'Manju', 'cccc.png', '', NULL, 28, '2016-08-28 12:13:07', '2016-08-28 12:13:07'),
(76, 1, 'veeru', 'Veeru', 'Veeru', 6, 0, 'Veeru', 'bbbb.png', '', NULL, 328, '2016-08-28 12:13:47', '2016-08-28 12:13:47'),
(77, 1, 'anil', 'Anil', 'Anil', 7, 0, 'Anil', 'aaaa.png', '', NULL, 20, '2016-08-28 12:14:41', '2016-08-28 12:14:41');

-- --------------------------------------------------------

--
-- Table structure for table `product_has_user_review`
--

CREATE TABLE `product_has_user_review` (
  `product_has_user_review` int(11) UNSIGNED NOT NULL,
  `user_id_user` int(11) UNSIGNED NOT NULL,
  `product_id_product` int(11) UNSIGNED NOT NULL,
  `rating` float(5,2) NOT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_has_user_review`
--

INSERT INTO `product_has_user_review` (`product_has_user_review`, `user_id_user`, `product_id_product`, `rating`, `description`, `created_at`, `updated_at`) VALUES
(1, 68, 76, 3.00, 'sdffsdad', '2016-11-26 12:16:14', '2016-11-26 12:16:14'),
(2, 68, 75, 3.00, 'hftjrtf', '2016-11-26 12:21:17', '2016-11-26 12:21:17'),
(3, 68, 76, 4.50, 'iutiu', '2016-11-26 12:21:33', '2016-11-26 12:21:33'),
(4, 68, 77, 4.50, 'uikiki', '2016-11-26 12:21:40', '2016-11-26 12:21:40'),
(5, 60, 77, 5.00, 'y6ur6u', '2016-11-26 12:22:45', '2016-11-26 12:22:45'),
(6, 60, 77, 2.50, 'tutii', '2016-11-26 12:22:54', '2016-11-26 12:22:54'),
(7, 60, 77, 4.50, '', '2016-11-26 18:09:28', '2016-11-26 18:09:28');

-- --------------------------------------------------------

--
-- Table structure for table `product_label`
--

CREATE TABLE `product_label` (
  `id_product_label` int(11) NOT NULL,
  `product_id_product` int(11) NOT NULL,
  `added_by` int(11) NOT NULL,
  `user_id_user` int(11) DEFAULT NULL,
  `label` varchar(45) NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `search_history`
--

CREATE TABLE `search_history` (
  `id_search_history` int(11) UNSIGNED NOT NULL,
  `user_id_user` int(11) UNSIGNED DEFAULT NULL,
  `search_text` text,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `search_history`
--

INSERT INTO `search_history` (`id_search_history`, `user_id_user`, `search_text`, `created_at`) VALUES
(1, 0, 'sdf', '2016-11-19 16:54:00'),
(2, 0, 'wsser', '2016-11-19 16:55:08'),
(3, 11, 'sdf', '2016-11-19 16:58:56'),
(4, 33, 'dsajklj', '2016-11-19 19:31:19'),
(5, 41, 'Veeru', '2016-11-19 22:32:04'),
(6, 41, 'Veeru', '2016-11-19 22:34:33'),
(7, 42, 'Veeru', '2016-11-19 22:35:04'),
(8, 43, 'Veeru', '2016-11-19 22:35:23'),
(9, 44, 'Veeru', '2016-11-19 22:41:37'),
(10, 45, 'Veeru', '2016-11-19 22:47:34'),
(11, 45, 'Veeru', '2016-11-19 22:47:51'),
(12, 46, 'Veeru', '2016-11-19 22:48:04'),
(13, 47, 'Veeru', '2016-11-19 22:56:51'),
(14, 0, 'sdf', '2016-11-20 12:05:48'),
(15, 0, 'sddssdsd', '2016-11-20 12:05:52'),
(16, 0, 'sgsdssd', '2016-11-20 12:06:48'),
(17, 0, 'sdfg', '2016-11-20 12:09:55'),
(18, 0, 'sdf', '2016-11-20 12:09:59'),
(19, 0, 'anil', '2016-11-20 12:10:05'),
(20, 0, 'anil', '2016-11-20 12:10:08'),
(21, 0, 'sdf', '2016-11-20 12:12:41'),
(22, 0, 'sdfew', '2016-11-20 12:12:44'),
(23, 0, '111\'', '2016-11-20 12:12:48'),
(24, 0, '111\'', '2016-11-20 12:12:48'),
(25, 0, '111', '2016-11-20 12:12:50'),
(26, 0, 'ds', '2016-11-20 12:13:02'),
(27, 0, 'sdf', '2016-11-20 12:13:19'),
(28, 0, 'sdf', '2016-11-20 12:13:24'),
(29, 0, 'sdf', '2016-11-20 12:13:25'),
(30, 0, '1111', '2016-11-20 12:13:27'),
(31, 0, 'sd', '2016-11-20 12:13:51'),
(32, 0, 'sd', '2016-11-20 12:13:54'),
(33, 0, '111', '2016-11-20 12:14:14'),
(34, 0, '1', '2016-11-20 12:14:28'),
(35, 60, '111', '2016-11-20 12:17:50'),
(36, 60, '11', '2016-11-20 12:40:14'),
(37, 60, '11', '2016-11-20 12:40:18'),
(38, 60, '1', '2016-11-20 12:42:01'),
(39, 0, 'dsfd', '2016-11-21 22:17:52'),
(40, 0, 'dsf', '2016-11-21 22:18:01');

-- --------------------------------------------------------

--
-- Table structure for table `sub_transaction`
--

CREATE TABLE `sub_transaction` (
  `id_sub_transaction` int(11) NOT NULL,
  `transaction_id_transaction` int(11) NOT NULL,
  `ordered_date` date NOT NULL,
  `user_id_user` int(11) NOT NULL,
  `oraganization_id_organization` int(11) UNSIGNED NOT NULL,
  `product_id_product` int(11) NOT NULL,
  `date_issued` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sub_transaction`
--

INSERT INTO `sub_transaction` (`id_sub_transaction`, `transaction_id_transaction`, `ordered_date`, `user_id_user`, `oraganization_id_organization`, `product_id_product`, `date_issued`, `due_date`, `status`) VALUES
(1, 126, '2016-08-28', 10, 1, 73, NULL, NULL, 'cancelled'),
(2, 127, '2016-08-28', 10, 1, 73, NULL, NULL, 'cancelled'),
(3, 127, '2016-08-28', 10, 1, 77, NULL, NULL, 'cancelled'),
(4, 127, '2016-08-28', 10, 1, 75, NULL, NULL, 'cancelled'),
(6, 128, '2016-08-28', 10, 1, 76, '2016-11-26', '1970-01-01', 'delivered'),
(7, 129, '2016-08-28', 10, 1, 77, '2016-11-26', '1970-01-01', 'delivered'),
(9, 131, '2016-08-28', 10, 2, 75, '2016-11-26', '1970-01-01', 'delivered'),
(10, 131, '2016-08-28', 10, 2, 77, '2016-11-26', '1970-01-01', 'delivered'),
(11, 132, '2016-08-28', 10, 1, 77, NULL, NULL, 'Pending'),
(12, 132, '2016-08-28', 10, 1, 76, NULL, NULL, 'Pending'),
(13, 132, '2016-08-28', 10, 1, 75, NULL, NULL, 'Pending'),
(15, 133, '2016-08-28', 10, 1, 77, NULL, NULL, 'Pending'),
(17, 135, '2016-11-19', 33, 1, 77, '2016-11-26', '1970-01-01', 'delivered'),
(25, 140, '2016-11-20', 60, 1, 77, '2016-11-26', '1970-01-01', 'in_progress'),
(26, 141, '2016-11-20', 60, 1, 77, '2016-11-26', '1970-01-01', 'in_progress'),
(27, 142, '2016-11-20', 60, 1, 77, '2016-11-26', '1970-01-01', 'in_progress'),
(28, 143, '2016-11-26', 68, 1, 77, '2016-11-26', '1970-01-01', 'in_progress'),
(29, 144, '2016-11-26', 68, 2, 76, '2016-11-26', '1970-01-01', 'in_progress'),
(30, 145, '2016-11-26', 68, 1, 75, '2016-11-26', '1970-01-01', 'in_progress');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id_transaction` int(11) NOT NULL,
  `user_id_user` int(11) NOT NULL,
  `product_ids` varchar(255) NOT NULL,
  `created_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id_transaction`, `user_id_user`, `product_ids`, `created_at`) VALUES
(123, 4, '51', '2016-07-31'),
(124, 4, '50', '2016-07-31'),
(125, 7, '62', '2016-08-20'),
(126, 10, '73', '2016-08-28'),
(127, 10, '73,77,75,74', '2016-08-28'),
(128, 10, '76', '2016-08-28'),
(129, 10, '77', '2016-08-28'),
(130, 10, '74', '2016-08-28'),
(131, 10, '75,77', '2016-08-28'),
(132, 10, '77,76,75,74', '2016-08-28'),
(133, 10, '77', '2016-08-28'),
(134, 11, '77', '2016-11-19'),
(135, 33, '77', '2016-11-19'),
(136, 34, '77', '2016-11-19'),
(137, 35, '77,76,75,74', '2016-11-19'),
(138, 38, '76', '2016-11-19'),
(139, 52, '77', '2016-11-20'),
(140, 60, '77', '2016-11-20'),
(141, 60, '77', '2016-11-20'),
(142, 60, '77', '2016-11-20'),
(143, 68, '77', '2016-11-26'),
(144, 68, '76', '2016-11-26'),
(145, 68, '75', '2016-11-26');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text,
  `google_id_user` text,
  `mobile` varchar(15) DEFAULT NULL,
  `img_url` text,
  `csrf_token` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `name`, `email`, `password`, `google_id_user`, `mobile`, `img_url`, `csrf_token`) VALUES
(1, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', NULL, '', 'CagJtezgzQ2TDOuJMQTJgn0rZajrjHynx9qjKOSr'),
(2, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', NULL, '', 'IKJr1X0qm8POlWYfBhBgb9NZHS9VcIxUIL3ZSrTv'),
(3, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', NULL, '', 'a3NWVmaNma3JeyTDpxKfkkfpr3XKb0abFhSkbNlc'),
(4, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', NULL, '', 'bISXxN3C0WF39BMK8nCfBvTRqkRZbT3wzOyhn7cs'),
(5, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', NULL, '', 'EU0i6vuOcrVeaPfbZCLUXCqJbp5jmiY1IVXRxStt'),
(6, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', NULL, '', 'YUAyBRmWvlUGumnEf6YFSX6yrsXCwA2XfT31e4b3'),
(7, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', '9845316855', '', 'bBwlqoHC96q0gEMq5h4QO3KtxkBrSuo6VnnIcH0N'),
(8, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '', NULL, '', '9yvw9RDXFjnAJnvwaZ6acrLM4qIEQbEEFn9Y5Ggu'),
(9, 'chiru@gmail.com', 'chiru@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, 'hjdKij7RlPLSyMeaHo2oY9ZpyquGUa1ypOmeDC3R'),
(10, 'chiru@gmail.com', 'chiru@gmail.com', NULL, '', '9845138555', '', 'pGkZRAK5kHKbagclZ2MDZ8jgp96HxVTcynbzdDkx'),
(21, 'cccc', 'ccc@gmail.com', NULL, NULL, NULL, NULL, NULL),
(22, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'I53GtOboL9SkaeWrZMZ4EboYrFiSROgscKyhDtU9'),
(23, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'CcHz2d5AhD7uQ5rO9GhUMW71CXngyehWPENJMBw3'),
(24, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'I328pO1LahuLa9HUEm0AuSlj2XjDfZnFxkzC0sTN'),
(25, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'MfF1LyOuPB4miT1AX5zd6c3lY5eHukfnx3WpnWK9'),
(26, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'PWFPFGmDKuQPJI02mH1Qy2ILk8kdUKHAGQqcGlpA'),
(27, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', '3gACMP8ywMCttzgtSN9bnhf499BkwgW0QTewRocc'),
(28, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'ouryPvXNGx1qUaO8bl2GHAFn77xyjsrnjxvJFBGE'),
(29, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'a4jKJlANuv3FVyfcsNDq694ZRGCRJc6sBKRkvFuX'),
(30, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', '7vEkwaSiMitHj3Otx0oMFGSewcBGlg81t2FJrc7i'),
(31, 'Sachin Ostawal', 'ostawalsachin@gmail.com', NULL, '', NULL, '', 'IjZ6pGZeuYEFuAJRMKwkz5SLpHlxXk8NftdTxiiE'),
(32, 'sachin', 'sachin.ostawal@yahoo.in', '4d61fa016f71cfaf56aeac56632dfed2', NULL, NULL, NULL, 'juryuyxeqgiensonruqwssxvfsnncsfmnwkhvimm'),
(33, 'sachin', 'sachin.ostawal@yahoo.in', NULL, '', '9036044775', '', '0n2X3OcxaWvYDHXiIlJdACf0CQLr4buDkFQs4MhV'),
(60, 'Chiru Adi', 'chiruoct.13@gmail.com', NULL, '107861076438394116547', '1234567890', 'https://lh6.googleusercontent.com/-2KB1vEcJzTo/AAAAAAAAAAI/AAAAAAAAAAA/AEMOYSCJnjeTcgjdMx0TrdBxRVO0zzHf0g/s96-c/photo.jpg', 'l2qOARkwCcDvAGxYufhTmFe0jYEtNUkFxYnE72PN'),
(61, 'chiranjeeviadi1@gmail.com', 'chiranjeeviadi1@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, 'hdfpuirwvuuxsilgtlmbwomirgudtqsauyqpgimc'),
(62, 'chiranjeeviadi1@gmail.com', 'chiranjeeviadi1@gmail.com', NULL, '', NULL, 'null', 'OOhVZoOQvK9D0nHjgTsrj1kxk19qtOZbbjaHYNeo'),
(63, 'ccc', 'ccc@gamil.com', NULL, NULL, NULL, NULL, NULL),
(64, 'ccc@gmaol.com', 'ccc@gmaol.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, NULL),
(65, 'cccc@mgail.com', 'cccc@mgail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, 'psajyweztnrtobfxzyyftciheijvqzggshprduqx'),
(66, 'cccc@mgail.com', 'cccc@mgail.com', NULL, '', NULL, 'null', 'RnBEJSsBmq0t97khQau5YbItjJSwlRAMCDZJwj3c'),
(67, 'cccc', 'ccccc@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, 'gjbobcmwuiozjnprhretdunuaanxxbwekysmaeiv'),
(68, 'cccc', 'ccccc@gmail.com', NULL, '', '1234567890', 'null', 'c3HJ5o8BYTOWU9ohkFGoHkE5M3oFFeEz65vf7b2J');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id_cart`),
  ADD KEY `user_id_user` (`user_id_user`,`product_id_product`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id_category`);

--
-- Indexes for table `google_users`
--
ALTER TABLE `google_users`
  ADD PRIMARY KEY (`google_id`);

--
-- Indexes for table `lender_product`
--
ALTER TABLE `lender_product`
  ADD PRIMARY KEY (`id_lender_product`),
  ADD KEY `user_id_user` (`user_id_user`),
  ADD KEY `product_id_product` (`product_id_product`);

--
-- Indexes for table `lender_product_notification`
--
ALTER TABLE `lender_product_notification`
  ADD PRIMARY KEY (`id_lender_product_notification`);

--
-- Indexes for table `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`id_organization`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id_product`),
  ADD KEY `admin_id_admin_2` (`admin_id_admin`),
  ADD KEY `user_id_user` (`user_id_user`);

--
-- Indexes for table `product_has_user_review`
--
ALTER TABLE `product_has_user_review`
  ADD PRIMARY KEY (`product_has_user_review`),
  ADD KEY `user_id_user` (`user_id_user`),
  ADD KEY `product_id_product` (`product_id_product`);

--
-- Indexes for table `product_label`
--
ALTER TABLE `product_label`
  ADD PRIMARY KEY (`id_product_label`),
  ADD KEY `product_id_product` (`product_id_product`,`added_by`,`user_id_user`),
  ADD KEY `added_by` (`added_by`),
  ADD KEY `user_id_user` (`user_id_user`);

--
-- Indexes for table `search_history`
--
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id_search_history`);

--
-- Indexes for table `sub_transaction`
--
ALTER TABLE `sub_transaction`
  ADD PRIMARY KEY (`id_sub_transaction`),
  ADD KEY `user_id_user` (`user_id_user`,`product_id_product`),
  ADD KEY `product_id_product` (`product_id_product`),
  ADD KEY `transaction_id_transaction` (`transaction_id_transaction`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id_transaction`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `lender_product`
--
ALTER TABLE `lender_product`
  MODIFY `id_lender_product` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `lender_product_notification`
--
ALTER TABLE `lender_product_notification`
  MODIFY `id_lender_product_notification` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `id_organization` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;
--
-- AUTO_INCREMENT for table `product_has_user_review`
--
ALTER TABLE `product_has_user_review`
  MODIFY `product_has_user_review` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `product_label`
--
ALTER TABLE `product_label`
  MODIFY `id_product_label` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `search_history`
--
ALTER TABLE `search_history`
  MODIFY `id_search_history` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `sub_transaction`
--
ALTER TABLE `sub_transaction`
  MODIFY `id_sub_transaction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id_transaction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `lender_product`
--
ALTER TABLE `lender_product`
  ADD CONSTRAINT `lender_product_ibfk_1` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `lender_product_ibfk_2` FOREIGN KEY (`product_id_product`) REFERENCES `lender_product` (`id_lender_product`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `product_label`
--
ALTER TABLE `product_label`
  ADD CONSTRAINT `product_label_ibfk_1` FOREIGN KEY (`product_id_product`) REFERENCES `product` (`id_product`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `product_label_ibfk_2` FOREIGN KEY (`added_by`) REFERENCES `admin` (`id_admin`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `product_label_ibfk_3` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `sub_transaction`
--
ALTER TABLE `sub_transaction`
  ADD CONSTRAINT `sub_transaction_ibfk_1` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `sub_transaction_ibfk_2` FOREIGN KEY (`product_id_product`) REFERENCES `product` (`id_product`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
