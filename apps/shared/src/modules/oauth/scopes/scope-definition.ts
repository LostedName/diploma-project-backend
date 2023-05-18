//CATEGORIES
export type OAuthScopeCategoryIdentifier = string;

export class OAuthScopeCategory {
  identifier: OAuthScopeCategoryIdentifier;
  title: string;
  constructor(identifier: OAuthScopeCategoryIdentifier, title: string) {
    this.identifier = identifier;
    this.title = title;
  }
  static describe(params: { identifier: OAuthScopeCategoryIdentifier; title: string }): OAuthScopeCategory {
    return new OAuthScopeCategory(params.identifier, params.title);
  }
}

////////////////////////////////////////////////////////////////////////

export type OAuthScopeIdentifier = string;

export class OAuthScope {
  identifier: OAuthScopeIdentifier;
  categoryIdentifier: OAuthScopeCategoryIdentifier;
  includeScopes: OAuthScopeIdentifier[];
  title: string;
  description: string;

  constructor(
    identifier: OAuthScopeIdentifier,
    categoryIdentifier: OAuthScopeCategoryIdentifier,
    includeScopes: OAuthScopeIdentifier[],
    title: string,
    description: string,
  ) {
    this.identifier = identifier;
    this.categoryIdentifier = categoryIdentifier;
    this.includeScopes = includeScopes;
    this.title = title;
    this.description = description;
  }

  static describe(params: {
    identifier: OAuthScopeIdentifier;
    categoryIdentifier: OAuthScopeCategoryIdentifier;
    includeScopes: OAuthScopeIdentifier[];
    title: string;
    description: string;
  }): OAuthScope {
    return new OAuthScope(
      params.identifier,
      params.categoryIdentifier,
      params.includeScopes,
      params.title,
      params.description,
    );
  }
}
