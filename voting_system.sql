-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2024 at 04:24 PM
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
-- Database: `voting system`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `password_hash`) VALUES
(1, 'admin', 'admin', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `logo` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `party` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `logo`, `position`, `name`, `party`) VALUES
(6, 'Bharatiya_Janata_Party_logo.svg.png', 'Prime Minister', 'Siddharth Dhumal', 'BJP'),
(7, 'download.png', 'Home Minister', 'Yash Panwal', 'Congress'),
(8, 'aam admi party.png', 'President', 'Omkar Gole', 'aam admi party'),
(9, 'telanga.jpeg', 'Minister', 'Shruti Bhosale', 'Telangana'),
(10, 'logo-Republican-National-Committ.png', 'Vise president', 'Nikhil Chile', 'National party');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `mobile_no` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `mobile_no`, `email`, `password`, `password_hash`, `image`) VALUES
(27, 'vaibhav', '1234567890', 'Vaibhavpatil@gmail.com', 'vaibhav', '$2b$10$NMTNxlMt3YlQn2xB6VqqYu0QSUxqffnm7Bu5IW586jXYGSQHdNT9e', 'IMG_20220607_150521 (1).jpg'),
(28, 'Dattaram Kolte', '1234567890', 'dattaram@gmail.com', 'dattaram', '$2b$10$yKqZrpwW7svAEsF1QQ5emOE/ms.EX18FIkCEPQrTOR241ggisYPl2', 'pngtree-d-render-male-avatar-with-blue-sweater-good-for-profile-picture-png-image_4506784.png'),
(29, 'Shubham Navale', '1234567890', 'Shubham@gmail.com', 'shubham', '$2b$10$s1cxbhdFdVRZ1ySi7B66m.Q26l10FuzWq3VTgHv0QdJofSPhxC14C', 'Profile-Male-PNG.png'),
(30, 'Abhishek Yewele', '1234567890', 'Abhishek@gmail.com', 'abhishek', '$2b$10$R3O3.LsNSjGZ3ZfJiua38OgNI33lh6rJ1JLSBWBDwREZ3uJiIdrLG', 'man-avatar-image-for-profile-png.webp'),
(31, 'Siddharth Gole', '1234567890', 'Siddharth@gmail.com', 'siddharth', '$2b$10$Z2r8afi5hqwGDW0sNpIzDeU1zabl1S1qDjxuI5UOWxMxLsYM8MSh.', 'pngtree-cartoon-man-avatar-vector-ilustration-png-image_6111064.png'),
(32, 'Omkar Dhumal', '1234567890', 'omkar@gmail.com', '12345', '$2b$10$jeuQ5Psobx1WzDwaz9kapOIo40gWaPShmCwRPjcbHHI5A/KS1AMGy', 'images.png');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `voter_name` varchar(255) DEFAULT NULL,
  `candidate_name` varchar(255) DEFAULT NULL,
  `party_name` varchar(255) DEFAULT NULL,
  `position_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `voter_name`, `candidate_name`, `party_name`, `position_name`, `created_at`) VALUES
(5, 'Shubham Navale', 'Omkar Gole', 'aam admi party', 'President', '2024-04-21 10:49:58'),
(8, 'Abhishek Yewele', 'Yash Panwal', 'Congress', 'Home Minister', '2024-04-21 11:00:12'),
(9, 'Dattaram Kolte', 'Nikhil Chile', 'National party', 'Vise president', '2024-04-21 13:30:06'),
(10, 'Siddharth Gole', 'Omkar Gole', 'aam admi party', 'President', '2024-04-21 14:02:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
