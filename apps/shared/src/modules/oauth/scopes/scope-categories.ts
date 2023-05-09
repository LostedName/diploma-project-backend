import { OAuthScopeCategory } from './scope-definition';

export const NoteCategoryIdentifier = 'NoteCategoryIdentifier';

export const noteScopeCategory = OAuthScopeCategory.describe({
  identifier: NoteCategoryIdentifier,
  title: 'User notes',
});

/////////////////////////////////////////////////////////////////////

export const UserCategoryIdentifier = 'UserCategoryIdentifier';

export const userScopeCategory = OAuthScopeCategory.describe({
  identifier: UserCategoryIdentifier,
  title: 'Personal user data',
});

/////////////////////////////////////////////////////////////////////

export const OIDCCategoryIdentifier = 'OIDCCategoryIdentifier';

export const oidcScopeCategory = OAuthScopeCategory.describe({
  identifier: OIDCCategoryIdentifier,
  title: 'OpenID Connect',
});
