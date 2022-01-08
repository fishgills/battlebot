"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const character_model_1 = require("../characters/character.model");
const combat_model_1 = require("../combat/combat.model");
const reward_model_1 = require("../rewards/reward.model");
const install_model_1 = require("../installs/install.model");
exports.database = {
    type: 'mysql',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'botdb',
    host: process.env.DB_HOST,
    port: 3306,
    dropSchema: false,
    synchronize: true,
    logging: true,
    cache: true,
    entities: [combat_model_1.CombatModel, character_model_1.CharacterModel, install_model_1.SlackInstallModel, reward_model_1.RewardModel],
};
//# sourceMappingURL=database.config.js.map