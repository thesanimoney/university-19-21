// FootballBookmakerSystem.Data.Models.ts

// Import necessary modules from Sequelize
import { Model, DataTypes, Sequelize } from 'sequelize';

class Country extends Model {
  public countryId!: number;
  public name!: string;
}

class Town extends Model {
  public townId!: number;
  public countryId!: number;
  public name!: string;
}

class Color extends Model {
  public colorId!: number;
  public name!: string;
}

class Team extends Model {
  public teamId!: number;
  public name!: string;
  public logoUrl!: string;
  public initials!: string;
  public budget!: number;
  public primaryKitColorId!: number;
  public secondaryKitColorId!: number;
  public townId!: number;
}

class Position extends Model {
  public positionId!: number;
  public name!: string;
}

class Player extends Model {
  public playerId!: number;
  public name!: string;
  public squadNumber!: number;
  public teamId!: number;
  public positionId!: number;
  public isInjured!: boolean;
}

class PlayerStatistic extends Model {
  public gameId!: number;
  public playerId!: number;
  public scoredGoals!: number;
  public assists!: number;
  public minutesPlayed!: number;
}

class Game extends Model {
  public gameId!: number;
  public homeTeamId!: number;
  public awayTeamId!: number;
  public homeTeamGoals!: number;
  public awayTeamGoals!: number;
  public dateTime!: Date;
  public homeTeamBetRate!: number;
  public awayTeamBetRate!: number;
  public drawBetRate!: number;
  public result!: string;
}

class Bet extends Model {
  public betId!: number;
  public amount!: number;
  public prediction!: string;
  public dateTime!: Date;
  public userId!: number;
  public gameId!: number;
}

class User extends Model {
  public userId!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public name!: string;
  public balance!: number;
}

// Define the Sequelize database context
class FootballBookmakerContext extends Sequelize {
  public countries!: typeof Country;
  public towns!: typeof Town;
  public colors!: typeof Color;
  public teams!: typeof Team;
  public positions!: typeof Position;
  public players!: typeof Player;
  public playerStatistics!: typeof PlayerStatistic;
  public games!: typeof Game;
  public bets!: typeof Bet;
  public users!: typeof User;
}

export {
  FootballBookmakerContext,
  Country,
  Town,
  Color,
  Team,
  Position,
  Player,
  PlayerStatistic,
  Game,
  Bet,
  User,
};
