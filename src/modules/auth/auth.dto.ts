import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsString({ message: 'Имя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения.' })
  name: string;

  @IsString({ message: 'Email должен быть строкой.' })
  @IsEmail({}, { message: 'Неккоректный формат email.' })
  @IsNotEmpty({ message: 'Email обязательно для заполнения.' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
  @MinLength(6, {
    message: 'Пароль доджен содержать минимум 6 символов.',
  })
  password: string;

  @IsString({ message: 'Пароль подтверждения должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль подтверждения не может быть пустым.' })
  @MinLength(6, {
    message: 'Пароль доджен содержать минимум 6 символов.',
  })
  passwordRepeat: string;
}

export class LoginDTO {
  @IsString({ message: 'Email должен быть строкой.' })
  @IsEmail({}, { message: 'Неккоректный формат email.' })
  @IsNotEmpty({ message: 'Email обязательно для заполнения.' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
  @MinLength(6, {
    message: 'Пароль доджен содержать минимум 6 символов.',
  })
  password: string;
}
