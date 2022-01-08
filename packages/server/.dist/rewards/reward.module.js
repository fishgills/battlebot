"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reward_model_1 = require("./reward.model");
const reward_resolver_1 = require("./reward.resolver");
const reward_service_1 = require("./reward.service");
let RewardModule = class RewardModule {
};
RewardModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reward_model_1.RewardModel])],
        providers: [reward_service_1.RewardService, reward_resolver_1.RewardResolver],
        exports: [reward_service_1.RewardService],
    })
], RewardModule);
exports.RewardModule = RewardModule;
//# sourceMappingURL=reward.module.js.map