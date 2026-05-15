const express = require('express');
const router = express.Router();

const Controler = require('../Controler/Controler')
const LibertyController = require('../Controler/Libertycontroller')
const MedController = require('../Controler/MedController');
const ManualPull = require('../Controler/ManuallPull') ;
const MedSnapController = require('../Controler/MedSnapController')
const TimeSlots = require('../Controler/TimeSlots');
const UserManagements = require('../Controler/UserManagements')
const rxq_patients = require('../Controler/RxqPatients')
const authenticateToken = require('../Middleware/authMiddleware');



// router.use((request,response,next)=>{
//     console.log('middleware');
//     next();
//   })

// router.use(authenticateToken);

router.post('/logins', Controler.Login)

router.get('/dbget',authenticateToken, Controler.dbgetdata)

router.get('/cldrget', authenticateToken,Controler.cldrgetdata)

router.put('/manual',Controler.createdata)

router.put ('/datemanual',Controler.createdatadate)

router.get('/libget/:PatientIdentifier', authenticateToken,LibertyController.Libertyget)

router.get('/libgetall/:PatientIdentifier', authenticateToken, LibertyController.LibertygetAll)

router.post('/libexport',LibertyController.LibertyExport)

router.get('/mediget/:PatientIdentifier', authenticateToken,MedController.medlistget)

router.post('/mediadd',MedController.medlistadd)

router.put('/mediadd',MedController.medlistupdate)

router.delete('/medidel',MedController.medlistdelete)

router.get('/Notes/:PatientIdentifier', authenticateToken, Controler.Notegetdata)

router.get('/medidelete/:PatientIdentifier', authenticateToken,MedController.fetchDeletedHistory)

router.get('/manuallpull', authenticateToken,ManualPull.Manuallpulldata)

router.post('/pulldata', ManualPull.pulldata);

router.get('/medsnap/:PatientIdentifier', authenticateToken,MedSnapController.medsnapget)


router.get('/medispack/:PatientIdentifier', authenticateToken,MedSnapController.medispackget)

router.get('/getview/:PatientIdentifier', authenticateToken,MedSnapController.viewgetdata)

router.get('/review_sp/:PatientIdentifier', authenticateToken,MedSnapController.SP_review)

router.put('/notepindata',Controler.notepinupdate)

router.put('/reviewdata',MedController.reviewdata)

// router.get('/patient_review/:PatientIdentifier',MedController.patient_review)

router.put('/packdata',MedController.packdata)

router.get('/latestpin/:PatientIdentifier', authenticateToken, MedSnapController.latestpinget)

router.get('/notesget/:PatientIdentifier', authenticateToken, MedSnapController.notesget)

router.put('/notesupdate',MedSnapController.notesupdated)

router.put('/changepwd',Controler.ChangePassword)

router.get('/timeheadslot/:PatientIdentifier', TimeSlots.timeheadslot)

router.get('/timequantityslot/:PatientIdentifier', TimeSlots.timequantityslot)

router.post('/spheaderslot', TimeSlots.sp_headerslot)

router.post('/spquantityslot', TimeSlots.sp_quantityslot)

router.get('/adduser',authenticateToken, UserManagements.getadduser)

router.post('/adduserinfo', UserManagements.adduserinfo)

router.put('/modifyuser', UserManagements.Modifyuserinfo)

router.delete('/adduserdel', UserManagements.adduserdelete)

router.put('/resetpwd', UserManagements.resetpwd)

router.get('/patientinfo', UserManagements.SP_patientinfo)

router.post('/rxqdetails', rxq_patients.rxqPatients)

router.post('/csvfile', ManualPull.CsvpdfFile)

router.get('/druglist', MedController.Drug_List)

router.get('/provlist', MedController.Prov_List)

router.get('/filesrft', ManualPull.rftfiles)

router.get('/rftget', ManualPull.rftgetdata)

module.exports = router;