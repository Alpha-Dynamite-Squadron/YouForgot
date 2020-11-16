var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');


var secretString = process.env.LOGIN_SECRET;
if(secretString == undefined) {
  console.log("User Login Secret Undefined in enviroment `LOGIN_SECRET`");
  process.exit(1);
}

var auth = jwt({
  secret: secretString,
  userProperty: 'payload',
  algorithms: ['HS256']
});

var controllerAuthentication = require('../controllers/authentication.js');
var userEndpointController = require('../controllers/userEndpointController');
var generalEndpointController = require('../controllers/generalEndpointController')
//router.post('/preregister', controllerAuthentication.preregister);
router.post('/login', controllerAuthentication.login);
router.post('/register', controllerAuthentication.register);
router.post('/hashContent', controllerAuthentication.hashContent);
router.post('/preRegistration', controllerAuthentication.preRegistration);
router.post('/verifyAccessKey', controllerAuthentication.verifyAccessKey);
router.post('/createCourse', auth, generalEndpointController.createCourse);
router.post('/createAssignment', auth, generalEndpointController.createAssignment);

router.get('/getUserAssignments', auth, userEndpointController.getUserAssignments);
router.get('/getCourseInfo', auth, generalEndpointController.getCourseInfo);
router.get('/getInstitutionCourses', auth, generalEndpointController.getInstitutionCourses);
router.get('/getCourseInfo', auth, generalEndpointController.getCourseInfo);

router.patch('/updateIsDone', auth, userEndpointController.updateIsDone);
router.patch('/updateExcessiveNotifications', auth, userEndpointController.updateExcessiveNotifications);
router.patch('/updateAssignmentNotifications', auth, userEndpointController.updateAssignmentNotifications);
router.patch('/updateAssignmentNotifications', auth, userEndpointController.updateAssignmentNotifications);
router.patch('/updateAssignmentDeadlineNotifications', auth, userEndpointController.updateAssignmentDeadlineNotifications);
router.patch('/updateAssignmentGrade', auth, userEndpointController.updateAssignmentGrade);


module.exports = router;
