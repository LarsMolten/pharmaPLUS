-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 28 juin 2024 à 19:00
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `assurance`
--

-- --------------------------------------------------------

--
-- Structure de la table `cabinet`
--

DROP TABLE IF EXISTS `cabinet`;
CREATE TABLE IF NOT EXISTS `cabinet` (
  `id_cabinet` int NOT NULL AUTO_INCREMENT,
  `nom_cabinet` varchar(255) NOT NULL,
  `etat` int NOT NULL DEFAULT '1' COMMENT '1 : actif , 2 : inactif',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_cabinet`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `cabinet`
--

INSERT INTO `cabinet` (`id_cabinet`, `nom_cabinet`, `etat`, `created_at`, `updated_at`) VALUES
(1, 'Salle 088', 1, '2024-05-03 17:29:40', '2024-05-03 18:06:18'),
(2, 'jujuj', 1, NULL, NULL),
(3, 'Salle 02', 1, '2024-05-03 17:29:52', '2024-05-03 18:06:13');

-- --------------------------------------------------------

--
-- Structure de la table `consultation`
--

DROP TABLE IF EXISTS `consultation`;
CREATE TABLE IF NOT EXISTS `consultation` (
  `id_consultation` int NOT NULL AUTO_INCREMENT,
  `numero_patient` varchar(20) NOT NULL,
  `id_medecin` int NOT NULL,
  `motif` text NOT NULL,
  `etat` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `date_consultation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_consultation`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `consultation`
--

INSERT INTO `consultation` (`id_consultation`, `numero_patient`, `id_medecin`, `motif`, `etat`, `created_at`, `updated_at`, `date_consultation`) VALUES
(1, 'E0001', 1, 'dffdfdf', 1, '2024-05-04 21:36:09', '2024-05-04 21:36:09', '2024-05-05 00:36:09'),
(2, 'E0001', 8, 'fdffdfd', 1, '2024-05-04 21:36:17', '2024-06-07 11:11:40', '2024-05-05 00:36:17'),
(3, 'E0001', 1, 'fdfdfd', 1, '2024-05-04 21:36:23', '2024-05-04 21:36:23', '2024-05-05 00:36:23'),
(4, 'E0001', 1, 'fdfdsfsdfsd', 1, '2024-05-07 09:54:03', '2024-05-07 09:54:03', '2024-05-07 12:54:03');

-- --------------------------------------------------------

--
-- Structure de la table `medecin`
--

DROP TABLE IF EXISTS `medecin`;
CREATE TABLE IF NOT EXISTS `medecin` (
  `id_medecin` int NOT NULL AUTO_INCREMENT,
  `nom_medecin` varchar(255) NOT NULL,
  `id_specialite` int NOT NULL,
  `id_cabinet` int NOT NULL,
  `etat` int NOT NULL DEFAULT '1' COMMENT '1 : actif \r\n0: inactif',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_medecin`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `medecin`
--

INSERT INTO `medecin` (`id_medecin`, `nom_medecin`, `id_specialite`, `id_cabinet`, `etat`, `created_at`, `updated_at`) VALUES
(7, '121212', 6, 1, 1, '2024-05-03 20:23:04', '2024-05-03 20:23:24'),
(1, 'Nico radoko', 8, 1, 1, '2024-05-03 20:14:06', '2024-05-04 21:31:56'),
(2, 'Nico radoko', 6, 1, 1, '2024-05-03 20:14:14', '2024-05-07 00:00:00'),
(8, 'fdfdf', 8, 1, 1, '2024-05-03 20:23:16', '2024-05-03 20:23:16'),
(9, 'Nico radoko', 5, 1, 1, '2024-05-04 21:31:53', '2024-05-04 21:31:53');

-- --------------------------------------------------------

--
-- Structure de la table `membre`
--

DROP TABLE IF EXISTS `membre`;
CREATE TABLE IF NOT EXISTS `membre` (
  `id_membre` int NOT NULL AUTO_INCREMENT,
  `nom_membre` varchar(255) NOT NULL,
  `contact_membre` varchar(20) NOT NULL,
  `email_membre` varchar(100) NOT NULL,
  `description` text,
  `ispaye` tinyint(1) NOT NULL DEFAULT '1',
  `motifBloque` text,
  `etat` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_membre`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `membre`
--

INSERT INTO `membre` (`id_membre`, `nom_membre`, `contact_membre`, `email_membre`, `description`, `ispaye`, `motifBloque`, `etat`, `created_at`, `updated_at`) VALUES
(1, 'KUBO MADAGASCAR', '0344681572', 'nicotahindraza310501@gmail.com', 'gfgfgf', 1, NULL, 1, '2024-05-03 21:56:57', '2024-05-03 21:56:57'),
(2, 'NOVA', '0344681572', 'ARLETO SOCIETY', 'gfgf', 0, 'tsy nahavoaloa trosa', 1, '2024-05-03 21:59:47', '2024-05-04 16:34:44'),
(4, 'SCORE MADAGASCAR', 'fdsfdsfds', 'fdfdfds', NULL, 1, NULL, 1, '2024-05-03 21:59:54', '2024-05-04 16:34:55'),
(5, 'LEADER PRICE', 'fdsfds', 'fdsfds', NULL, 0, 'societé fa rava', 1, '2024-05-03 21:59:58', '2024-05-04 16:35:03'),
(6, 'fdfd', 'fdfd', 'fdfd', NULL, 1, NULL, 1, '2024-05-03 22:02:50', '2024-05-03 22:05:27'),
(7, 'nikoooo', '121212', 'hgffhfgh545', 'gfgfg', 0, 'tsy nahavoaloa trosa', 1, '2024-05-03 22:03:01', '2024-05-03 22:04:12'),
(8, 'hghgggffgfgf', 'hghg', 'hghg', NULL, 1, NULL, 0, '2024-05-03 22:03:13', '2024-06-28 18:18:12'),
(9, 'SUPPREME CENTER', 'gfgfg', 'gfgf', NULL, 0, 'tsy nandoa trosa 3mois', 0, '2024-05-03 22:05:21', '2024-06-28 18:18:08'),
(10, 'gfggfgfg', 'gfgfghhhhh', '', NULL, 1, NULL, 0, '2024-05-03 22:05:32', '2024-06-28 18:17:59'),
(11, 'nicotahindraza310501@gmail.com', '0344681572', 'trtr', NULL, 1, NULL, 0, '2024-05-04 21:32:09', '2024-06-28 18:18:03'),
(12, 'essai ', '031452555', 'nicotahindraza310501@gmail.com', 'nico121d212sd', 0, NULL, 0, '2024-06-28 18:18:28', '2024-06-28 18:26:54'),
(13, 'fdfdfd', 'fdfdfd', 'fdfdfd', 'nao leroa', 0, 'fdf', 1, '2024-06-28 18:27:00', '2024-06-28 18:57:27');

-- --------------------------------------------------------

--
-- Structure de la table `patient`
--

DROP TABLE IF EXISTS `patient`;
CREATE TABLE IF NOT EXISTS `patient` (
  `id_patient` int NOT NULL AUTO_INCREMENT,
  `numero_patient` varchar(20) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `sexe` varchar(5) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `service` varchar(100) NOT NULL,
  `etat` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `id_membre` int NOT NULL,
  PRIMARY KEY (`id_patient`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `patient`
--

INSERT INTO `patient` (`id_patient`, `numero_patient`, `nom`, `prenom`, `adresse`, `sexe`, `telephone`, `email`, `service`, `etat`, `created_at`, `updated_at`, `id_membre`) VALUES
(6, 'E0002', 'Aio', 'Aia', 'Tsimenatse II', '', '0349867852', 'joyce@gmail.com', 'Service Inforamtique', 'Non Assure', '2024-05-04 17:15:49', '2024-05-04 17:15:49', 1),
(5, 'E0001', 'Joels', 'Solofos', 'Tsimenatse', '', '0348975640', 'zahoavao@gmail.com', 'Service Inforamtique', 'Assure', '2024-05-04 17:15:49', '2024-05-04 17:15:49', 1);

-- --------------------------------------------------------

--
-- Structure de la table `specialite`
--

DROP TABLE IF EXISTS `specialite`;
CREATE TABLE IF NOT EXISTS `specialite` (
  `id_specialite` int NOT NULL AUTO_INCREMENT,
  `nom_specialite` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `etat` int NOT NULL DEFAULT '1' COMMENT '1 : actif\r\n0 : inactif',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_specialite`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `specialite`
--

INSERT INTO `specialite` (`id_specialite`, `nom_specialite`, `etat`, `created_at`, `updated_at`) VALUES
(5, 'nico', 1, '2024-05-03 19:28:37', '2024-05-03 19:28:37'),
(3, 'alefa leroa bro', 1, '2024-05-03 19:27:15', '2024-05-03 19:28:46'),
(8, 'fdfdfd', 1, '2024-05-03 19:29:30', '2024-05-03 20:42:10'),
(6, 'kokokoko', 1, '2024-05-03 19:29:09', '2024-05-03 19:29:09'),
(9, 'lklklklk', 1, '2024-06-07 10:55:06', '2024-06-07 10:55:06');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `nom_user` varchar(255) DEFAULT NULL,
  `prenom_user` varchar(255) DEFAULT NULL,
  `mdp_user` varchar(255) NOT NULL,
  `role_user` varchar(11) NOT NULL,
  `etat` int NOT NULL DEFAULT '1' COMMENT '1:active ; 0:inactive',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `image` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id_user`, `nom_user`, `prenom_user`, `mdp_user`, `role_user`, `etat`, `created_at`, `updated_at`, `image`) VALUES
(1, 'R.', 'GEROC', 'milliard2024', 'admin', 1, NULL, NULL, '20240122134129_G-brico'),
(2, 'Tahindraza', 'molten', 'nico1234', 'simple', 0, NULL, NULL, '20240122151400_Tahindraza'),
(3, 'nico', 'nico', 'nico', 'simple', 0, NULL, NULL, 'icon.jpg'),
(4, 'A.', 'HASINA', '1321', 'admin', 1, NULL, NULL, 'icon.jpg'),
(5, 'R.', 'RONALD', '25864', 'simple', 1, NULL, NULL, 'icon.jpg'),
(6, ' ', 'DOLLIN', '200317', 'simple', 1, NULL, NULL, 'icon.jpg');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
