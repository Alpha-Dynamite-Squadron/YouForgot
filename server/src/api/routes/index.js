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

router.post('/login', controllerAuthentication.login);
router.post('/register', controllerAuthentication.register);
router.post('/hashContent', controllerAuthentication.hashContent);
router.post('/preRegistration', controllerAuthentication.preRegistration);
router.post('/verifyAccessKey', controllerAuthentication.verifyAccessKey);
router.post('/createCourse', auth, generalEndpointController.createCourse);
router.post('/createAssignment', auth, generalEndpointController.createAssignment);
router.post('/enrollUser', auth, userEndpointController.userEnroll);
router.post('/getInstitutions', generalEndpointController.getInstitutions);
router.get('/getUserAssignments', auth, userEndpointController.getUserAssignments);
router.get('/getUserCourses', auth, userEndpointController.getUserCourses);
router.get('/getUserInfo', auth, userEndpointController.getUserInfo);
router.get('/getCourseInfo', auth, generalEndpointController.getCourseInfo);
router.get('/getInstitutionCourses', auth, generalEndpointController.getInstitutionCourses);
router.post('/updateIsDone', auth, userEndpointController.updateIsDone);
router.post('/updateIForgot', auth, userEndpointController.updateIForgot);
router.post('/subscribeToPost', auth, userEndpointController.updateIsIgnored); //takes in token and section instance id
router.post('/updateProfile', auth, userEndpointController.updateProfile);
router.post('/updateAssignmentGrade', auth, userEndpointController.updateAssignmentGrade);
router.post('/resetEmail', controllerAuthentication.resetPassword);
router.post('/sendResetEmail', controllerAuthentication.sendResetEmail);
router.post('/unenrollUser', auth, userEndpointController.unenroll);
router.post('/deleteAccount', auth, userEndpointController.deleteAccount);

module.exports = router;
