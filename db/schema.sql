-- MySQL schema for "my_health_planner"
-- Assumptions:
-- - Frontend generates string IDs (generateId) so users.id is VARCHAR(50).
-- - Goals contain medicines array; storing as JSON simplifies mapping from the frontend.
-- - Weekly plans are stored as JSON (days array) because DayPlan is nested.
-- - MySQL 8+ is assumed for JSON column support.
-- Replace database name if you prefer.

CREATE DATABASE IF NOT EXISTS `my_health_planner`
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
USE `my_health_planner`;

-- Users table (frontend User type)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `age` SMALLINT UNSIGNED NOT NULL,
  `weight` DECIMAL(6,2) NOT NULL, -- kg, allows decimal (e.g., 70.5)
  `height` DECIMAL(6,2) NOT NULL, -- cm
  `health_conditions` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Goals table (one row per user). medicines stored as JSON.
CREATE TABLE IF NOT EXISTS `goals` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `daily_calories` INT NOT NULL,
  `exercise_minutes` INT NOT NULL,
  `water_intake` DECIMAL(4,2) NOT NULL, -- liters (e.g., 2.5)
  `medicines` JSON DEFAULT (JSON_ARRAY()), -- array of { name, dosage, timing }
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_goals_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `ux_goals_user` ON `goals` (`user_id`);

-- Weekly plans table. days is JSON (array of DayPlan objects).
CREATE TABLE IF NOT EXISTS `weekly_plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `days` JSON NOT NULL, -- array of DayPlan
  `generated_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_plans_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE UNIQUE INDEX `ux_plans_user` ON `weekly_plans` (`user_id`);

-- Optional: sample seed (uncomment to insert one sample user + goals + plan)
-- INSERT INTO `users` (`id`, `name`, `age`, `weight`, `height`, `health_conditions`)
-- VALUES ('sampleuser1', 'Sample User', 30, 70.0, 175.0, 'None');
--
-- INSERT INTO `goals` (`user_id`, `daily_calories`, `exercise_minutes`, `water_intake`, `medicines`)
-- VALUES ('sampleuser1', 2000, 30, 2.5, JSON_ARRAY(JSON_OBJECT('name','Vitamin D','dosage','1 tab','timing','morning')));
--
-- INSERT INTO `weekly_plans` (`user_id`, `days`, `generated_at`)
-- VALUES ('sampleuser1', JSON_ARRAY(JSON_OBJECT('day','Monday','exercise','30 min walk','meals',JSON_OBJECT('breakfast','Oatmeal','lunch','Salad','dinner','Fish'),'medicines',JSON_OBJECT('morning',JSON_ARRAY(),'afternoon',JSON_ARRAY(),'evening',JSON_ARRAY(),'night',JSON_ARRAY()),'hydration',JSON_OBJECT('morning','0.9L','afternoon','1.0L','evening','0.6L'),'tips',JSON_ARRAY('Tip 1','Tip 2'))), NOW());