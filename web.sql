-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 21. Mrz 2019 um 10:16
-- Server-Version: 10.1.37-MariaDB
-- PHP-Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `web`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `github`
--

CREATE TABLE `github` (
  `name` tinytext NOT NULL,
  `gitlink` text NOT NULL,
  `description` text NOT NULL,
  `url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `github`
--

INSERT INTO `github` (`name`, `gitlink`, `description`, `url`) VALUES
('calendar', 'https://github.com/TheCrether/calendar', 'just a calendar for me and my friends', '\n				'),
('Chatroom', 'https://github.com/TheCrether/Chatroom', 'A Chatroom that I am making with my friends', '\n				'),
('express-backend', 'https://github.com/TheCrether/express-backend', 'An RESTful API for my Web projects', '\n				'),
('memes-bot', 'https://github.com/TheCrether/memes-bot', 'Discord Bot for Memes', '\n				'),
('structograms', 'https://github.com/TheCrether/structograms', 'Angular project which draws structograms', '\n				http://thecrether.net/structograms'),
('thecrether.net', 'https://github.com/TheCrether/thecrether.net', 'My website built on Angular', '\n				http://thecrether.net');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `structograms`
--

CREATE TABLE `structograms` (
  `ID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Daten für Tabelle `structograms`
--

INSERT INTO `structograms` (`ID`, `name`, `content`) VALUES
(1, '1st', '(a)lol=2'),
(2, '1st', '(a)lol=2'),
(3, '1st', '(a)lol=2');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `structograms`
--
ALTER TABLE `structograms`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `structograms`
--
ALTER TABLE `structograms`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
