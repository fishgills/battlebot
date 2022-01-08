"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const reward_create_1 = require("./dto/reward.create");
const reward_model_1 = require("./reward.model");
const reward_service_1 = require("./reward.service");
let RewardResolver = class RewardResolver {
    constructor(service) {
        this.service = service;
    }
    rewards() {
        return this.service.find();
    }
    giveReward(input) {
        return this.service.give(input.to, input.from);
    }
    rewardsGivenToday(user) {
        return this.service.findFromToday(user);
    }
    getUserScore(userId, isListType) {
        return this.service.getUserScore(userId, isListType);
    }
};
__decorate([
    (0, graphql_1.Query)((returns) => [reward_model_1.RewardModel]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RewardResolver.prototype, "rewards", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reward_create_1.CreateRewardInput]),
    __metadata("design:returntype", void 0)
], RewardResolver.prototype, "giveReward", null);
__decorate([
    (0, graphql_1.Query)((returns) => graphql_1.Int),
    __param(0, (0, graphql_1.Args)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RewardResolver.prototype, "rewardsGivenToday", null);
__decorate([
    (0, graphql_1.Query)((returns) => [reward_model_1.RewardModel]),
    __param(0, (0, graphql_1.Args)('userId')),
    __param(1, (0, graphql_1.Args)('listType', {
        defaultValue: 'from',
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RewardResolver.prototype, "getUserScore", null);
RewardResolver = __decorate([
    (0, graphql_1.Resolver)((of) => reward_model_1.RewardModel),
    __param(0, (0, common_1.Inject)(reward_service_1.RewardService)),
    __metadata("design:paramtypes", [reward_service_1.RewardService])
], RewardResolver);
exports.RewardResolver = RewardResolver;
//# sourceMappingURL=reward.resolver.js.map