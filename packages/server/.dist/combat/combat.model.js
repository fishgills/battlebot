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
exports.CombatModel = void 0;
const graphql_1 = require("@nestjs/graphql");
const gamerules_1 = require("../gamerules");
const typeorm_1 = require("typeorm");
const character_model_1 = require("../characters/character.model");
let CombatModel = class CombatModel {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CombatModel.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)((type) => character_model_1.CharacterModel, { nullable: true }),
    (0, typeorm_1.ManyToOne)((type) => character_model_1.CharacterModel, (character) => character.attacking),
    (0, typeorm_1.JoinColumn)({ name: 'attacker_id' }),
    __metadata("design:type", character_model_1.CharacterModel)
], CombatModel.prototype, "attacker", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'attacker_id' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CombatModel.prototype, "attackerId", void 0);
__decorate([
    (0, graphql_1.Field)((type) => character_model_1.CharacterModel, { nullable: true }),
    (0, typeorm_1.ManyToOne)((type) => character_model_1.CharacterModel, (character) => character.defending),
    (0, typeorm_1.JoinColumn)({ name: 'defender_id' }),
    __metadata("design:type", character_model_1.CharacterModel)
], CombatModel.prototype, "defender", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: 'uuid', name: 'defender_id' }),
    __metadata("design:type", String)
], CombatModel.prototype, "defenderId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: 'json',
        nullable: true,
    }),
    __metadata("design:type", gamerules_1.CombatLog)
], CombatModel.prototype, "log", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CombatModel.prototype, "created_at", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CombatModel.prototype, "updated_at", void 0);
CombatModel = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], CombatModel);
exports.CombatModel = CombatModel;
//# sourceMappingURL=combat.model.js.map