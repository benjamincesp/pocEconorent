"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelController = void 0;
const TravelService_1 = require("../services/TravelService");
class TravelController {
    constructor() {
        this.validateTravel = async (req, res) => {
            try {
                console.log('llego');
                const validationRequest = req.body;
                if (!validationRequest) {
                    res.status(400).json({
                        error: 'Request body is required'
                    });
                    return;
                }
                const result = await this.travelService.validateTravel(validationRequest);
                if (result.isValid) {
                    res.status(200).json(result);
                }
                else {
                    res.status(400).json(result);
                }
            }
            catch (error) {
                console.error('Error in validateTravel controller:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    message: 'An unexpected error occurred while validating the travel'
                });
            }
        };
        this.travelService = new TravelService_1.TravelService();
    }
}
exports.TravelController = TravelController;
//# sourceMappingURL=TravelController.js.map