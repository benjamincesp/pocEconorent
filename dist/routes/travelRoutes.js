"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TravelController_1 = require("../controllers/TravelController");
const router = (0, express_1.Router)();
const travelController = new TravelController_1.TravelController();
router.post('/validateTravel', travelController.validateTravel);
exports.default = router;
//# sourceMappingURL=travelRoutes.js.map