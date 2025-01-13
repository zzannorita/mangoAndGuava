const express = require("express");
const router = express.Router();
const alarmContoller = require("../controllers/alarmController");

router.get("/alarm", alarmContoller.getAlarmData);

module.exports = router;
