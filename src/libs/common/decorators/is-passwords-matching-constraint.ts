import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RegisterDTO } from '../../../modules/auth/auth.dto';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordsMatchingConstraints
  implements ValidatorConstraintInterface
{
  public validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as RegisterDTO;
    return obj.password === passwordRepeat;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Пароли не совпадают.';
  }
}
