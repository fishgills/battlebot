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
exports.CharacterResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const character_model_1 = require("./character.model");
const character_service_1 = require("./character.service");
const create_character_dto_1 = require("./create-character.dto");
let CharacterResolver = class CharacterResolver {
    constructor(charService) {
        this.charService = charService;
    }
    characters() {
        return this.charService.findAll();
    }
    findByOwner(owner) {
        return this.charService.findByOwner(owner);
    }
    reroll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const char = yield this.charService.findOne({
                where: {
                    id,
                },
            });
            if (char.rolls >= 5) {
                throw new Error('Character ran out of rolls');
            }
            this.charService.rollCharacter(char);
            yield this.charService.update(id, char);
            return char;
        });
    }
    createCharacter(input) {
        return this.charService.create(input);
    }
};
__decorate([
    (0, graphql_1.Query)((returns) => [character_model_1.CharacterModel]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CharacterResolver.prototype, "characters", null);
__decorate([
    (0, graphql_1.Query)((returns) => character_model_1.CharacterModel),
    __param(0, (0, graphql_1.Args)('owner', {
        type: () => String,
        nullable: false,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CharacterResolver.prototype, "findByOwner", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => character_model_1.CharacterModel),
    __param(0, (0, graphql_1.Args)('id', {
        type: () => String,
        nullable: false,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CharacterResolver.prototype, "reroll", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => character_model_1.CharacterModel),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_character_dto_1.CreateCharacterInput]),
    __metadata("design:returntype", void 0)
], CharacterResolver.prototype, "createCharacter", null);
CharacterResolver = __decorate([
    (0, graphql_1.Resolver)((of) => character_model_1.CharacterModel),
    __param(0, (0, common_1.Inject)(character_service_1.CharacterService)),
    __metadata("design:paramtypes", [character_service_1.CharacterService])
], CharacterResolver);
exports.CharacterResolver = CharacterResolver;
//# sourceMappingURL=character.resolver.js.map