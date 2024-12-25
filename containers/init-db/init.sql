-- init-db/init.sql
CREATE DATABASE IF NOT EXISTS pogos;
CREATE USER IF NOT EXISTS 'pogos'@'%' IDENTIFIED BY 'pogos';
GRANT ALL PRIVILEGES ON pogos.* TO 'pogos'@'%';
FLUSH PRIVILEGES;