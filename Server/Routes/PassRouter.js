const { saveCredential, findCredential, deleteCredential, getCredential, decryptCredential } = require("../Controllers/PassController");

const router = require('express').Router();

router.post('/getCredential', getCredential);
router.post('/saveCredential', saveCredential);
router.post('/findCredential', findCredential);
router.delete('/deleteCredential', deleteCredential);
router.post('/decryptCredential', decryptCredential);

module.exports = router;