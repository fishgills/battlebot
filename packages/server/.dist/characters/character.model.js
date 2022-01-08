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
exports.CharacterModel = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const combat_model_1 = require("../combat/combat.model");
let CharacterModel = class CharacterModel {
};
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CharacterModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], CharacterModel.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CharacterModel.prototype, "created_at", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CharacterModel.prototype, "updated_at", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CharacterModel.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => combat_model_1.CombatModel, (combat) => combat.attacker, { lazy: true }),
    (0, graphql_1.Field)(() => [combat_model_1.CombatModel], {
        nullable: true,
    }),
    __metadata("design:type", Array)
], CharacterModel.prototype, "attacking", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => combat_model_1.CombatModel, (combat) => combat.defender, { lazy: true }),
    (0, graphql_1.Field)(() => [combat_model_1.CombatModel], {
        nullable: true,
    }),
    __metadata("design:type", Array)
], CharacterModel.prototype, "defending", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], CharacterModel.prototype, "strength", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], CharacterModel.prototype, "defense", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], CharacterModel.prototype, "vitality", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], CharacterModel.prototype, "level", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], CharacterModel.prototype, "xp", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], CharacterModel.prototype, "hp", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    (0, typeorm_1.Column)({
        default: 0,
    }),
    __metadata("design:type", Number)
], CharacterModel.prototype, "rolls", void 0);
CharacterModel = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['owner'])
], CharacterModel);
exports.CharacterModel = CharacterModel;
//# sourceMappingURL=character.model.js.map