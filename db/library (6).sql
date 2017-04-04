-- phpMyAdmin SQL Dump
-- version 4.6.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 03, 2017 at 09:35 AM
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
(5, 'sachin', 'sachin1234', 'ltmxxnefsxotsdorvalcylwwedmuuyogrbdooiug'),
(6, 'chiru', 'chiru1234', 'tilbgipnjwggmaicatmckxvmayepwgmpoyruhhiq');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id_cart` int(11) NOT NULL,
  `user_id_user` int(11) NOT NULL,
  `product_id_product` int(11) NOT NULL,
  `organization_id_organization` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id_cart`, `user_id_user`, `product_id_product`, `organization_id_organization`) VALUES
(2, 2, 90, 8),
(17, 2, 92, 8),
(19, 6, 92, 1),
(20, 6, 93, 1),
(21, 6, 76, 1),
(31, 8, 76, NULL),
(32, 8, 100, NULL),
(38, 0, 79, 1),
(39, 4, 76, 1),
(40, 4, 92, 1);

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
(7, 'History'),
(8, 'Self-Help');

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
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `product_id_product` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lender_product_notification`
--

INSERT INTO `lender_product_notification` (`id_lender_product_notification`, `name`, `user_id_user`, `updated_at`, `status`, `product_id_product`) VALUES
(1, 'mybook1', 2, '2017-01-07 12:59:23', 1, NULL),
(2, 'pl1', 2, '2017-01-07 01:04:40', 1, NULL),
(3, 'b', 6, '2017-01-28 05:29:56', 0, NULL),
(4, 'd', 6, '2017-01-28 05:29:56', 0, NULL),
(5, 'sddfdf', 6, '2017-01-28 06:00:51', 0, NULL),
(6, 'dfffd', 6, '2017-01-28 06:00:51', 0, NULL),
(7, 'fdfdfd', 6, '2017-01-28 06:00:51', 0, NULL),
(8, '3de', 6, '2017-01-28 06:02:47', 0, NULL),
(9, 'de', 6, '2017-01-28 06:02:47', 0, NULL),
(10, '55', 6, '2017-01-28 06:03:29', 0, NULL),
(11, 'sdfg', 6, '2017-01-28 06:05:00', 0, NULL),
(12, 'fer', 6, '2017-01-28 06:10:34', 0, NULL),
(13, 'xcfd', 6, '2017-01-28 06:13:51', 0, NULL),
(14, 'cdff', 6, '2017-01-28 06:14:27', 0, NULL),
(15, 'sddfdf', 6, '2017-01-28 06:18:21', 0, NULL),
(16, 'dwe', 6, '2017-01-28 06:19:09', 0, NULL),
(17, 'dwe', 6, '2017-01-28 06:19:22', 0, NULL),
(18, 'dwe', 6, '2017-01-28 06:19:27', 0, NULL),
(19, 'erfre', 6, '2017-01-28 06:20:32', 0, NULL),
(20, 'frefrefre', 6, '2017-01-28 06:20:38', 0, NULL),
(21, 'dsfdsd', 6, '2017-01-28 06:21:14', 0, NULL),
(22, 'dewdew', 6, '2017-01-28 06:21:22', 0, NULL),
(23, 'ewdw', 6, '2017-01-28 06:21:53', 0, NULL),
(24, 'ewdedwe', 6, '2017-01-29 12:31:00', 0, NULL),
(25, 'ssd', 6, '2017-01-29 12:33:13', 0, NULL),
(26, 'ds', 4, '2017-03-05 04:39:25', 0, NULL),
(27, 'kkkkkkk', 4, '2017-03-25 05:52:50', 0, NULL),
(28, 'dede', 4, '2017-03-29 11:43:38', 0, NULL),
(29, '1111q222', 8, '2017-03-29 08:19:09', 1, 106),
(30, 'dwe', 4, '2017-04-02 03:51:18', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `id_organization` int(11) UNSIGNED NOT NULL,
  `admin_id_admin` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(1024) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `user_id_user` int(11) UNSIGNED DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`id_organization`, `admin_id_admin`, `name`, `address`, `status`, `user_id_user`, `created_at`) VALUES
(1, NULL, 'Gr Tech Park', 'Gr Tech Park Whitefield', 1, NULL, '2016-07-02 17:46:29'),
(2, NULL, 'Itpl ', 'Itpl Whitefield Bangalore', 1, NULL, '2016-07-02 17:46:47'),
(6, NULL, 'dewdew', 'dewdewdew', 0, 4, '2016-07-31 22:08:33'),
(7, NULL, 'asddhj', 'sdfghjkl', 0, 10, '2016-08-28 12:38:35'),
(8, 5, 'Salaral', 'ssara', 1, 0, '2017-01-07 13:28:52'),
(9, NULL, 'ssdsd', '', 0, 6, '2017-01-28 18:56:31'),
(10, NULL, 'e', '', 0, 6, '2017-01-28 19:00:25'),
(11, NULL, 'dew', '', 0, 6, '2017-01-28 19:03:33');

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
  `description` longtext,
  `pic` varchar(255) DEFAULT NULL,
  `pic_name` longtext,
  `uploaded_by` int(11) DEFAULT NULL,
  `copies` int(11) UNSIGNED NOT NULL,
  `ratings` float(5,2) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id_product`, `admin_id_admin`, `isbn`, `name`, `author`, `category_id_category`, `user_id_user`, `description`, `pic`, `pic_name`, `uploaded_by`, `copies`, `ratings`, `updated_at`, `created_at`) VALUES
(72, 1, 'sa', 'Sdfdgf', 'Sd', 6, 0, 'Sd', 'dddd.png', '', NULL, 0, 3.00, '2016-08-20 20:49:29', '2016-08-20 20:49:29'),
(73, 1, '1234', 'Sachib', '123', 7, 0, 'Sachin1234', 'aaaa.png', '', NULL, 0, 3.00, '2016-08-28 11:06:00', '2016-08-28 11:06:00'),
(75, 1, 'manju', 'Manju', 'Manju', 7, 0, 'Manju', 'cccc.png', '', NULL, 19, 3.00, '2016-08-28 12:13:07', '2016-08-28 12:13:07'),
(76, 1, 'veeru', 'Veeru', 'Veeru', 6, 0, 'Veeru', 'bbbb.png', '', NULL, 321, 5.00, '2016-08-28 12:13:47', '2016-08-28 12:13:47'),
(77, 1, 'anil', 'Anil', 'Anil', 7, 0, 'Anil', 'aaaa.png', '', NULL, 17, 3.00, '2016-08-28 12:14:41', '2016-08-28 12:14:41'),
(78, 5, 'asddf', 'Sadf', 'Sdf', 6, 0, 'Asdfasd', 'sadf_1480231325_The winning way.png', '', NULL, 0, 3.00, '2016-11-27 12:52:05', '2016-11-27 12:52:05'),
(79, 5, 'wde', 'S3wqdew', '3', 6, 0, 'Dedd', 's3wqdew_1480231916_Narendra modi the man the times.png', '', NULL, 3, 5.00, '2016-11-27 13:01:56', '2016-11-27 13:01:56'),
(80, 5, 'err', 'Sdfgh', '345', 6, 0, 'Sdfg', 'sdfgh_1480231984_Daily inspiration for everyday men.png', '', NULL, 42, 3.00, '2016-11-27 13:03:04', '2016-11-27 13:03:04'),
(81, 5, '4', '344', '4', 7, 0, '444', '344_1480232601_Connect the dots.png', '', NULL, 42, 3.00, '2016-11-27 13:13:21', '2016-11-27 13:13:21'),
(82, 5, '3', '333', '3', 6, 0, '3', '333_1480232658_Dial d for don.png', '', NULL, 1, 3.00, '2016-11-27 13:14:18', '2016-11-27 13:14:18'),
(83, 5, 'de', 'De', 'De', 7, 0, 'De', 'de_1480232699_Men are from Mars women are from venus.png', '', NULL, 0, 3.00, '2016-11-27 13:14:59', '2016-11-27 13:14:59'),
(84, 5, '4', '44', '4', 7, 0, '4', '44_1480232733_Been there bungled that.png', '', NULL, 0, 3.00, '2016-11-27 13:15:33', '2016-11-27 13:15:33'),
(85, 5, '5', 'Description product', '5', 6, 0, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type.\n\nscrambled it to make a type specimen book. It has survived not only five centuries,', 'description product_1483257762_Daily inspiration for everyday men.png', '', NULL, 5, 3.00, '2017-01-01 13:32:42', '2017-01-01 13:32:42'),
(86, 5, '2', 'Creative visualisation', '2', 6, 0, 'Creative Visualization is the art of using mental imagery and affirmation to produce positive changes in your life. It is being successfully used in the fields of health, business, the creative arts, and sports, and in fact can have an impact in every area of your life. With more than six million copies sold worldwide, this pioneering bestseller and perennial favorite helped launch a new movement in personal growth when it was first published. The classic guide is filled with meditations, exercises, and techniques that can help you use the power of your imagination to create what you want in your life, change negative habit patterns, improve self-esteem, reach career goals, increase prosperity, develop creativity, increase vitality, improve your health, \n.\nexperience deep relaxation, and much more. This book can help you to increase your personal mastery of life.', 'Creative visualisation_1483767060_Body language.png', '', NULL, 22, 3.00, '2017-01-07 11:01:00', '2017-01-07 11:01:00'),
(87, 5, '3', '33333333', '3', 6, 0, '', '33333333_1483768037_Harry Potter and the cursed child.png', '', NULL, 2, 3.00, '2017-01-07 11:17:17', '2017-01-07 11:17:17'),
(88, 5, '3', 'Pro111', '3', 6, 0, 'The Eighth Tale in the Harry Potter SagaBeing labelled as \'the boy who lived\' for his whole life has not been easy for Harry Potter. In the official eighth instalment of the Harry Potter series penned in the form of a two-part stage production play, J. K. Rowling weaves yet another thrilling and magical yarn featuring the life of Harry Potter nineteen years later in the post-Voldemort wizarding world.A glimpse into the epic taleHarry Potter plays the role of a man finally living out the quiet, conventional lifestyle he always wanted to live as a Minister of Magic employee, who is a doting husband and father of three. Yet, he struggles to escape the haunting past, the demons of which continue to consume him. The play also features a grown up Albus Severus Potter following the footsteps of his legendary father and labouring to carry the burden of a family bequest and fortune he hadn\'t expected. As the past meets the present, the legendary father and son duo strive to come in terms with the darkness that lies within and overcome their inner demons.', 'pro111_1483768338_Body language.png', '', NULL, 4, 3.00, '2017-01-07 11:22:18', '2017-01-07 11:22:18'),
(89, 5, '3', 'Medium', '3', 6, 0, 'The Eighth Tale in the Harry Potter SagaBeing labelled as \'the boy who lived\' for his whole life has not been easy for Harry Potter. In the official eighth instalment of the Harry Potter series penned in the form of a two-part stage production play, J. K. Rowling weaves yet another thrilling and magical yarn featuring the life of Harry Potter nineteen years later in the post-Voldemort wizarding world.A glimpse into the epic taleHarry Potter plays the role of a man finally living out the quiet, conventional lifestyle he always wanted to live as a Minister of Magic employee, who is a doting husband and father of three. Yet, he struggles to escape the haunting past, the demons of which continue to consume him. The play also features a grown up Albus Severus Potter following the footsteps of his legendary father and labouring to carry the burden of a family bequest and fortune he hadn\'t expected. As the past meets the present, the legendary father and son duo strive to come in terms with the darkness that lies within and overcome their inner demons.', 'medium_1483768440_Ignited mind.png', '', NULL, 2, 3.00, '2017-01-07 11:24:00', '2017-01-07 11:24:00'),
(90, 5, '3', 'Pro333', '3', 6, 0, 'The Eighth Tale in the Harry Potter SagaBeing labelled as \'the boy who lived\' for his whole life has not been easy for Harry Potter. In the official eighth instalment of the Harry Potter series penned in the form of a two-part stage production play, J. K. Rowling weaves yet another thrilling and magical yarn featuring the life of Harry Potter nineteen years later in the post-Voldemort wizarding worlThe Eighth Tale in the Harry Potter SagaBeing labelled as \'the boy who lived\' for his whole life has not been easy for Harry Potter. In the official eighth instalment of the Harry Potter series penned in the form of a two-part stage production play, J. K. Rowling weaves yet another thrilling and magical yarn featuring the life of Harry Potter nineteen years later in the post-Voldemort wizarding worl', 'pro333_1483768503_Ignited mind.png', '', NULL, 1, 3.00, '2017-01-07 11:25:03', '2017-01-07 11:25:03'),
(91, 5, '3', 'Ee', '3', 6, 0, 'ABCSABCS', 'ee_1483768589_The Google story.png', '', NULL, 31, 3.00, '2017-01-07 11:26:29', '2017-01-07 11:26:29'),
(92, 5, '1', 'Mybook1', 'Mybook1', 8, 2, 'Mybook1', 'mybook1_1483774187_Daily inspiration for everyday men.png', '', NULL, 221, 3.00, '2017-01-07 12:59:47', '2017-01-07 12:59:47'),
(93, 5, '3', 'Pl1', '3', 8, 2, '1', 'pl1_1483774579_The magic of thinking big.png', '', NULL, 29, 3.00, '2017-01-07 13:06:19', '2017-01-07 13:06:19'),
(94, 5, '11', '1111111111', '1', 7, 0, '', '1111111111_1485428047_Unsolved mysteries.png', '', NULL, 1, 3.00, '2017-01-26 16:24:07', '2017-01-26 16:24:07'),
(95, 5, '333', '22222222', '33', 7, 0, '', '22222222_1485428151_To kill a mockingbird bird.png', '', NULL, 33, 3.00, '2017-01-26 16:25:51', '2017-01-26 16:25:51'),
(96, 5, '22', 'Weew', '3', 6, 0, '', 'weew_1485429295_Ignited mind.png', '', NULL, 33, 3.00, '2017-01-26 16:44:55', '2017-01-26 16:44:55'),
(97, 5, '2', 'Kkk', '2', 6, 0, 'Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.&nbsp;It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum', 'kkk_1485429906_Dial d for don.png', '', NULL, 22, 3.00, '2017-01-26 16:55:06', '2017-01-26 16:55:06'),
(98, 5, '33', 'Eee', '3', 7, 0, 'Lorem Ipsum&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.', 'eee_1485430096_Harry Potter and the cursed child.png', '', NULL, 33, 3.00, '2017-01-26 16:58:16', '2017-01-26 16:58:16'),
(99, 5, '33', 'Eee', '3', 7, 0, '<p><strong style="margin: 0px; padding: 0px; color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, </span></p><p><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</span><br></p>', 'eee_1485430448_Harry Potter and the cursed child.png', '', NULL, 33, 3.00, '2017-01-26 17:04:08', '2017-01-26 17:04:08'),
(100, 5, '33', 'Eeeooooo', '3', 7, 0, '<p><strong style="margin: 0px; padding: 0px; color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, </span></p><p><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</span><br></p>', 'eeeooooo_1485430465_Harry Potter and the cursed child.png', '', NULL, 33, 3.00, '2017-01-26 17:04:25', '2017-01-26 17:04:25'),
(101, 5, 'e3', 'Eeeeeeeeeee', '3', 7, 0, '<ol><li style="text-align: center;"><strong style="margin: 0px; padding: 0px; color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</span></li><li><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;"><br></span></li><li><strong style="margin: 0px; padding: 0px; color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</span><span style="color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif; text-align: justify;"><br></span><br></li></ol>', 'eeeeeeeeeee_1485430738_The magic of thinking big.png', '', NULL, 2, 3.00, '2017-01-26 17:08:58', '2017-01-26 17:08:58'),
(102, 5, '22', '858', '22', 6, 0, '<div style="margin: 0px 14.3906px 0px 28.7969px; padding: 0px; width: 436.797px; text-align: left; float: left; color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif;"><p style="margin-bottom: 15px; padding: 0px; text-align: justify;"><strong style="margin: 0px; padding: 0px;">Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the l.</p><div style="margin: 0px 14.3906px 0px 28.7969px; padding: 0px; width: 436.797px; float: left;"><p style="margin-bottom: 15px; padding: 0px; text-align: justify;">eap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p></div><div style="margin: 0px 28.7969px 0px 14.3906px; padding: 0px; width: 436.797px; float: right;"><h2 style="font-family: DauphinPlain; line-height: 24px; margin-top: 0px; margin-right: 0px; margin-left: 0px; font-size: 24px; padding: 0px;">Why do we use it?</h2><p style="margin-bottom: 15px; padding: 0px; text-align: justify;">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p></div><p style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; text-align: center;"><br></p><p style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; text-align: center;"><br></p></div><div style="margin: 0px 14.3906px 0px 28.7969px; padding: 0px; width: 436.797px; text-align: left; float: left; color: rgb(0, 0, 0); font-family: &quot;Open Sans&quot;, Arial, sans-serif;"></div>', '858_1485607977_Captain cool ms.dhoni story.png', '', NULL, 22, 3.00, '2017-01-28 18:22:57', '2017-01-28 18:22:57'),
(103, 5, '111', '111111', '11', 6, 0, '<p><b><i>dewdewdewde</i></b></p>', '111111_1490442842_1.jpg', '', NULL, 11, 3.00, '2017-03-25 17:24:02', '2017-03-25 17:24:02'),
(104, 5, '111', '111111', '11', 6, 0, '<p><b><i>dewdewdewde</i></b></p>', '111111_1490442897_1.jpg', '', NULL, 11, 3.00, '2017-03-25 17:24:57', '2017-03-25 17:24:57'),
(105, 5, 'chiru1', 'Chiru1', 'Chiru1', 6, 0, '<p>chiru1chiru1chiru1chiru1chiru1<br></p>', 'chiru1_1490762422_vpn.png', '', NULL, 0, 3.00, '2017-03-29 10:10:22', '2017-03-29 10:10:22'),
(106, 5, '1', '1111q222', '1', 6, 8, '<p>111</p>', '1111q222_1490798964_Screenshot from 2017-03-14 22:39:05.png', '', NULL, 0, NULL, '2017-03-29 20:19:24', '2017-03-29 20:19:24');

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
(1, 2, 82, 5.00, '', '2017-01-01 12:13:08', '2017-01-01 12:13:08'),
(2, 6, 82, 4.50, 'Change Transactions.Change Transactions .Change Transactions .Change Transactions .', '2017-01-28 14:42:48', '2017-01-28 14:42:48'),
(3, 6, 87, 5.00, 'sdf', '2017-01-28 14:49:07', '2017-01-28 14:49:07'),
(4, 8, 105, 2.50, 'dwe', '2017-03-29 18:17:36', '2017-03-29 18:17:36'),
(5, 8, 105, 2.50, 'dwe', '2017-03-29 18:18:00', '2017-03-29 18:18:00'),
(6, 8, 105, 2.50, 'dwe', '2017-03-29 18:20:06', '2017-03-29 18:20:06'),
(7, 8, 105, 2.50, 'dwe', '2017-03-29 18:20:30', '2017-03-29 18:20:30'),
(8, 8, 105, 2.50, 'dwe', '2017-03-29 18:22:46', '2017-03-29 18:22:46'),
(9, 8, 105, 2.50, 'dwe', '2017-03-29 18:22:59', '2017-03-29 18:22:59'),
(10, 8, 105, 2.50, 'dwe', '2017-03-29 18:23:14', '2017-03-29 18:23:14'),
(11, 8, 105, 2.50, 'dwe', '2017-03-29 18:23:23', '2017-03-29 18:23:23'),
(12, 8, 105, 2.50, 'dwe', '2017-03-29 18:23:34', '2017-03-29 18:23:34'),
(13, 8, 105, 2.50, 'dwe', '2017-03-29 18:25:28', '2017-03-29 18:25:28'),
(14, 8, 105, 2.50, 'dwe', '2017-03-29 18:32:10', '2017-03-29 18:32:10');

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
(1, 2, 'd', '2017-01-07 14:56:00'),
(2, 0, 'dfdfd', '2017-01-07 18:17:03'),
(3, 0, 'd', '2017-01-07 18:17:57'),
(4, 0, 'de', '2017-01-07 18:17:57'),
(5, 0, 'de', '2017-01-07 18:17:58'),
(6, 0, 'dde', '2017-01-07 18:18:00'),
(7, 0, 'dede', '2017-01-07 18:18:00'),
(8, 0, 'dde', '2017-01-07 18:18:01'),
(9, 0, 'de', '2017-01-07 18:18:02'),
(10, 0, 'd', '2017-01-07 18:18:02'),
(11, 0, 'r', '2017-01-07 18:20:07'),
(12, 0, 'c', '2017-01-07 18:34:28'),
(13, 0, 'ch', '2017-01-07 18:34:28'),
(14, 0, 'chi', '2017-01-07 18:34:28'),
(15, 0, 'chir', '2017-01-07 18:34:28'),
(16, 0, 'chiru', '2017-01-07 18:34:28'),
(17, 0, 'chir', '2017-01-07 18:34:30'),
(18, 0, 'chi', '2017-01-07 18:34:30'),
(19, 0, 'ch', '2017-01-07 18:34:30'),
(20, 0, 'c', '2017-01-07 18:34:30'),
(21, 6, '3', '2017-01-28 16:11:57'),
(22, 6, '33', '2017-01-28 16:11:57'),
(23, 6, '333', '2017-01-28 16:12:00'),
(24, 6, '3', '2017-01-28 16:12:04'),
(25, 0, 'e', '2017-01-28 16:12:13'),
(26, 0, '4', '2017-01-28 16:12:15'),
(27, 0, 'v', '2017-01-28 16:12:17'),
(28, 0, 've', '2017-01-28 16:12:17'),
(29, 0, 'vee', '2017-01-28 16:12:17'),
(30, 6, 'sd', '2017-01-29 12:25:07'),
(31, 6, 'sdd', '2017-01-29 12:25:08'),
(32, 6, 'sddd', '2017-01-29 12:25:08'),
(33, 6, 'sdddd', '2017-01-29 12:25:08'),
(34, 6, 'sddddd', '2017-01-29 12:25:08'),
(35, 6, 'sdddddd', '2017-01-29 12:25:08'),
(36, 6, 'sddddddd', '2017-01-29 12:25:08'),
(37, 6, 'sdddddddd', '2017-01-29 12:25:08'),
(38, 6, 'sddddddddd', '2017-01-29 12:25:08'),
(39, 6, 'sdddddddddd', '2017-01-29 12:25:08'),
(40, 6, 'sddddddddddd', '2017-01-29 12:25:08'),
(41, 6, 'sdddddddddddd', '2017-01-29 12:25:08'),
(42, 6, 'sddddddddddddd', '2017-01-29 12:25:08'),
(43, 6, 'sdddddddddddddd', '2017-01-29 12:25:08'),
(44, 6, 'sddddddddddddddd', '2017-01-29 12:25:08'),
(45, 6, 'sdddddddddddddddd', '2017-01-29 12:25:08'),
(46, 6, 'sddddddddddddddddd', '2017-01-29 12:25:08'),
(47, 6, 'sddddddddddddddddds', '2017-01-29 12:25:08'),
(48, 6, 'sdddddddddddddddddsd', '2017-01-29 12:25:08'),
(49, 6, 'sdddddddddddddddddsdd', '2017-01-29 12:25:09'),
(50, 6, 'sdddddddddddddddddsddd', '2017-01-29 12:25:09'),
(51, 6, 'sdddddddddddddddddsdddd', '2017-01-29 12:25:09'),
(52, 6, 'sdddddddddddddddddsddddd', '2017-01-29 12:25:09'),
(53, 6, 'sdddddddddddddddddsdddddd', '2017-01-29 12:25:09'),
(54, 6, 'sdddddddddddddddddsddddddd', '2017-01-29 12:25:09'),
(55, 6, 'sdddddddddddddddddsdddddddd', '2017-01-29 12:25:09'),
(56, 6, 'sdddddddddddddddddsddddddddd', '2017-01-29 12:25:09'),
(57, 6, 'sdddddddddddddddddsdddddddddd', '2017-01-29 12:25:09'),
(58, 6, 'sdddddddddddddddddsddddddddddd', '2017-01-29 12:25:09'),
(59, 6, 'sdddddddddddddddddsdddddddddddd', '2017-01-29 12:25:09'),
(60, 6, 'sdddddddddddddddddsddddddddddddd', '2017-01-29 12:25:09'),
(61, 6, 'sdddddddddddddddddsdddddddddddddd', '2017-01-29 12:25:09'),
(62, 6, 'sdddddddddddddddddsddddddddddddddd', '2017-01-29 12:25:09'),
(63, 6, 'sdddddddddddddddddsdddddddddddddddd', '2017-01-29 12:25:09'),
(64, 6, 'sdddddddddddddddddsddddddddddddddddd', '2017-01-29 12:25:09'),
(65, 6, 'sdddddddddddddddddsdddddddddddddddddd', '2017-01-29 12:25:09'),
(66, 6, 'sdddddddddddddddddsddddddddddddddddddd', '2017-01-29 12:25:09'),
(67, 6, 'sdddddddddddddddddsdddddddddddddddddddd', '2017-01-29 12:25:09'),
(68, 6, 'sdddddddddddddddddsddddddddddddddddddddd', '2017-01-29 12:25:09'),
(69, 6, 'sdddddddddddddddddsdddddddddddddddddddddd', '2017-01-29 12:25:09'),
(70, 6, 'sdddddddddddddddddsddddddddddddddddddddddd', '2017-01-29 12:25:10'),
(71, 6, 'sdddddddddddddddddsdddddddddddddddddddddddd', '2017-01-29 12:25:10'),
(72, 6, 'sdddddddddddddddddsddddddddddddddddddddddddd', '2017-01-29 12:25:10'),
(73, 6, 'sdddddddddddddddddsdddddddddddddddddddddddddd', '2017-01-29 12:25:10'),
(74, 6, 'sdddddddddddddddddsddddddddddddddddddddddddddd', '2017-01-29 12:25:10'),
(75, 6, 'sdddddddddddddddddsdddddddddddddddddddddddddddd', '2017-01-29 12:25:10'),
(76, 6, 'd', '2017-01-29 12:25:30'),
(77, 6, 'df', '2017-01-29 12:25:30'),
(78, 4, 'sd', '2017-02-11 13:53:13'),
(79, 4, 'sdf', '2017-02-11 13:53:13'),
(80, 4, 'sdf', '2017-02-11 13:53:13'),
(81, 4, 'sdfs', '2017-02-11 13:53:13'),
(82, 4, 'sdf', '2017-02-11 13:53:14'),
(83, 4, 's', '2017-02-11 13:53:14'),
(84, 4, 'd', '2017-03-05 13:08:55'),
(85, 0, 'e', '2017-03-11 16:22:14'),
(86, 0, 'de', '2017-03-11 19:36:19'),
(87, 0, 'd', '2017-03-11 19:36:19'),
(88, 0, 'dew', '2017-03-11 19:36:19'),
(89, 0, 'dew', '2017-03-11 19:36:21'),
(90, 0, 'dew', '2017-03-11 19:36:22'),
(91, 0, 'dew', '2017-03-11 19:36:22'),
(92, 0, 'dew', '2017-03-11 19:36:29'),
(93, 0, 'de', '2017-03-11 19:38:33'),
(94, 0, 'de', '2017-03-11 19:38:33'),
(95, 0, 'dew', '2017-03-11 19:38:33'),
(96, 0, 'dewd', '2017-03-11 19:38:33'),
(97, 0, 'dewdew', '2017-03-11 19:38:33'),
(98, 0, 'dewde', '2017-03-11 19:38:34'),
(99, 0, 'dewde', '2017-03-11 19:38:35'),
(100, 0, 'dewd', '2017-03-11 19:38:36'),
(101, 0, 'd', '2017-03-11 19:38:36'),
(102, 0, 'dw', '2017-03-11 19:38:38'),
(103, 0, 'dwe', '2017-03-11 19:38:38'),
(104, 0, 'dwed', '2017-03-11 19:38:38'),
(105, 0, 'dwedw', '2017-03-11 19:38:38'),
(106, 0, 'dwedwe', '2017-03-11 19:38:38'),
(107, 0, 'dwedw', '2017-03-11 19:38:40'),
(108, 0, 'dwed', '2017-03-11 19:38:40'),
(109, 0, 'dwe', '2017-03-11 19:38:40'),
(110, 0, 'dw', '2017-03-11 19:38:42'),
(111, 0, 'd', '2017-03-11 19:38:43'),
(112, 0, 'dt', '2017-03-11 19:38:44'),
(113, 0, 'dtt', '2017-03-11 19:38:44'),
(114, 0, 'dttq', '2017-03-11 19:39:25'),
(115, 0, 'dttqw', '2017-03-11 19:39:25'),
(116, 0, 'd', '2017-03-11 19:41:00'),
(117, 0, 'd', '2017-03-11 19:41:02'),
(118, 0, 'dd', '2017-03-11 19:41:26'),
(119, 0, 'dde', '2017-03-11 19:41:26'),
(120, 0, 'e', '2017-03-11 19:44:01'),
(121, 0, 'e', '2017-03-11 19:44:01'),
(122, 0, 'ew', '2017-03-11 19:44:01'),
(123, 0, 'ewd', '2017-03-11 19:44:03'),
(124, 0, 'd', '2017-03-11 19:44:09'),
(125, 0, 'de', '2017-03-11 19:44:09'),
(126, 0, 'dew', '2017-03-11 19:44:09'),
(127, 0, 'dewd', '2017-03-11 19:44:09'),
(128, 0, 'dewde', '2017-03-11 19:44:09'),
(129, 0, 'dewdew', '2017-03-11 19:44:09'),
(130, 0, 'd', '2017-03-11 19:44:17'),
(131, 0, 'dw', '2017-03-11 19:44:17'),
(132, 0, 'dwe', '2017-03-11 19:44:17'),
(133, 0, 'dwed', '2017-03-11 19:44:17'),
(134, 0, 'dwedw', '2017-03-11 19:44:17'),
(135, 0, 'dwedwe', '2017-03-11 19:44:17'),
(136, 0, 'dwedwed', '2017-03-11 19:44:17'),
(137, 0, 'dwedwed', '2017-03-11 19:44:18'),
(138, 0, 'd', '2017-03-11 19:46:00'),
(139, 0, 'ds', '2017-03-11 19:46:00'),
(140, 0, 'dsf', '2017-03-11 19:46:00'),
(141, 0, 'dsfg', '2017-03-11 19:46:00'),
(142, 0, 'dsfgg', '2017-03-11 19:46:00'),
(143, 0, 'dsfggs', '2017-03-11 19:46:00'),
(144, 0, 'dsfggsa', '2017-03-11 19:46:00'),
(145, 0, 'dsfggsas', '2017-03-11 19:46:00'),
(146, 0, 'dsfggsasd', '2017-03-11 19:46:00'),
(147, 0, 'dsfggsasdf', '2017-03-11 19:46:00'),
(148, 0, 'e', '2017-03-25 10:07:21'),
(149, 0, 'w', '2017-03-25 10:09:25'),
(150, 0, 'w', '2017-03-25 10:09:25'),
(151, 0, 'we', '2017-03-25 10:09:25'),
(152, 0, '1', '2017-03-25 17:24:14'),
(153, 0, '11', '2017-03-25 17:24:14'),
(154, 0, '1', '2017-03-25 17:24:24'),
(155, 0, '11', '2017-03-25 17:24:25'),
(156, 0, '1', '2017-03-25 17:25:11'),
(157, 0, '11', '2017-03-25 17:25:11'),
(158, 0, '111', '2017-03-25 17:25:12'),
(159, 4, 'c', '2017-03-29 10:10:43');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id_subscribers` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`id_subscribers`, `email`, `created_at`) VALUES
(1, 'ccc@gmail.com', '2017-03-12 12:28:32'),
(2, 'ccc@gmail.com', '2017-03-12 12:28:39'),
(3, 'dede@gmail.com', '2017-03-12 12:31:42'),
(4, 'dede@gmail.com', '2017-03-12 12:32:27'),
(5, 'dewdew@gmil.com', '2017-03-12 12:32:42'),
(6, 'frefre@mail.com', '2017-03-12 12:33:21'),
(7, '43e3@gmail.com', '2017-03-12 12:34:08'),
(8, 'dew@gmial.com', '2017-03-12 12:34:49');

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
(1, 1, '2017-01-01', 2, 1, 79, '2017-01-01', '1970-01-01', 'finished'),
(2, 1, '2017-01-01', 2, 1, 82, '2017-01-01', '1970-01-01', 'finished'),
(3, 1, '2017-01-01', 2, 1, 84, '2017-01-01', '1970-01-01', 'finished'),
(4, 2, '2017-01-01', 2, 1, 84, NULL, NULL, 'Pending'),
(5, 3, '2017-01-01', 2, 1, 84, NULL, NULL, 'Pending'),
(6, 4, '2017-01-07', 2, 1, 77, NULL, NULL, 'Pending'),
(7, 4, '2017-01-07', 2, 1, 91, NULL, NULL, 'Pending'),
(8, 4, '2017-01-07', 2, 1, 88, '2017-01-07', '2017-01-27', 'finished'),
(9, 4, '2017-01-07', 2, 1, 90, NULL, NULL, 'Pending'),
(10, 5, '2017-01-07', 3, 1, 92, '2017-01-07', '2017-01-27', 'delivered'),
(15, 10, '2017-01-07', 4, 1, 93, '2017-01-26', '2017-02-01', 'delivered'),
(16, 11, '2017-01-07', 4, 1, 93, '2017-01-26', '2017-02-01', 'delivered'),
(17, 12, '2017-01-07', 4, 1, 78, NULL, NULL, 'cancelled'),
(18, 12, '2017-01-07', 4, 1, 80, '2017-01-26', '2017-02-15', 'delivered'),
(19, 12, '2017-01-07', 4, 1, 93, NULL, NULL, 'Pending'),
(20, 13, '2017-01-08', 4, 2, 81, '2017-01-28', '2017-02-17', 'delivered'),
(21, 13, '2017-01-08', 4, 2, 91, NULL, NULL, 'Pending'),
(22, 14, '2017-01-08', 4, 1, 90, NULL, NULL, 'Pending'),
(23, 15, '2017-01-08', 2, 1, 89, NULL, NULL, 'Pending'),
(24, 16, '2017-01-28', 6, 8, 87, '2017-01-31', '2017-02-20', 'in_progress'),
(25, 17, '2017-01-28', 6, 8, 82, '2017-01-29', '2017-02-18', 'in_progress'),
(26, 18, '2017-01-28', 6, 2, 75, NULL, NULL, 'cancelled'),
(27, 19, '2017-01-28', 6, 2, 75, '2017-01-21', '2017-01-28', 'in_progress'),
(28, 20, '2017-01-28', 6, 1, 76, NULL, NULL, 'cancelled'),
(29, 21, '2017-01-28', 6, 1, 75, NULL, NULL, 'cancelled'),
(30, 22, '2017-01-28', 6, 2, 72, NULL, NULL, 'Pending'),
(31, 23, '2017-02-11', 4, 8, 101, NULL, NULL, 'Pending'),
(32, 23, '2017-02-11', 4, 1, 75, NULL, NULL, 'Pending'),
(33, 24, '2017-02-11', 4, 1, 75, NULL, NULL, 'Pending'),
(34, 25, '2017-02-11', 4, 1, 77, NULL, NULL, 'Pending'),
(35, 26, '2017-02-11', 4, 1, 75, NULL, NULL, 'Pending'),
(36, 27, '2017-03-11', 8, 0, 75, NULL, NULL, 'Pending'),
(37, 27, '2017-03-11', 8, 1, 93, NULL, NULL, 'Pending'),
(38, 28, '2017-03-25', 4, 0, 75, NULL, NULL, 'cancelled'),
(39, 28, '2017-03-25', 4, 1, 76, NULL, NULL, 'Pending'),
(40, 28, '2017-03-25', 4, 0, 77, NULL, NULL, 'Pending'),
(41, 28, '2017-03-25', 4, 0, 78, NULL, NULL, 'cancelled'),
(42, 29, '2017-03-25', 4, 1, 76, NULL, NULL, 'Pending'),
(43, 30, '2017-03-25', 4, 1, 76, NULL, NULL, 'Pending'),
(45, 32, '2017-03-26', 4, 1, 76, NULL, NULL, 'Pending'),
(46, 33, '2017-03-29', 4, 1, 105, NULL, NULL, 'Pending'),
(47, 34, '2017-03-29', 4, 1, 76, NULL, NULL, 'Pending'),
(48, 34, '2017-03-29', 4, 1, 105, NULL, NULL, 'Pending'),
(49, 35, '2017-03-29', 8, 1, 105, '2017-03-31', '2017-04-20', 'in_progress'),
(50, 36, '2017-03-29', 4, 1, 106, NULL, NULL, 'Pending');

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
(1, 2, '79,82,84', '2017-01-01'),
(2, 2, '84', '2017-01-01'),
(3, 2, '84', '2017-01-01'),
(4, 2, '77,91,88,90', '2017-01-07'),
(5, 3, '92', '2017-01-07'),
(6, 0, '91', '2017-01-07'),
(7, 4, ',91,93', '2017-01-07'),
(8, 4, ',91,93', '2017-01-07'),
(9, 4, ',91,93', '2017-01-07'),
(10, 4, '93', '2017-01-07'),
(11, 4, '93', '2017-01-07'),
(12, 4, '78,80,93', '2017-01-07'),
(13, 4, '81,91', '2017-01-08'),
(14, 4, '90', '2017-01-08'),
(15, 2, '89', '2017-01-08'),
(16, 6, '87', '2017-01-28'),
(17, 6, '82', '2017-01-28'),
(18, 6, '75', '2017-01-28'),
(19, 6, '75', '2017-01-28'),
(20, 6, '76', '2017-01-28'),
(21, 6, '75', '2017-01-28'),
(22, 6, '72', '2017-01-28'),
(23, 4, '101,75', '2017-02-11'),
(24, 4, '75', '2017-02-11'),
(25, 4, '77', '2017-02-11'),
(26, 4, '75', '2017-02-11'),
(27, 8, '75,93', '2017-03-11'),
(28, 4, '75,76,77,78', '2017-03-25'),
(29, 4, '76', '2017-03-25'),
(30, 4, '76', '2017-03-25'),
(31, 0, '79', '2017-03-26'),
(32, 4, '76', '2017-03-26'),
(33, 4, '105', '2017-03-29'),
(34, 4, '76,105', '2017-03-29'),
(35, 8, '105', '2017-03-29'),
(36, 4, '106', '2017-03-29');

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
  `csrf_token` varchar(64) DEFAULT NULL,
  `email_notified` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `name`, `email`, `password`, `google_id_user`, `mobile`, `img_url`, `csrf_token`, `email_notified`) VALUES
(2, 'ccc', 'chiru3210@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '', '1234567890', 'null', 'qnqrsiluhpodntxqpidzyobmlflumdddquvidgdk', 0),
(3, 'sachin', 'sachin1234@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, '1234567890', NULL, '1MZbG7ttWINbrPARzzditXtERgaORq52NratmRxc', 0),
(4, 'Chiranjeevi Adi', 'chiranjeeviadi@gmail.com', NULL, '108295051910888020762', '1234567890', 'https://lh5.googleusercontent.com/-4dAhCdZdGJI/AAAAAAAAAAI/AAAAAAAAAqA/8uUY3GIr9kQ/s96-c/photo.jpg', NULL, 0),
(5, 'chiru', 'chiru12345@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, 'aollrzfpaxbtjpcsclvvbtbhbsowehtfvfqmevcf', 0),
(6, 'Chiru Adi', 'chiruoct.13@gmail.com', NULL, '107861076438394116547', '1234567890', 'https://lh6.googleusercontent.com/-2KB1vEcJzTo/AAAAAAAAAAI/AAAAAAAAAAA/ADPlhfJeMH-RbRDS0vZ9emnRUqgCclZtfA/s96-c/photo.jpg', 'Y0h0Zvgsnx9Z03j3zf9sPypmIKIuzqrdaHdMoXJu', 0),
(7, 'ccc', 'abcd@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', NULL, NULL, NULL, 'wsfrpndgciyzupdnmwehsuxvkynalakhsqzidcpf', 0),
(8, 'Chiranjeevi Adi', 'chiruadi3210@gmail.com', NULL, '100872960433881846149', '1234567890', 'https://lh5.googleusercontent.com/-7RpWmSJi80w/AAAAAAAAAAI/AAAAAAAAAAA/AAomvV1IFH4F8puo91efIAwStc2MIRpMYw/s96-c/photo.jpg', NULL, 0);

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
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id_subscribers`);

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
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `lender_product`
--
ALTER TABLE `lender_product`
  MODIFY `id_lender_product` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `lender_product_notification`
--
ALTER TABLE `lender_product_notification`
  MODIFY `id_lender_product_notification` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `id_organization` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;
--
-- AUTO_INCREMENT for table `product_has_user_review`
--
ALTER TABLE `product_has_user_review`
  MODIFY `product_has_user_review` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `product_label`
--
ALTER TABLE `product_label`
  MODIFY `id_product_label` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `search_history`
--
ALTER TABLE `search_history`
  MODIFY `id_search_history` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;
--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id_subscribers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `sub_transaction`
--
ALTER TABLE `sub_transaction`
  MODIFY `id_sub_transaction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id_transaction` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
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
