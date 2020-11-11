-- MySQL Script generated by MySQL Workbench
-- Tue 10 Nov 2020 12:12:47 PM PST
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema yfdb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `yfdb` ;

-- -----------------------------------------------------
-- Schema yfdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `yfdb` ;
USE `yfdb` ;

-- -----------------------------------------------------
-- Table `yfdb`.`Institution`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`Institution` (
  `institutionID` INT NULL DEFAULT NULL,
  `schoolName` VARCHAR(200) NOT NULL,
  `physicalAddress` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`institutionID`));


-- -----------------------------------------------------
-- Table `yfdb`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`User` (
  `emailAddress` VARCHAR(50) NOT NULL,
  `username` VARCHAR(30) NULL DEFAULT NULL,
  `creationDate` TIMESTAMP NOT NULL DEFAULT NOW(),
  `imageID` INT NULL DEFAULT NULL,
  `hash` VARCHAR(1024) NULL DEFAULT NULL,
  `salt` VARCHAR(40) NULL DEFAULT NULL,
  `accessKey` VARCHAR(1000) NULL DEFAULT NULL,
  `profileRating` INT NULL DEFAULT NULL,
  `getPostReminderNotifications` TINYINT NULL DEFAULT NULL,
  `getHomeworkReminderNotifications` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`emailAddress`));

CREATE UNIQUE INDEX `username_UNIQUE` ON `yfdb`.`User` (`username` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `yfdb`.`SectionInstance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`SectionInstance` (
  `sectionInstanceID` INT NULL DEFAULT NULL AUTO_INCREMENT,
  `creationDate` TIMESTAMP NOT NULL,
  `nameOfClass` VARCHAR(100) NULL DEFAULT NULL,
  `imageID` INT NOT NULL,
  `enrollmentCount` INT NULL DEFAULT 1,
  `instructorName` VARCHAR(50) NOT NULL,
  `institutionID` INT NOT NULL,
  `disciplineLetters` VARCHAR(10) NOT NULL,
  `courseNumber` INT NOT NULL,
  `sectionNumber` INT NOT NULL,
  `academicSession` VARCHAR(12) NOT NULL,
  `sectionCreatorEmail` VARCHAR(50) NULL DEFAULT NULL,
  `isArchived` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`sectionInstanceID`),
  CONSTRAINT `fk_SectionInstance_Institution`
    FOREIGN KEY (`institutionID`)
    REFERENCES `yfdb`.`Institution` (`institutionID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_SectionInstance_User`
    FOREIGN KEY (`sectionCreatorEmail`)
    REFERENCES `yfdb`.`User` (`emailAddress`)
    ON DELETE SET NULL
    ON UPDATE CASCADE);

CREATE INDEX `fk_SectionInstance_Institution` ON `yfdb`.`SectionInstance` (`institutionID` ASC) VISIBLE;

CREATE INDEX `fk_SectionInstance_User` ON `yfdb`.`SectionInstance` (`sectionCreatorEmail` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `yfdb`.`UserEnrollment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`UserEnrollment` (
  `emailAddress` VARCHAR(50) NOT NULL,
  `sectionInstanceID` INT NOT NULL,
  `defaultGetReminderNotifications` TINYINT NULL DEFAULT NULL,
  `defaultNotificationTimeOffset` DATETIME NULL DEFAULT NULL,
  CONSTRAINT `fk_UserEnrollment_User`
    FOREIGN KEY (`emailAddress`)
    REFERENCES `yfdb`.`User` (`emailAddress`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_UserEnrollment_SectionInstance`
    FOREIGN KEY (`sectionInstanceID`)
    REFERENCES `yfdb`.`SectionInstance` (`sectionInstanceID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE INDEX `fk_UserEnrollment_SectionInstance` ON `yfdb`.`UserEnrollment` (`sectionInstanceID` ASC) VISIBLE;

CREATE INDEX `fk_UserEnrollment_User` ON `yfdb`.`UserEnrollment` (`emailAddress` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `yfdb`.`Post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`Post` (
  `assignmentID` INT NULL AUTO_INCREMENT,
  `postAuthorEmail` VARCHAR(50) NULL,
  `uploadDate` TIMESTAMP NULL,
  `assignmentName` VARCHAR(300) NOT NULL,
  `assignmentDueDate` TIMESTAMP NOT NULL,
  `forGrade` TINYINT NOT NULL,
  `assignmentAverage` INT NULL DEFAULT NULL,
  `upvoteCount` INT NULL DEFAULT NULL,
  `sectionInstance` INT NOT NULL,
  PRIMARY KEY (`assignmentID`),
  CONSTRAINT `fk_Post_User`
    FOREIGN KEY (`postAuthorEmail`)
    REFERENCES `yfdb`.`User` (`emailAddress`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Post_SectionInstance`
    FOREIGN KEY (`sectionInstance`)
    REFERENCES `yfdb`.`SectionInstance` (`sectionInstanceID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE INDEX `fk_Post_User` ON `yfdb`.`Post` (`postAuthorEmail` ASC) VISIBLE;

CREATE INDEX `fk_SectionInstance` ON `yfdb`.`Post` (`sectionInstance` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `yfdb`.`PostAssociation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`PostAssociation` (
  `emailAddress` VARCHAR(50) NOT NULL,
  `assignmentID` INT NOT NULL,
  `isIgnored` TINYINT NOT NULL,
  `isReported` TINYINT NOT NULL,
  `customUploadDate` TIMESTAMP NULL DEFAULT NULL,
  `customAssignmentName` VARCHAR(300) NULL DEFAULT NULL,
  `customAssignmentDescription` VARCHAR(1000) NULL DEFAULT NULL,
  `customDueDate` TIMESTAMP NULL DEFAULT NULL,
  `Grade` INT NULL DEFAULT NULL,
  `sentNotification` TINYINT NULL DEFAULT NULL,
  `notificationTimeOffset` DATETIME NULL DEFAULT NULL,
  `upvote` TINYINT NOT NULL,
  PRIMARY KEY (`emailAddress`, `assignmentID`),
  CONSTRAINT `fk_PostAssociation_User`
    FOREIGN KEY (`emailAddress`)
    REFERENCES `yfdb`.`User` (`emailAddress`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_PostAssociation_Post`
    FOREIGN KEY (`assignmentID`)
    REFERENCES `yfdb`.`Post` (`assignmentID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE INDEX `PostNotificationIndex` ON `yfdb`.`PostAssociation` (`notificationTimeOffset` ASC) VISIBLE;

CREATE INDEX `fk_PostAssociation_User` ON `yfdb`.`PostAssociation` (`emailAddress` ASC) VISIBLE;

CREATE INDEX `fk_PostAssociation_Post` ON `yfdb`.`PostAssociation` (`assignmentID` ASC) VISIBLE;

CREATE USER 'server';

GRANT SELECT, INSERT, TRIGGER ON TABLE `yfdb`.* TO 'server';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `yfdb`.* TO 'server';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
