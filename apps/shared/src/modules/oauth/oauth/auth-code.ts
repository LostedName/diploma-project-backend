export class AuthorizationCode {
  id: string;
  code: string;
  clientId: string;
  userEmail: string;
  redirectUri: string;
  scopes: string;

  constructor(id: string, code: string, clientId: string, userEmail: string, redirectUri: string, scopes: string) {
    this.id = id;
    this.code = code;
    this.clientId = clientId;
    this.userEmail = userEmail;
    this.redirectUri = redirectUri;
    this.scopes = scopes;
  }
}
