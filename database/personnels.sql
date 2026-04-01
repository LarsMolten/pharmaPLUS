-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 01 avr. 2026 à 07:50
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pharma_plus`
--

-- --------------------------------------------------------

--
-- Structure de la table `personnels`
--

CREATE TABLE `personnels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `foction` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personnels`
--

INSERT INTO `personnels` (`id`, `nom`, `foction`, `contact`, `created_at`, `updated_at`) VALUES
(1, 'Olina', 'generaliste\r\n', '0348232371', '2026-03-25 13:50:19', '2026-03-25 13:50:19'),
(2, 'Tahina', 'generaliste', '0', '2026-03-25 13:50:19', '2026-03-25 13:50:19'),
(3, 'Mahefa', 'generaliste', '0', '2026-03-25 13:50:19', '2026-03-25 13:50:19'),
(5, 'Julia', 'generaliste', '0', '2026-03-25 13:50:19', '2026-03-25 13:50:19'),
(6, 'Viviane', 'generaliste', '0', '2026-03-25 13:50:19', '2026-03-25 13:50:19'),
(7, 'Sylvie', 'generaliste', '0', '2026-03-25 13:50:19', '2026-03-25 13:50:19'),
(8, 'Jeremie', 'generaliste', '0', '2026-03-25 13:50:19', '2026-03-25 13:50:19'),
(9, 'Manambina', 'dentiste', '0', '2026-03-25 13:50:19', '2026-03-25 13:50:19');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `personnels`
--
ALTER TABLE `personnels`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `personnels`
--
ALTER TABLE `personnels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
