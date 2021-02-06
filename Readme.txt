Для корректной работы надо создать базу данных с таблицей tasks.

-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
-- Хост: 127.0.0.1:3306
-- Время создания: Фев 06 2021 г., 20:42
-- Версия сервера: 8.0.19
-- Версия PHP: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `tasks` (
  `id` int NOT NULL,
  `description` text NOT NULL,
  `taskdate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `success` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
(Скопировал дамп из PhpAdmin)

Конфигурацию подключения к базе данных прописать в файле config.php.

PS. Api не писал отдельно, просто создал класс в проекте, но принцип работы, как у Api.