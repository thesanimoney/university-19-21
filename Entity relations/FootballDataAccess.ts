// FootballBookmakerSystem.Data.DataAccess.ts

import { Sequelize } from 'sequelize';
import {
  Country,
  Town,
  Team,
  Position,
  Player,
  PlayerStatistic,
  Game,
  Bet,
  User,
} from './FootballDataModel';

class DataAccess {
  private static _sequelizeInstance: Sequelize;
  private static _context: Sequelize;

  private constructor() {}

  public static getInstance(): Sequelize {
    if (!DataAccess._sequelizeInstance) {
      DataAccess._sequelizeInstance = new Sequelize({
        dialect: 'sqlite',
        storage: 'football_bookmaker_system.db',
      });

      DataAccess._context = DataAccess._sequelizeInstance;

      // Define model associations
      Team.belongsTo(Town, { foreignKey: 'townId' });
      Town.belongsTo(Country, { foreignKey: 'countryId' });
      Player.belongsTo(Team, { foreignKey: 'teamId' });
      Player.belongsTo(Position, { foreignKey: 'positionId' });
      PlayerStatistic.belongsTo(Player, { foreignKey: 'playerId' });
      PlayerStatistic.belongsTo(Game, { foreignKey: 'gameId' });
      Game.belongsTo(Team, { as: 'HomeTeam', foreignKey: 'homeTeamId' });
      Game.belongsTo(Team, { as: 'AwayTeam', foreignKey: 'awayTeamId' });
      Bet.belongsTo(User, { foreignKey: 'userId' });
      Bet.belongsTo(Game, { foreignKey: 'gameId' });

      // Synchronize models with the database
      DataAccess._context.sync();
    }

    return DataAccess._context;
  }
}

export default DataAccess;
