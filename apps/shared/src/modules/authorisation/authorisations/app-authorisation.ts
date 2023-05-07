import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateOrReject,
} from 'class-validator';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { AccountRole } from '../../database/entities/account.entity';

export class MainClaims {
  @IsNumber()
  readonly iat: number;

  @IsNumber()
  readonly exp: number;

  @IsString()
  @IsOptional()
  readonly sub?: string | null;

  constructor(iat: number, exp: number, sub?: string | null) {
    this.iat = iat;
    this.exp = exp;
    this.sub = sub;
  }
}

export class RoleClaims {
  @IsEnum(AccountRole)
  @IsNotEmpty()
  readonly role: AccountRole;

  constructor(role: AccountRole) {
    this.role = role;
  }
}

export class OAuthClaims {
  @IsString()
  @IsNotEmpty()
  readonly clientId: string;

  @IsString()
  @IsNotEmpty()
  readonly scopes: string; //space separated scopes

  constructor(clientId: string, scopes: string) {
    this.clientId = clientId;
    this.scopes = scopes;
  }

  getScopes() {
    return this.scopes.split(' ');
  }
}

export type Claims = MainClaims | RoleClaims | OAuthClaims;

export class AuthorisationClaims {
  static createMainClaim(
    issuedAt: Date,
    expireBefore: Date,
    subject: string,
  ): MainClaims {
    return new MainClaims(issuedAt.getTime(), expireBefore.getTime(), subject);
  }

  static createRoleClaim(role: AccountRole): RoleClaims {
    return new RoleClaims(role);
  }

  static createOAuthClaim(clientId: string, scopes: string[]): OAuthClaims {
    return new OAuthClaims(clientId, scopes.join(' '));
  }
}

export class AppAuthorisation {
  static createRoleAccessAuthorisation(
    mainClaims: MainClaims,
    roleClaims: RoleClaims,
  ): AppAuthorisation {
    return this.createAuthorisation([mainClaims, roleClaims]);
  }

  static createOAuthAccessAuthorization(
    mainClaims: MainClaims,
    roleClaims: RoleClaims,
    oauthClaims: OAuthClaims,
  ): AppAuthorisation {
    return this.createAuthorisation([mainClaims, roleClaims, oauthClaims]);
  }

  private static createAuthorisation(claims: Claims[]) {
    const authorisation = new AppAuthorisation();
    claims.forEach((claim) => Object.assign(authorisation, claim));
    return authorisation;
  }

  async getClaim<T>(claim: ClassConstructor<T>): Promise<null | T> {
    const plain = instanceToPlain(this);
    const result: T = plainToInstance(claim, plain);
    try {
      await validateOrReject(<object>result);
      return result;
    } catch (e) {
      return null;
    }
  }
}
// {
//   code: "asdasdasfewgegsrs",
//   scopes: "asdsad asdasdas sdasdasdas",
//   client_id: "asdasdasdas",
// }
