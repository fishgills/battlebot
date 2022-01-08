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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatResolver = void 0;
const rpg_dice_roller_1 = require("@dice-roller/rpg-dice-roller");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const date_fns_1 = require("date-fns");
const character_service_1 = require("../characters/character.service");
const gamerules_1 = require("../gamerules");
const typeorm_1 = require("typeorm");
const combat_model_1 = require("./combat.model");
const combat_service_1 = require("./combat.service");
const create_combat_input_1 = require("./dto/create-combat.input");
let CombatResolver = class CombatResolver {
    constructor(combatService, charService) {
        this.combatService = combatService;
        this.charService = charService;
    }
    combats() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.combatService.findAll();
        });
    }
    createCombat(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.combatService.create(input);
        });
    }
    start(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const combatCount = yield this.combatService.findAll({
                where: [
                    {
                        attackerId: input.attackerId,
                        created_at: (0, typeorm_1.MoreThan)((0, date_fns_1.subMinutes)(new Date(), 1).toISOString()),
                    },
                    {
                        defenderId: input.attackerId,
                        created_at: (0, typeorm_1.MoreThan)((0, date_fns_1.subMinutes)(new Date(), 1).toISOString()),
                    },
                ],
            });
            if (combatCount.length > 0) {
                throw new Error(`Combat started too fast`);
            }
            let combat = yield this.combatService.create(input);
            combat = yield this.combatService.findOne(combat.id, {
                relations: ['attacker', 'defender'],
            });
            const log = new gamerules_1.CombatLog();
            const participants = [combat.attacker, combat.defender];
            participants.sort((a, b) => {
                const aRoll = new rpg_dice_roller_1.DiceRoll('d20');
                const bRoll = new rpg_dice_roller_1.DiceRoll('d20');
                const aTotal = aRoll.total + (0, gamerules_1.modifier)(a.defense);
                const bTotal = bRoll.total + (0, gamerules_1.modifier)(b.defense);
                console.log(`Who's first Rolls: A(${a.name}): ${aRoll.total} + ${(0, gamerules_1.modifier)(a.defense)} = ${aTotal}. B(${b.name}): ${bRoll.total} + ${(0, gamerules_1.modifier)(b.defense)} = ${bTotal}`);
                return bTotal - aTotal;
            });
            let max = 20;
            while (max > 0) {
                max--;
                console.log(`Combat Rounds Left: ${max}`);
                console.log(participants.map((c) => `${c.name}:${c.hp}`).join(' - '));
                if (participants.filter((c) => c.hp > 0).length !== 2) {
                    console.log(`Combat end due to defeat of character.`);
                    break;
                }
                this.battleRound(participants, log);
            }
            yield this.combatService.updateLog(combat.id, log);
            return log;
        });
    }
    battleRound(participants, log) {
        this.attack(participants[0], participants[1], log);
        if (participants[1].hp <= 0) {
            return;
        }
        this.attack(participants[1], participants[0], log);
    }
    attack(attacker, defender, log) {
        const attackRoll = new rpg_dice_roller_1.DiceRoll('d20').total;
        const attackModifier = (0, gamerules_1.modifier)(attacker.strength);
        const defenderDefense = 10 + (0, gamerules_1.modifier)(defender.defense);
        console.log(`${attacker.name} Rolled ${attackRoll} with modifer of ${attackModifier} is attacking ${defender.name} with an AC of ${10 + (0, gamerules_1.modifier)(defender.defense)}`);
        let roundLog;
        if ((attackRoll > 1 && attackRoll + attackModifier > defenderDefense) ||
            attackRoll === 20) {
            console.log('hit!');
            let roll = '1d6';
            if (attackRoll == 20) {
                roll = '2d6';
            }
            const damage = Math.max(new rpg_dice_roller_1.DiceRoll(roll).total + attackModifier, 0);
            console.log(damage, ' damage done.');
            defender.hp = defender.hp - damage;
            roundLog = {
                attackRoll,
                attackBonus: attackModifier,
                attacker,
                defender,
                defenderDefense: defenderDefense,
                hit: true,
                defenderHealth: defender.hp,
                damage,
            };
        }
        else {
            console.log('miss');
            roundLog = {
                attackBonus: attackModifier,
                attackRoll,
                attacker,
                defender,
                defenderDefense: defenderDefense,
                defenderHealth: defender.hp,
                hit: false,
            };
        }
        if (!log.combat) {
            log.combat = [];
        }
        log.combat.push(roundLog);
    }
};
__decorate([
    (0, graphql_1.Query)((returns) => [combat_model_1.CombatModel]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CombatResolver.prototype, "combats", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => combat_model_1.CombatModel),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_combat_input_1.CreateCombatInput]),
    __metadata("design:returntype", Promise)
], CombatResolver.prototype, "createCombat", null);
__decorate([
    (0, graphql_1.Mutation)(() => gamerules_1.CombatLog),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_combat_input_1.CreateCombatInput]),
    __metadata("design:returntype", Promise)
], CombatResolver.prototype, "start", null);
CombatResolver = __decorate([
    (0, graphql_1.Resolver)((of) => combat_model_1.CombatModel),
    __param(0, (0, common_1.Inject)(combat_service_1.CombatService)),
    __param(1, (0, common_1.Inject)(character_service_1.CharacterService)),
    __metadata("design:paramtypes", [combat_service_1.CombatService,
        character_service_1.CharacterService])
], CombatResolver);
exports.CombatResolver = CombatResolver;
//# sourceMappingURL=combat.resolver.js.map