
interface KeycloakUserCredentials {
  type: string;
  value: string;
  temporary: boolean;
}

interface KeycloakUserRequestDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  credentials: KeycloakUserCredentials[];
}
