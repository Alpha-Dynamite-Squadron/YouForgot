-- MySQL Script generated by MySQL Workbench
-- Thu 19 Nov 2020 08:12:16 AM PST
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
  `username` VARCHAR(40) NULL DEFAULT NULL,
  `creationDate` DATETIME NOT NULL DEFAULT NOW(),
  `imageID` INT NULL DEFAULT NULL,
  `hash` VARCHAR(1024) NULL DEFAULT NULL,
  `salt` VARCHAR(40) NULL DEFAULT NULL,
  `accessKey` VARCHAR(1000) NULL DEFAULT NULL,
  `profileRating` FLOAT NULL DEFAULT 5.0,
  `getPostReminderNotifications` TINYINT NULL DEFAULT NULL,
  `getHomeworkReminderNotifications` TINYINT NULL DEFAULT NULL,
  `sendExcessively` TINYINT NOT NULL DEFAULT 0,
  `institutionID` INT NULL,
  PRIMARY KEY (`emailAddress`),
  CONSTRAINT `fk_User_Institution`
    FOREIGN KEY (`institutionID`)
    REFERENCES `yfdb`.`Institution` (`institutionID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE UNIQUE INDEX `username_UNIQUE` ON `yfdb`.`User` (`username` ASC);

CREATE INDEX `fk_User_Institution_idx` ON `yfdb`.`User` (`institutionID` ASC);


-- -----------------------------------------------------
-- Table `yfdb`.`SectionInstance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`SectionInstance` (
  `sectionInstanceID` INT NULL DEFAULT NULL AUTO_INCREMENT,
  `creationDate` DATETIME NOT NULL,
  `nameOfClass` VARCHAR(100) NULL DEFAULT NULL,
  `imageID` INT NOT NULL,
  `enrollmentCount` INT NULL DEFAULT 0,
  `instructorName` VARCHAR(50) NOT NULL,
  `institutionID` INT NOT NULL,
  `disciplineLetters` VARCHAR(10) NOT NULL,
  `courseNumber` INT NOT NULL,
  `sectionNumber` INT NOT NULL,
  `academicTerm` VARCHAR(12) NOT NULL,
  `academicYear` VARCHAR(8) NOT NULL,
  `sectionCreatorEmail` VARCHAR(50) NULL DEFAULT NULL,
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

CREATE INDEX `fk_SectionInstance_Institution` ON `yfdb`.`SectionInstance` (`institutionID` ASC);

CREATE INDEX `fk_SectionInstance_User` ON `yfdb`.`SectionInstance` (`sectionCreatorEmail` ASC);


-- -----------------------------------------------------
-- Table `yfdb`.`UserEnrollment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`UserEnrollment` (
  `emailAddress` VARCHAR(50) NOT NULL,
  `sectionInstanceID` INT NOT NULL,
  `getReminderNotifications` TINYINT NOT NULL DEFAULT 1,
  `defaultNotificationTimeOffset` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`emailAddress`, `sectionInstanceID`),
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

CREATE INDEX `fk_UserEnrollment_SectionInstance` ON `yfdb`.`UserEnrollment` (`sectionInstanceID` ASC);

CREATE INDEX `fk_UserEnrollment_User` ON `yfdb`.`UserEnrollment` (`emailAddress` ASC);


-- -----------------------------------------------------
-- Table `yfdb`.`Post`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`Post` (
  `assignmentID` INT NULL AUTO_INCREMENT,
  `postAuthorEmail` VARCHAR(50) NULL,
  `uploadDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `assignmentName` VARCHAR(300) NOT NULL,
  `assignmentDueDate` DATETIME NOT NULL,
  `forGrade` TINYINT NOT NULL,
  `assignmentAverage` INT NULL DEFAULT NULL,
  `iForgotCount` INT NOT NULL DEFAULT 0,
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

CREATE INDEX `fk_Post_User` ON `yfdb`.`Post` (`postAuthorEmail` ASC);

CREATE INDEX `fk_SectionInstance` ON `yfdb`.`Post` (`sectionInstance` ASC);


-- -----------------------------------------------------
-- Table `yfdb`.`PostAssociation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `yfdb`.`PostAssociation` (
  `emailAddress` VARCHAR(50) NOT NULL,
  `assignmentID` INT NOT NULL,
  `isIgnored` TINYINT NULL,
  `isReported` TINYINT NOT NULL DEFAULT 0,
  `customUploadDate` DATETIME NULL DEFAULT NULL,
  `customAssignmentName` VARCHAR(300) NULL DEFAULT NULL,
  `customAssignmentDescription` VARCHAR(1000) NULL DEFAULT NULL,
  `customDueDate` DATETIME NULL DEFAULT NULL,
  `isDone` TINYINT NOT NULL DEFAULT 0,
  `Grade` INT NULL DEFAULT NULL,
  `sentNotification` TINYINT NULL DEFAULT NULL,
  `notificationTimeOffset` DATETIME NULL DEFAULT NULL,
  `iForgot` TINYINT NOT NULL,
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

CREATE INDEX `PostNotificationIndex` ON `yfdb`.`PostAssociation` (`notificationTimeOffset` ASC);

CREATE INDEX `fk_PostAssociation_User` ON `yfdb`.`PostAssociation` (`emailAddress` ASC);

CREATE INDEX `fk_PostAssociation_Post` ON `yfdb`.`PostAssociation` (`assignmentID` ASC);

USE `yfdb`;

DELIMITER $$
USE `yfdb`$$
CREATE TRIGGER `enrollmentTrigger` AFTER INSERT ON `UserEnrollment` FOR EACH ROW
BEGIN
	UPDATE SectionInstance SET enrollmentCount = enrollmentCount + 1 WHERE sectionInstanceID = NEW.sectionInstanceID;
END;$$

USE `yfdb`$$
CREATE TRIGGER `unenrollmentTrigger` AFTER DELETE ON `UserEnrollment` FOR EACH ROW
BEGIN
	UPDATE SectionInstance SET enrollmentCount = enrollmentCount - 1 WHERE sectionInstanceID = OLD.sectionInstanceID;
END;$$

USE `yfdb`$$
CREATE TRIGGER `forgotCounterTrigger` AFTER UPDATE ON `PostAssociation` FOR EACH ROW
BEGIN
	IF NEW.iForgot <> OLD.iForgot THEN
		UPDATE Post SET iForgotCount = (SELECT SUM(iForgot) AS newTotal FROM PostAssociation WHERE assignmentID = NEW.assignmentID) WHERE assignmentID = NEW.assignmentID;
	END IF;
END;$$

USE `yfdb`$$
CREATE TRIGGER `averageGradeTrigger` AFTER UPDATE ON `PostAssociation` FOR EACH ROW
BEGIN
    IF NEW.Grade <> OLD.Grade THEN
        UPDATE Post SET assignmentAverage = (SELECT AVG(Grade) AS newAverage FROM PostAssociation WHERE assignmentID = NEW.assignmentID) WHERE assignmentID = NEW.assignmentID;
    END IF;
END$$


DELIMITER ;
CREATE USER 'server';

GRANT SELECT, INSERT, TRIGGER ON TABLE `yfdb`.* TO 'server';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `yfdb`.* TO 'server';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
