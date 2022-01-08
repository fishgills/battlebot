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
exports.CharacterService = void 0;
const rpg_dice_roller_1 = require("@dice-roller/rpg-dice-roller");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const combat_model_1 = require("../combat/combat.model");
const gamerules_1 = require("../gamerules");
const typeorm_2 = require("typeorm");
const character_model_1 = require("./character.model");
let CharacterService = class CharacterService {
    constructor(charRepo, combatRepo) {
        this.charRepo = charRepo;
        this.combatRepo = combatRepo;
    }
    create(createCharacterDto) {
        const char = this.charRepo.create(createCharacterDto);
        this.rollCharacter(char);
        char.level = 1;
        return this.charRepo.save(char);
    }
    find(options) {
        return this.charRepo.find(options);
    }
    findAll() {
        return this.charRepo.find();
    }
    findByIds(ids) {
        return this.charRepo.findByIds(ids);
    }
    findByOwner(owner) {
        return this.charRepo.findOneOrFail({
            where: {
                owner,
            },
        });
    }
    update(id, input) {
        return this.charRepo.update({
            id,
        }, input);
    }
    findOne(options) {
        return this.charRepo.findOneOrFail(options);
    }
    rollCharacter(char) {
        char.strength = new rpg_dice_roller_1.DiceRoll('4d6kh3').total;
        char.defense = new rpg_dice_roller_1.DiceRoll('4d6kh3').total;
        char.vitality = new rpg_dice_roller_1.DiceRoll('4d6kh3').total;
        char.rolls = char.rolls ? ++char.rolls : 1;
        char.hp = 10 + (0, gamerules_1.modifier)(char.vitality);
    }
};
CharacterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(character_model_1.CharacterModel)),
    __param(1, (0, typeorm_1.InjectRepository)(combat_model_1.CombatModel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CharacterService);
exports.CharacterService = CharacterService;
//# sourceMappingURL=character.service.js.map