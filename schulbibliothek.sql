-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:4306
-- Généré le : lun. 17 fév. 2025 à 10:00
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `schulbibliothek`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `vorname` varchar(50) NOT NULL,
  `nachname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `passwort_hash` varchar(255) NOT NULL,
  `erstellt_am` timestamp NOT NULL DEFAULT current_timestamp(),
  `bild` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `vorname`, `nachname`, `email`, `passwort_hash`, `erstellt_am`, `bild`) VALUES
(4, '', '', 'abdellah@a.com', '4124bc0a9335c27f086f24ba207a4912', '2025-02-14 23:56:41', NULL),
(5, 'Max', 'Müller', 'max.mueller@example.com', '$2y$10$yIGlhh44p5RPrflcXwT2OO9njQIR6Bt/LtIoJ9i1HT3qYpeYIUvGe', '2025-02-15 01:01:30', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ausleihen`
--

CREATE TABLE `ausleihen` (
  `id` int(11) NOT NULL,
  `buch_id` int(11) NOT NULL,
  `schueler_id` int(11) NOT NULL,
  `ausleihdatum` date NOT NULL,
  `rueckgabedatum` date NOT NULL,
  `status` enum('borrowed','overdue','returned') DEFAULT 'borrowed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ausleihen`
--

INSERT INTO `ausleihen` (`id`, `buch_id`, `schueler_id`, `ausleihdatum`, `rueckgabedatum`, `status`) VALUES
(113, 1, 109, '2025-01-17', '2025-02-17', 'returned');

-- --------------------------------------------------------

--
-- Structure de la table `buecher`
--

CREATE TABLE `buecher` (
  `id` int(11) NOT NULL,
  `titel` varchar(255) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `erstellt_am` timestamp NOT NULL DEFAULT current_timestamp(),
  `beschreibung` text DEFAULT NULL,
  `bild` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `buecher`
--

INSERT INTO `buecher` (`id`, `titel`, `autor`, `isbn`, `erstellt_am`, `beschreibung`, `bild`) VALUES
(1, 'Die Verwandlung', 'Franz Kafka', '978-3-596-90376-3', '2025-02-13 18:06:27', 'hi', NULL),
(2, 'Der Prozess', 'Franz Kafka', '978-3-596-90527-9', '2025-02-13 18:06:27', 'aassss', NULL),
(3, 'Faust', 'Johann Wolfgang von Goethe', '978-3-15-000001-4', '2025-02-13 18:06:27', 'aajkjk', NULL),
(4, 'Effi Briest', 'Theodor Fontane', '978-3-15-000002-1', '2025-02-13 18:06:27', 'aaa', '../../public/bilder/buecher/WhatsApp Image 2023-02-03 at 12.36.57 (1).jpeg'),
(110, 'Der Steppenwolf', 'Hermann Hesse', '978-3-518-18800-9', '2025-02-12 15:04:13', NULL, NULL),
(111, 'Das Parfum: Die Geschichte eines Mörders', 'Patrick Süskind', '978-3-442-12522-2', '2025-02-12 15:04:39', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `schueler`
--

CREATE TABLE `schueler` (
  `id` int(11) NOT NULL,
  `vorname` varchar(50) NOT NULL,
  `nachname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `passwort_hash` varchar(255) NOT NULL,
  `erstellt_am` timestamp NOT NULL DEFAULT current_timestamp(),
  `bild` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `schueler`
--

INSERT INTO `schueler` (`id`, `vorname`, `nachname`, `email`, `passwort_hash`, `erstellt_am`, `bild`) VALUES
(1, 'Max', 'Müller', 'max.mueller@example.com', 'gehashtesPasswort', '2025-02-04 11:44:57', NULL),
(2, 'Lisa', 'Schmidt', 'lisa.schmidt@example.com', 'gehashtesPasswort', '2025-02-04 11:44:57', NULL),
(97, 'Max', 'Smueller', 'max.smueller@example.com', '$2y$10$.5YHhAB77f1vq7Bxv/EWJ.mtvHWebf5YrVcUG4YdmHxpMZOeqwgsG', '2025-02-17 07:55:19', NULL),
(109, 'Abdellah', 'Tezza', 'abdellahtezza1@gmail.com', '$2y$10$C0QS1VbWfRNBJziEnYtrleQmNKPgF6nIalsl0858LsoEmHfaRghM2', '2025-02-17 08:13:22', NULL),
(110, 'Amine', 'harit', 'amineharit@gmail.com', '$2y$10$R3usSlDlCUaC6fGXEqS3hOJ.e3C4iYXewkBRqU3xVp5TzJmyxF3xO', '2025-02-17 08:16:04', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`vorname`);

--
-- Index pour la table `ausleihen`
--
ALTER TABLE `ausleihen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buch_id` (`buch_id`),
  ADD KEY `schueler_id` (`schueler_id`);

--
-- Index pour la table `buecher`
--
ALTER TABLE `buecher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`);

--
-- Index pour la table `schueler`
--
ALTER TABLE `schueler`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `ausleihen`
--
ALTER TABLE `ausleihen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT pour la table `buecher`
--
ALTER TABLE `buecher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT pour la table `schueler`
--
ALTER TABLE `schueler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `ausleihen`
--
ALTER TABLE `ausleihen`
  ADD CONSTRAINT `ausleihen_ibfk_1` FOREIGN KEY (`buch_id`) REFERENCES `buecher` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ausleihen_ibfk_2` FOREIGN KEY (`schueler_id`) REFERENCES `schueler` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
