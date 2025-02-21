-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:4306
-- Généré le : ven. 21 fév. 2025 à 19:24
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
(113, 1, 109, '2025-01-17', '2025-02-21', 'returned'),
(114, 1, 109, '2025-01-01', '2025-02-21', 'returned'),
(115, 2, 109, '2025-02-01', '2025-02-21', 'returned'),
(116, 3, 97, '2025-02-01', '2025-02-21', 'returned'),
(117, 1, 109, '2025-02-17', '2025-02-21', 'returned'),
(118, 111, 2, '2025-02-19', '2025-03-19', 'borrowed'),
(119, 4, 109, '2025-02-20', '2025-02-21', 'returned'),
(120, 4, 109, '2025-02-21', '2025-02-21', 'returned'),
(121, 110, 109, '2025-02-21', '2025-02-21', 'returned'),
(122, 110, 109, '2025-02-21', '2025-02-21', 'returned'),
(123, 4, 109, '2025-02-21', '2025-02-21', 'returned'),
(124, 4, 109, '2025-02-21', '2025-02-21', 'returned'),
(125, 110, 109, '2025-02-21', '2025-02-21', 'returned'),
(126, 4, 109, '2025-02-21', '2025-02-21', 'returned'),
(127, 110, 109, '2025-02-21', '2025-02-21', 'returned'),
(128, 4, 109, '2025-02-21', '2025-02-21', 'returned'),
(138, 1, 109, '2025-02-01', '2025-02-28', 'borrowed'),
(139, 2, 109, '2025-01-24', '2025-02-21', 'returned'),
(140, 110, 109, '2025-01-24', '2025-02-21', 'returned'),
(141, 1, 2, '2025-01-20', '2025-02-21', 'returned'),
(142, 4, 109, '2025-01-22', '2025-02-21', 'returned'),
(143, 111, 109, '2025-01-23', '2025-02-21', 'returned'),
(144, 1, 2, '2025-01-20', '2025-02-16', 'borrowed'),
(145, 4, 109, '2025-01-22', '2025-02-21', 'returned'),
(146, 111, 109, '2025-01-23', '2025-02-21', 'returned'),
(147, 1, 2, '2025-01-20', '2025-02-16', 'borrowed'),
(148, 4, 109, '2025-01-22', '2025-02-18', 'borrowed'),
(149, 111, 109, '2025-01-23', '2025-02-19', 'borrowed'),
(150, 2, 109, '2025-02-21', '2025-03-21', 'borrowed');

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
(1, 'Die Verwandlung', 'Franz Kafka', '978-3-596-90376-3', '2025-02-13 18:06:27', 'Die Verwandlung ist eine Erzählung von Franz Kafka, in der die Hauptfigur Gregor Samsa eines Morgens als riesiges Insekt aufwacht. Diese Verwandlung führt zu einem schockierenden und entfremdenden Erleben, das Gregor sowohl von seiner Familie als auch von der Gesellschaft entfremdet. Während er mit seiner neuen Existenz kämpft, verändert sich auch das Verhältnis zu seiner Familie, die ihn zunehmend ablehnt und isoliert. Das Werk thematisiert Isolation, Entfremdung und das menschliche Bedürfnis nach Anerkennung. Es bleibt ein düsteres Porträt von einem Menschen, der in einer Welt gefangen ist, die ihn nicht mehr versteht.', '../../public/bilder/buecher/Die Verwandlung.png'),
(2, 'Der Prozess', 'Franz Kafka', '978-3-596-90527-9', '2025-02-13 18:06:27', 'Der Prozess“ von Franz Kafka ist eine düstere Erzählung über Josef K., einen Mann, der ohne Erklärung von einer geheimen Behörde angeklagt wird. Während er versucht, sich gegen das undurchsichtige Justizsystem zu wehren, wird er zunehmend von der Bedeutungslosigkeit und Absurdität der Welt um ihn herum überwältigt. Die Geschichte untersucht Themen wie die Macht des Systems, Isolation und die Entfremdung des Individuums. Kafkas Stil ist geprägt von einer kafkaesken Atmosphäre, die den Leser in eine Welt aus Bürokratie und Verwirrung eintauchen lässt. Der Roman endet offen und lässt den Leser mit der Frage zurück, ob Josef K. tatsächlich ein Verbrechen begangen hat oder ob seine Verurteilung ein bloßes Produkt des Systems war.', '../../public/bilder/buecher/Der Prozess.png'),
(3, 'Faust', 'Johann Wolfgang von Goethe', '978-3-15-000001-4', '2025-02-13 18:06:27', 'Faust ist ein klassisches Drama von Johann Wolfgang von Goethe, das die Geschichte von Heinrich Faust erzählt, einem Gelehrten, der nach mehr Wissen und Erfahrung strebt. Um seine Sehnsüchte zu befriedigen, schließt er einen Pakt mit Mephistopheles, dem Teufel, der ihm irdische Freuden und Macht verspricht. Im Laufe des Stücks erkennt Faust, dass weltliche Genüsse und Macht nicht zu wahrer Erfüllung führen. Er durchlebt eine Reihe von moralischen und spirituellen Prüfungen, bis er schließlich nach Erlösung sucht. Faust thematisiert den inneren Konflikt zwischen Gut und Böse, die Suche nach Sinn und die Grenzen menschlicher Erkenntnis.', '../../public/bilder/buecher/Faust.png'),
(4, 'Effi Briest', 'Theodor Fontane', '978-3-15-000002-1', '2025-02-13 18:06:27', 'Effi Briest ist ein realistischer Roman von Theodor Fontane, der 1895 veröffentlicht wurde. Er erzählt die Geschichte von Effi Briest, einer jungen Frau, die in eine unglückliche Ehe mit einem viel älteren Mann, Baron Geert von Innstetten, gezwungen wird. Effi lebt isoliert in einer abgelegenen Gegend und hat eine Affäre mit einem anderen Mann, was später zu einer tragischen Wendung führt. Der Roman behandelt Themen wie gesellschaftliche Normen, Ehe und die Rolle der Frau im 19. Jahrhundert. Am Ende stirbt Effi nach einem Leben voller Reue und Missverständnisse.', '../../public/bilder/buecher/Effi Briest.png'),
(110, 'Der Steppenwolf', 'Hermann Hesse', '978-3-518-18800-9', '2025-02-12 15:04:13', 'Ein einsamer Intellektueller, Harry Haller, fühlt sich zerrissen zwischen seiner bürgerlichen Existenz und seinen wilden, ungezähmten Trieben. In einer geheimnisvollen Welt voller Träume und Halluzinationen entdeckt er neue Wege, seine innere Zerrissenheit zu verstehen. Begegnungen mit der mysteriösen Hermine und dem magischen Theater führen ihn auf eine Reise der Selbstfindung. Hermann Hesses Roman ist eine tiefgründige Erkundung der menschlichen Psyche und der Suche nach Identität.', '../../public/bilder/buecher/Der Steppenwolf.png'),
(111, 'Das Parfum: Die Geschichte eines Mörders', 'Patrick Süskind', '978-3-442-12522-2', '2025-02-12 15:04:39', 'von Patrick Süskind erzählt die Geschichte von Jean-Baptiste Grenouille, einem Mann mit einem außergewöhnlichen Geruchssinn. Geboren im 18. Jahrhundert in Paris, entdeckt er seine Fähigkeit, selbst die feinsten Düfte wahrzunehmen. Besessen davon, das perfekte Parfum zu kreieren, beginnt er, die Düfte junger Frauen zu sammeln – auf grausame Weise. Sein Streben nach der ultimativen Duftkomposition führt ihn schließlich zu einem erschreckenden Höhepunkt. Das Buch ist eine Mischung aus historischem Roman, Krimi und psychologischer Studie über Besessenheit und Genie.', '../../public/bilder/buecher/Das Parfum.png');

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
(2, 'Lisa', 'Schmidt', 'lisa.schmidt@example.com', 'gehashtesPasswort', '2025-02-04 11:44:57', NULL),
(97, 'Max', 'Smueller', 'max.smueller@example.com', '$2y$10$.5YHhAB77f1vq7Bxv/EWJ.mtvHWebf5YrVcUG4YdmHxpMZOeqwgsG', '2025-02-17 07:55:19', NULL),
(109, 'Abdellah', 'Tezza', 'abdellahtezza1@gmail.com', '$2y$10$8QhvKrZ7LTgkz52JHRQJtu25VXAA6WwcsHMIN0vOMCL53SakV7Fi.', '2025-02-17 08:13:22', NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT pour la table `buecher`
--
ALTER TABLE `buecher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT pour la table `schueler`
--
ALTER TABLE `schueler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

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
