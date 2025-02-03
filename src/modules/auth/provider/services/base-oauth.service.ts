import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseProviderOptionsType } from './types/base-provider.options.type';
import { UserInfoType } from './types/user-info.type';

@Injectable()
export class BaseOauthService {
  private BASE_URL: string;

  public constructor(private readonly options: BaseProviderOptionsType) {}

  protected async getExtractUserInfo(data: any): Promise<UserInfoType> {
    return {
      ...data,
      provider: this.options.name,
    };
  }

  public getAuthUrl() {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.options.client_id,
      redirect_uri: this.getRedirectUrl(),
      scopes: (this.scopes ?? []).join(' '),
      access_type: 'offline', //запрашиваем офлайн доступ для получения нашего токена
      prompt: 'select_account', //запрашиваем у пользователя выбор его учетной записи
    });

    return `${this.options.authorize_url}?${query}`;
  }

  public async findUserByCode(code: string): Promise<UserInfoType> {
    const client_id = this.options.client_id;
    const client_secret = this.options.client_secret;

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
    });

    const tokenRequest = await fetch(this.options.access_url, {
      method: 'Post',
      body: tokenQuery,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded', //формат который ожидаем
        Accept: 'application/json', //ожидаем ответ в формате json
      },
    });

    const tokenResponse = await tokenRequest.json();

    if (!tokenRequest.ok) {
      throw new BadRequestException(
        `Не удалось получить пользователя с ${this.options.profile_url}. 
        Проверьте правильность токена доступа.`,
      );
    }

    if (!tokenResponse.access_token) {
      throw new BadRequestException(
        `Нет токенов с ${this.options.access_url}. 
        Убедитесь что код авторизации действителен.`,
      );
    }

    const userRequest = await fetch(this.options.profile_url, {
      headers: {
        'Content-type': `Bearer ${this.options.access_url}`,
      },
    });

    if (!userRequest.ok) {
      throw new UnauthorizedException(`Не удалось получить пользователя с ${this.options.profile_url}. 
        Проверьте правильность токена доступа.`);
    }

    const user = await userRequest.json();
    const userData = await this.getExtractUserInfo(user);

    return {
      ...userData,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      expires_at: tokenResponse.expires_at || tokenResponse.expires_in,
      provider: this.options.name,
    };
  }

  public getRedirectUrl() {
    return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
  }

  set baseUrl(value: string) {
    this.BASE_URL = value;
  }

  get name() {
    return this.options.name;
  }

  get access_url() {
    return this.options.access_url;
  }

  get profile_url() {
    return this.options.profile_url;
  }

  get scopes() {
    return this.options.scopes;
  }
}
