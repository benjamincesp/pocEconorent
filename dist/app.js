"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const travelRoutes_1 = __importDefault(require("./routes/travelRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/travel', travelRoutes_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'EconoRent POC Microservice',
        version: '1.0.0',
        endpoints: {
            validateTravel: 'POST /api/travel/validateTravel'
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map