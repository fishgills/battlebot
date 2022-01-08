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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardModel = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
let RewardModel = class RewardModel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RewardModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RewardModel.prototype, "to", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RewardModel.prototype, "from", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    (0, graphql_1.Field)({ defaultValue: 1 }),
    __metadata("design:type", Number)
], RewardModel.prototype, "value", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RewardModel.prototype, "created_at", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RewardModel.prototype, "updated_at", void 0);
RewardModel = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], RewardModel);
exports.RewardModel = RewardModel;
//# sourceMappingURL=reward.model.js.map