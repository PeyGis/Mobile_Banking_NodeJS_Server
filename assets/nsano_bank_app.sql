-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2018 at 02:20 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nsano_bank_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` varchar(50) NOT NULL,
  `account_category` varchar(100) NOT NULL,
  `account_balance` decimal(12,2) NOT NULL,
  `person_account` int(11) NOT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `account_category`, `account_balance`, `person_account`, `status`, `date_created`, `date_updated`) VALUES
('ACT1234124578455', 'Savings Account', '6898.40', 40, 'Active', '2018-05-21 16:16:37', '2018-05-21 16:16:37'),
('ACT2244553366772', 'Current Account', '118.30', 40, 'Active', '2018-05-21 16:16:37', '2018-05-21 16:16:37');

-- --------------------------------------------------------

--
-- Table structure for table `merchant`
--

CREATE TABLE `merchant` (
  `merchant_id` int(11) NOT NULL,
  `merchant_name` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `merchant`
--

INSERT INTO `merchant` (`merchant_id`, `merchant_name`, `date_created`) VALUES
(1, 'DSTV ', '2018-05-28 18:38:00'),
(2, 'ECG GHANA', '2018-05-28 18:38:00'),
(3, 'SIC LOANS', '2018-05-28 18:39:05'),
(4, 'GRA TAX', '2018-05-28 18:39:05');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `person_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pin` varchar(100) DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`person_id`, `first_name`, `last_name`, `phone`, `email`, `pin`, `status`, `date_created`) VALUES
(10, 'Pages', 'Coffie', '05487881108', '', '$2b$10$YunOnmDC8jQldHqHCiWwouLLuQbi7IPilfmrjzpWbxoE4vWMnpAYq', 'Active', '2018-05-21 15:08:14'),
(40, 'Isaac ', 'Coffie ', '0548771108', '1234', '$2b$10$MlI7fg.mRqUFsI7CLETituWeXCp1GRyvjlbJ/e3khiVGWEYg5tJWG', 'Active', '2018-05-22 17:28:16');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `transaction_id` int(11) NOT NULL,
  `channel` enum('Wallet','Account') NOT NULL,
  `channel_number` varchar(50) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `transaction` varchar(100) DEFAULT NULL,
  `details` text NOT NULL,
  `debit_credit` enum('Debit','Credit') NOT NULL,
  `status` enum('Success','Error') NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`transaction_id`, `channel`, `channel_number`, `amount`, `transaction`, `details`, `debit_credit`, `status`, `date`) VALUES
(4, 'Account', 'ACT2244553366772', '5.00', 'Fund Transfer', 'Funds Transfer to Wallet', 'Credit', 'Success', '2018-05-28 09:57:13'),
(8, 'Account', 'ACT2244553366772', '22.00', 'Airtime Recharge', 'Airtime Recharge to 0548771111', 'Credit', 'Success', '2018-05-28 10:13:18'),
(12, 'Wallet', '0548771108', '2.00', 'Fund Receipt', 'Funds Reciept from Account ACT1234124578455', 'Debit', 'Success', '2018-05-28 10:42:08'),
(24, 'Account', 'ACT2244553366772', '20.00', 'Funds Received', 'Funds Receipt from Account ACT1234124578455', 'Debit', 'Success', '2018-05-28 10:57:24'),
(35, 'Account', 'ACT2244553366772', '11.00', 'Airtime Recharge', 'Airtime Recharge to 0242953766', 'Credit', 'Success', '2018-05-29 13:11:04'),
(39, 'Account', 'ACT2244553366772', '10.00', 'Funds Received', 'Funds Receipt from Account ACT1234124578455', 'Debit', 'Success', '2018-05-29 18:49:59'),
(53, 'Account', 'ACT2244553366772', '6.00', 'Fund Transfer', 'Funds Transfer to Wallet 0548771108', 'Credit', 'Success', '2018-05-30 12:12:11'),
(58, 'Account', 'ACT2244553366772', '0.20', 'Fund Transfer', 'Funds Transfer to Wallet 0242953722', 'Credit', 'Success', '2018-05-30 13:05:45'),
(65, 'Account', 'ACT2244553366772', '0.80', 'Bill Payment', 'Payment of Bills to GRA Tax', 'Credit', 'Success', '2018-06-01 12:13:20'),
(66, 'Account', 'ACT2244553366772', '10.20', 'Bill Payment', 'Payment of Bills to SIC LOANS', 'Credit', 'Success', '2018-06-07 09:56:20'),
(67, 'Account', 'ACT2244553366772', '10.20', 'Bill Payment', 'Payment of Bills to SIC LOANS', 'Credit', 'Success', '2018-06-07 09:56:21'),
(68, 'Account', 'ACT2244553366772', '4.00', 'Airtime Recharge', 'Airtime Recharge to 0548771108', 'Credit', 'Success', '2018-06-07 09:57:24'),
(69, 'Account', 'ACT1234124578455', '5.00', 'Airtime Recharge', 'Airtime Recharge to 0548771108', 'Credit', 'Success', '2018-06-07 10:50:24'),
(70, 'Account', 'ACT1234124578455', '5.00', 'Airtime Recharge', 'Airtime Recharge to 0548771108', 'Credit', 'Success', '2018-06-07 10:50:26'),
(71, 'Account', 'ACT1234124578455', '2.00', 'Bill Payment', 'Payment of Bills to GRA TAX', 'Credit', 'Success', '2018-06-07 10:51:26'),
(72, 'Account', 'ACT1234124578455', '20.00', 'Funds Transfer', 'Funds Transfer to Account ACT2244553366772', 'Credit', 'Success', '2018-06-07 10:52:52'),
(74, 'Account', 'ACT1234124578455', '20.00', 'Funds Transfer', 'Funds Transfer to Account ACT2244553366772', 'Credit', 'Success', '2018-06-07 10:53:11'),
(75, 'Account', 'ACT2244553366772', '20.00', 'Funds Received', 'Funds Receipt from Account ACT1234124578455', 'Debit', 'Success', '2018-06-07 10:53:11'),
(76, 'Account', 'ACT1234124578455', '20.00', 'Funds Transfer', 'Funds Transfer to Account ACT2244553366772', 'Credit', 'Success', '2018-06-07 10:53:34'),
(77, 'Account', 'ACT2244553366772', '20.00', 'Funds Received', 'Funds Receipt from Account ACT1234124578455', 'Debit', 'Success', '2018-06-07 10:53:34'),
(78, 'Account', 'ACT1234124578455', '10.00', 'Bill Payment', 'Payment of Bills to ECG GHANA', 'Credit', 'Success', '2018-06-07 10:57:16'),
(81, 'Wallet', '0548771108', '5.00', 'Funds Transfer', 'Funds Transfer to Account ACT1234124578455', 'Credit', 'Success', '2018-06-11 09:30:13'),
(82, 'Account', 'ACT1234124578455', '5.00', 'Funds Received', 'Funds Receipt from Wallet 0548771108', 'Debit', 'Success', '2018-06-11 09:30:13'),
(83, 'Wallet', '0548771108', '5.00', 'Funds Transfer', 'Funds Transfer to Account ACT1234124578455', 'Credit', 'Success', '2018-06-11 09:31:09'),
(84, 'Account', 'ACT1234124578455', '5.00', 'Funds Received', 'Funds Receipt from Wallet 0548771108', 'Debit', 'Success', '2018-06-11 09:31:09'),
(85, 'Account', 'ACT1234124578455', '10.00', 'Airtime Recharge', 'Airtime Recharge to 0548771108', 'Credit', 'Success', '2018-06-13 13:27:45'),
(86, 'Account', 'ACT1234124578455', '2.00', 'Funds Transfer', 'Funds Transfer to Wallet 0242953722', 'Credit', 'Success', '2018-06-18 08:44:40'),
(87, 'Wallet', '0242953722', '2.00', 'Funds Received', 'Funds Receipt from Account ACT1234124578455', 'Debit', 'Success', '2018-06-18 08:44:40'),
(88, 'Account', 'ACT1234124578455', '0.10', 'Funds Transfer', 'Funds Transfer to Account ACT2244553366772', 'Credit', 'Success', '2018-06-26 09:11:18'),
(89, 'Account', 'ACT2244553366772', '0.10', 'Funds Received', 'Funds Receipt from Account ACT1234124578455', 'Debit', 'Success', '2018-06-26 09:11:18'),
(90, 'Account', 'ACT1234124578455', '1.00', 'Funds Transfer', 'Funds Transfer to Account ACT2244553366772', 'Credit', 'Success', '2018-06-27 09:15:38'),
(91, 'Account', 'ACT2244553366772', '1.00', 'Funds Received', 'Funds Receipt from Account ACT1234124578455', 'Debit', 'Success', '2018-06-27 09:15:38');

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `wallet_id` varchar(50) NOT NULL,
  `wallet_balance` decimal(12,2) NOT NULL,
  `network` varchar(100) NOT NULL,
  `person_wallet` int(11) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`wallet_id`, `wallet_balance`, `network`, `person_wallet`, `date_created`, `date_updated`) VALUES
('0242953722', '2.20', 'VODAFONE CASH', 40, '2018-05-26 14:10:55', NULL),
('0548771108', '41.00', 'MTN MOBILE MONEY', 40, '2018-05-24 19:03:19', NULL),
('WT1234', '18.00', 'MTN MoMo', 10, '2018-05-21 16:29:30', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`),
  ADD KEY `FK_Person_Account` (`person_account`);

--
-- Indexes for table `merchant`
--
ALTER TABLE `merchant`
  ADD PRIMARY KEY (`merchant_id`),
  ADD UNIQUE KEY `merchant_name` (`merchant_name`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`person_id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`transaction_id`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`wallet_id`),
  ADD KEY `person_wallet` (`person_wallet`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `merchant`
--
ALTER TABLE `merchant`
  MODIFY `merchant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `FK_Person_Account` FOREIGN KEY (`person_account`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wallet`
--
ALTER TABLE `wallet`
  ADD CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`person_wallet`) REFERENCES `person` (`person_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
