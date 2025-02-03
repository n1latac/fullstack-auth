import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ProviderOptionsSymbol, TypeOptions } from './provide.constants';
import { BaseOauthService } from './services/base-oauth.service';

@Injectable()
export class ProviderService implements OnModuleInit {
  public constructor(
    @Inject(ProviderOptionsSymbol) private readonly options: TypeOptions,
  ) {}

  public onModuleInit(): any {
    for (const provider of this.options.services) {
      provider.baseUrl = this.options.baseUrl;
    }
  } //это жизненый цикл который вызывается после разарешения зависимостей модуля

  public findByService(service: string): BaseOauthService | null {
    return this.options.services.find((s) => s.name === service) ?? null;
  }
}
