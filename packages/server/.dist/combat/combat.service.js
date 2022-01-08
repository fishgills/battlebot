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
exports.CombatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const character_model_1 = require("../characters/character.model");
const combat_model_1 = require("./combat.model");
let CombatService = class CombatService {
    constructor(combatRepo, charRepo) {
        this.combatRepo = combatRepo;
        this.charRepo = charRepo;
    }
    findAll(options) {
        return this.combatRepo.find(options);
    }
    findOne(id, options) {
        return this.combatRepo.findOneOrFail(id, options);
    }
    updateLog(combatId, log) {
        return this.combatRepo.update({
            id: combatId,
        }, {
            log,
        });
    }
    create(input) {
        return this.combatRepo.save({
            attackerId: input.attackerId,
            defenderId: input.defenderId,
        });
    }
    getGold(attacker, defender) { }
    getXP(attacker, defender) {
        const base = 10;
        const diff = attacker.level - defender.level;
    }
};
CombatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(combat_model_1.CombatModel)),
    __param(1, (0, typeorm_1.InjectRepository)(character_model_1.CharacterModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CombatService);
exports.CombatService = CombatService;
//# sourceMappingURL=combat.service.js.map