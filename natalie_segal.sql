-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 23, 2026 at 04:12 PM
-- Server version: 11.4.9-MariaDB-cll-lve-log
-- PHP Version: 8.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `amzpexar_natalie_segal`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `slug` varchar(190) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `cover` varchar(512) DEFAULT NULL,
  `category` varchar(128) DEFAULT NULL,
  `author` varchar(190) DEFAULT NULL,
  `read_time` varchar(64) DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `comments` int(11) NOT NULL DEFAULT 0,
  `published` tinyint(1) NOT NULL DEFAULT 1,
  `published_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `slug`, `title`, `excerpt`, `content`, `cover`, `category`, `author`, `read_time`, `views`, `comments`, `published`, `published_at`, `updated_at`) VALUES
(1, 'how-did-i-get-here', 'How Did I Get Here?', 'if I\'m not reading, I\'m writing. I\'m a word geek, the nerd tucked in the corner with a book or a pad of paper. How did I get here?', '<p>It started with a trip to meet a mysterious uncle. He\'d distanced himself from the family, but when I was 12 or 13, possibly 14, he approached my father, and off we went to visit. His name was Uncle Hy, he was married and had four children, all of them around my brothers\' ages, 6, 7, 8, somewhere around there, younger than me.</p>\n<p>The adults decided one evening to go out to dinner, just adults. My mother volunteered me to babysit. I couldn\'t argue with my mother, but I wanted to. I hated being left behind with the \"babies,\" wanted desperately to be counted among the adults. Was not going to happen.</p>\n<p>Uncle Hy could see the anger and disappointment on my face, I think, because he bribed me to babysit with a book: The Illustrated Man, Ray Bradbury\'s collection of short stories. &nbsp;And, smart man that he was, he bribed all the kids to go to bed at 8 with a promise (which he kept) of a visit to the local ice cream parlor the next day.</p>\n<p>The kids went to bed at 8, and I settled in to read.</p>\n<p>A bomb exploded in my head. Lightning struck. Pick a cliche, any cliche for epiphany, because that\'s what happened. Whole new worlds of ideas played out on the page. Whole new ways of thinking paraded themselves in my mind. It was liberation from the small-town thinking, the what-will-other-people-think mentality.</p>\n<p>I never looked back. I began to read far more than the father-approved classics, the Jules Verne, all of that. In those days, you could read all the science fiction and fantasy published in the U.S. in any given year. The multitude of writers and publishers hadn\'t quite happened yet. &nbsp;I didn\'t have easy access to a bookstore, but when I could get there, I spent my allowance and babysitting money on everything the store had in the science fiction and fantasy section. I read, read, read.</p>\n<p>And here I am.</p>\n<p>I never thanked Uncle Hy. I never wrote a fan letter to Ray Bradbury. They\'re both gone now, but here\'s the thanks. They helped to create the life I have now. So I\'m sending my thanks to the Universe. I hope somewhere they know the ripples they created when they dropped their pebbles in the pond rocked my boat.</p>', '', 'story', 'Natalie Segal', '', 12, 1, 1, '2025-10-20 19:20:51', '2025-12-09 19:59:37'),
(2, 'a-sucker-for-narrative', 'A Sucker for Narrative', '', '<p>A teacher in grad school told me once that I am a sucker for narrative. If I read a story, I want to fall into the dream of it. I want it to work. I\'ll find reasons to keep reading--until I can\'t. If the tropes become cliches, if the characters behave out of character, if the metaphors try too hard--if something wakes me out of the dream, I\'m done.&nbsp;</p>\n<p><br>I used to read to the end despite problems with the narrative. Not anymore. I generally give a novel 50 pages. If I\'m not in the dream, I give the book away or archive it. There are too many good books to read, too many good stories to get lost in.</p>\n<p><br>Of course, one woman\'s dream is another woman\'s disappointment. What I like may not be what you like. &nbsp;But I\'ll tell you what I think. Feel free to disagree. I\'m not the Authority, just a woman sharing her opinions. Feel free to share back.</p>', '', 'story', 'Natalie Segal', '', 3, 0, 1, '2025-10-21 19:32:40', '2025-12-09 21:46:37');

-- --------------------------------------------------------

--
-- Table structure for table `blog_comments`
--

CREATE TABLE `blog_comments` (
  `id` int(11) NOT NULL,
  `blog_id` int(11) NOT NULL,
  `name` varchar(190) NOT NULL DEFAULT 'Anonymous',
  `message` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_change_requests`
--

CREATE TABLE `email_change_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `new_email` varchar(190) NOT NULL,
  `code_hash` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(128) NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `token`, `user_agent`, `ip`, `created_at`, `expires_at`) VALUES
(5, 1, 'c48079751ef0e4256829f176ac778fd37f08c54bf676faec63fd700292bc33e6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1', '2025-10-10 02:19:50', '2025-10-17 02:19:50'),
(9, 1, 'f998c87f0db6dc6e73d76e770b3ab65b159df4ed20aa97a8d53956373fcfc25d', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1', '2025-10-21 00:50:02', '2025-10-28 00:50:02'),
(13, 1, '7d0719f76eadbc76e0f2a964b8299ed000509ff22aa3b82145d300de8dfae5df', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '::1', '2025-10-22 00:17:14', '2025-10-29 00:17:14'),
(17, 2, 'a82c9a2c2566cba9a747f83c3249e0a7d85beedb2fbaf6f9137bde9f10d84135', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '212.15.80.123', '2025-10-22 17:54:39', '2025-10-29 17:54:39'),
(18, 2, '522d00cd3f80803699dd25245e92ec767c5a14cf1ce7f9ecd0871fac13386fe1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '87.249.138.232', '2025-10-24 18:28:28', '2025-10-31 18:28:28'),
(19, 2, 'd3f76c107e3be4d2766fa0da4f2f4f68dc38c54eed214eb67b72b161d1cbfd7d', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '119.73.97.116', '2025-11-26 12:08:59', '2025-12-03 12:08:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(190) NOT NULL,
  `name` varchar(190) NOT NULL,
  `role` enum('admin','editor','user') NOT NULL DEFAULT 'admin',
  `avatar_url` varchar(512) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_salt` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `role`, `avatar_url`, `password_hash`, `password_salt`, `created_at`) VALUES
(1, 'arkaka0092@gmail.com', 'Natalie Segal', 'admin', '/uploads/avatars/1-1760048833723.avif', 'c495e9974d53174135549fd96daadde33e2a04ed2bf767291e0e82df15726c7566d6e7538c188e10934bf640db349b721f9655aafb0b4031d2424dbd92c8c978', '36ac4bcddc81aac0148c66e0fd60520a', '2025-10-10 01:28:36'),
(2, 'segalnataliedee@gmail.com', 'Natalie Segal', 'admin', '/uploads/avatars/2-1761064748417.avif', '69722bb883aac989d04e3c8d4d75e939f6d4dcd93c0d3f2622e2f15c38d487f1178c1d163ae0b13ca116e416865c3d16edb9401c03a925d95264a77e39ef26aa', 'd22e6ddcbf570c2907fbf3e02336c6b2', '2025-10-21 21:37:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_blog_comments_blog_created` (`blog_id`,`created_at`);

--
-- Indexes for table `email_change_requests`
--
ALTER TABLE `email_change_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_email_change_user` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `fk_password_resets_user` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `fk_sessions_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blog_comments`
--
ALTER TABLE `blog_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `email_change_requests`
--
ALTER TABLE `email_change_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_comments`
--
ALTER TABLE `blog_comments`
  ADD CONSTRAINT `fk_blog_comments_blog` FOREIGN KEY (`blog_id`) REFERENCES `blogs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_change_requests`
--
ALTER TABLE `email_change_requests`
  ADD CONSTRAINT `fk_email_change_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `fk_password_resets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
