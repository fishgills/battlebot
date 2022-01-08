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
exports.SlackInstallResolver = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const create_install_dto_1 = require("./create-install.dto");
const install_model_1 = require("./install.model");
const install_service_1 = require("./install.service");
const update_install_dto_1 = require("./update-install.dto");
let SlackInstallResolver = class SlackInstallResolver {
    constructor(service) {
        this.service = service;
    }
    installs() {
        return this.service.findAll();
    }
    install(team_id) {
        return this.service.findOne(team_id);
    }
    createInstall(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.service.createInstall(input);
            return this.service.findOne(input.team_id);
        });
    }
    updateInstall(input) {
        return this.service.update(input);
    }
    removeInstall(team_id) {
        return this.service.deleteInstall(team_id);
    }
};
__decorate([
    (0, graphql_1.Query)((returns) => [install_model_1.SlackInstallModel]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SlackInstallResolver.prototype, "installs", null);
__decorate([
    (0, graphql_1.Query)((returns) => install_model_1.SlackInstallModel),
    __param(0, (0, graphql_1.Args)('team_id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlackInstallResolver.prototype, "install", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => install_model_1.SlackInstallModel),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_install_dto_1.CreateSlackInstallInput]),
    __metadata("design:returntype", Promise)
], SlackInstallResolver.prototype, "createInstall", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => install_model_1.SlackInstallModel),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_install_dto_1.UpdateSlackInstallInput]),
    __metadata("design:returntype", void 0)
], SlackInstallResolver.prototype, "updateInstall", null);
__decorate([
    (0, graphql_1.Mutation)((returns) => String),
    __param(0, (0, graphql_1.Args)('team_id', { type: () => String, nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlackInstallResolver.prototype, "removeInstall", null);
SlackInstallResolver = __decorate([
    (0, graphql_1.Resolver)((of) => install_model_1.SlackInstallModel),
    __param(0, (0, common_1.Inject)(install_service_1.SlackInstallService)),
    __metadata("design:paramtypes", [install_service_1.SlackInstallService])
], SlackInstallResolver);
exports.SlackInstallResolver = SlackInstallResolver;
//# sourceMappingURL=install.resolver.js.map