/*
 Navicat Premium Data Transfer

 Source Server         : node-dd-signal
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 24/02/2021 21:20:26
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for watch
-- ----------------------------
DROP TABLE IF EXISTS "watch";
CREATE TABLE "watch" (
  "chatid" INTEGER NOT NULL,
  "mid" INTEGER NOT NULL
);

PRAGMA foreign_keys = true;
