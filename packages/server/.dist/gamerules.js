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
exports.CombatLog = exports.CombatLogInitObj = exports.CombatRound = exports.WhoGoesFirst = exports.getHitPoints = exports.modifier = void 0;
const rpg_dice_roller_1 = require("@dice-roller/rpg-dice-roller");
const graphql_1 = require("@nestjs/graphql");
const character_model_1 = require("./characters/character.model");
const modifier = (value) => {
    return Math.floor((value - 10) / 2);
};
exports.modifier = modifier;
const getHitPoints = (char) => {
    const roll = new rpg_dice_roller_1.DiceRoll('1d10');
    return roll.total + (0, exports.modifier)(char.vitality);
};
exports.getHitPoints = getHitPoints;
let WhoGoesFirst = class WhoGoesFirst {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], WhoGoesFirst.prototype, "roll", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], WhoGoesFirst.prototype, "modifier", void 0);
WhoGoesFirst = __decorate([
    (0, graphql_1.ObjectType)()
], WhoGoesFirst);
exports.WhoGoesFirst = WhoGoesFirst;
let CombatRound = class CombatRound {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", character_model_1.CharacterModel)
], CombatRound.prototype, "attacker", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", character_model_1.CharacterModel)
], CombatRound.prototype, "defender", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CombatRound.prototype, "hit", void 0);
__decorate([
    (0, graphql_1.Field)({
        nullable: true,
    }),
    __metadata("design:type", Number)
], CombatRound.prototype, "damage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CombatRound.prototype, "attackRoll", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CombatRound.prototype, "attackBonus", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CombatRound.prototype, "defenderDefense", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], CombatRound.prototype, "defenderHealth", void 0);
CombatRound = __decorate([
    (0, graphql_1.ObjectType)()
], CombatRound);
exports.CombatRound = CombatRound;
let CombatLogInitObj = class CombatLogInitObj {
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", WhoGoesFirst)
], CombatLogInitObj.prototype, "attacker", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", WhoGoesFirst)
], CombatLogInitObj.prototype, "defender", void 0);
CombatLogInitObj = __decorate([
    (0, graphql_1.ObjectType)()
], CombatLogInitObj);
exports.CombatLogInitObj = CombatLogInitObj;
let CombatLog = class CombatLog {
};
__decorate([
    (0, graphql_1.Field)(() => [CombatRound]),
    __metadata("design:type", Array)
], CombatLog.prototype, "combat", void 0);
CombatLog = __decorate([
    (0, graphql_1.ObjectType)()
], CombatLog);
exports.CombatLog = CombatLog;
//# sourceMappingURL=gamerules.js.map