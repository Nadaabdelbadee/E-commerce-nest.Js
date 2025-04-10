import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class customPasswordConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments) {
        console.log(confirmPassword , args);
        if (confirmPassword!==args.object[args.constraints[0]]) {
            return false
        }
        
        return true;
    }
}

export function customPasswordDecorator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: ['password'],
            validator: customPasswordConstraint,
        });
    };
}