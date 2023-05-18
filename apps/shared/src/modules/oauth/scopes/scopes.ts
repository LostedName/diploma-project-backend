import {
  NoteCategoryIdentifier,
  OIDCCategoryIdentifier,
  UserCategoryIdentifier,
  findScopeCategoryById,
} from './scope-categories';
import { OAuthScope, OAuthScopeCategory } from './scope-definition';

export class ScopeEntry {
  scopeTitle: string;
  description: string;
  constructor(scopeTitle: string, description: string) {
    this.scopeTitle = scopeTitle;
    this.description = description;
  }
}
export class ScopeSection {
  sectionTitle: string;
  entries: ScopeEntry[];
  constructor(sectionTitle: string, entries: ScopeEntry[]) {
    this.sectionTitle = sectionTitle;
    this.entries = entries;
  }
}

export type ScopeFormat = { [key: string]: ScopeSection };

//USER

OAuthScope.describe({
  identifier: '',
  categoryIdentifier: '',
  title: '',
  description: '',
  includeScopes: [],
});

export const UserReadScopeId = 'user:read';

export const userReadScope = OAuthScope.describe({
  identifier: UserReadScopeId,
  categoryIdentifier: UserCategoryIdentifier,
  title: 'Read profile data',
  description: 'Access to first name, last name, email and avatar url',
  includeScopes: [],
});

/////////////////////////////////////////////////////////////////////

export const UserFullScopeId = 'user';

export const userFullScope = OAuthScope.describe({
  identifier: UserFullScopeId,
  categoryIdentifier: UserCategoryIdentifier,
  title: 'Read and write profile data',
  description: 'Access to read and edit first name, last name, email and avatar url',
  includeScopes: [userReadScope.identifier],
});

//NOTE

export const NoteReadScopeId = 'note:read';

export const noteReadScope = OAuthScope.describe({
  identifier: NoteReadScopeId,
  categoryIdentifier: NoteCategoryIdentifier,
  title: 'Read notes',
  description: 'Access to read all user notes',
  includeScopes: [],
});

/////////////////////////////////////////////////////////////////////

export const NoteScopeId = 'note';

export const noteScope = OAuthScope.describe({
  identifier: NoteScopeId,
  categoryIdentifier: NoteCategoryIdentifier,
  title: 'Full note access',
  description: 'Full access to get user notes list and to create, update, delete user note.',
  includeScopes: [noteReadScope.identifier],
});

//OIDC

export const OIDCScopeId = 'oidc';

export const oidcScope = OAuthScope.describe({
  identifier: OIDCScopeId,
  categoryIdentifier: OIDCCategoryIdentifier,
  title: 'OpenID Connect',
  description: 'Return user profile info in separate token',
  includeScopes: [],
});

/////////////////////////////////////////////////////////////////////

export const totalScopes = [userReadScope, userFullScope, noteReadScope, noteScope, oidcScope];

export function findScopeById(scopeId: string): OAuthScope {
  return totalScopes.find((scope) => scope.identifier === scopeId);
}

export function checkScopesExistance(scopes: string[]) {
  const totalScopesIds = totalScopes.map((scope) => scope.identifier);
  return scopes.every((scope) => totalScopesIds.some((systemScope) => systemScope === scope));
}

export function formatAnswerScopes(scopeIds: string[]): ScopeFormat {
  const result: ScopeFormat = {};
  const categories = new Map<string, OAuthScopeCategory>();
  const scopes: OAuthScope[] = [];

  scopeIds.forEach((scopeId) => {
    const scope = findScopeById(scopeId);
    scopes.push(scope);
    categories.set(scope.categoryIdentifier, findScopeCategoryById(scope.categoryIdentifier));
  });

  const categoryKeys = Array.from(categories.keys());
  categoryKeys.forEach((key) => {
    result[key] = new ScopeSection(categories.get(key).title, []);
  });

  let resultScopes: OAuthScope[] = [];
  const includedScopes: string[] = [];
  scopes.forEach((scope) => {
    resultScopes.push(scope);
    if (scope.includeScopes.length > 0) {
      includedScopes.push(...scope.includeScopes);
    }
  });
  includedScopes.forEach((includedScopeId) => {
    resultScopes = resultScopes.filter((resultScope) => resultScope.identifier !== includedScopeId);
  });

  resultScopes.forEach((scope) => {
    const scopeEntry = new ScopeEntry(scope.title, scope.description);
    result[scope.categoryIdentifier].entries.push(scopeEntry);
  });

  return result;
}
