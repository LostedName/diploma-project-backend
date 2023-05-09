import {
  NoteCategoryIdentifier,
  UserCategoryIdentifier,
} from './scope-categories';
import { OAuthScope } from './scope-definition';

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
  description:
    'Access to read and edit first name, last name, email and avatar url',
  includeScopes: [userReadScope.identifier],
});

//note

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
  description:
    'Full access to get user notes list and to create, update, delete user note.',
  includeScopes: [noteReadScope.identifier],
});
