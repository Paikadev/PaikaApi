CREATE DATABASE Paika
CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

use Paika;

CREATE TABLE `Interactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `url_img` varchar(250),
  `hashtag` varchar(250) NOT NULL,
  `players_number` Int(11) NOT NULL,
  `random` int(11) NOT NULL,
  `host_user` varchar(250) NOT NULL,
  `date` varchar(250) NOT NULL,
  `total_prompts` Int(11) NOT NULL,
  `player1_points` double DEFAULT NULL,
  `player2_points` double DEFAULT NULL,
  `player3_points` double DEFAULT NULL,
  `player4_points` double DEFAULT NULL
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `MultipleOptions`
--

CREATE TABLE `MultipleOptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `idInteraction` int(11) NOT NULL,
  `turn` int(11) NOT NULL,
  `img` varchar(250) DEFAULT NULL,
  `text` varchar(250) DEFAULT NULL,
  `option_1` varchar(250) NOT NULL,
  `option_2` varchar(250) NOT NULL,
  `option_3` varchar(250) NOT NULL,
  `option_4` varchar(250) NOT NULL,
  `option_correct` varchar(250) NOT NULL,
  `time` int(11) NOT NULL
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;


CREATE TABLE `Order` (
  `idInteraction` int(11) NOT NULL,
  `turn` int(11) NOT NULL,
  `type` varchar(250) NOT NULL,
  `idPrompt` varchar(250) NOT NULL
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `Streams` (
  `name` varchar(250),
  `description` varchar(250),
  `total_viewers` int(11),
  `url_live` varchar(250),
  `url_record` varchar(250),
  `live` int(11),
  `img` varchar(250),
  `idInteraction` varchar(250),
  `idConference` varchar(250),
  `subscribeToken` varchar(250),
  `streamAccountId` varchar(250),
  "streamName" varchar(250)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TextOnly`
--

CREATE TABLE `TextOnly` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `turn` int(11) NOT NULL,
  `idInteraction` int(11) NOT NULL,
  `text` varchar(250) DEFAULT NULL,
  `img` varchar(250) DEFAULT NULL,
  `time` int(11) NOT NULL
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Votes`
--

CREATE TABLE `Votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `idInteraction` int(11) NOT NULL,
  `turn` int(11) NOT NULL,
  `player1_points` int(11) NOT NULL,
  `player2_points` int(11) NOT NULL,
  `player3_points` int(11) NOT NULL,
  `player4_points` int(11) NOT NULL,
  `img` varchar(250) DEFAULT NULL,
  `text` varchar(250) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `total` int(11) NOT NULL
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;