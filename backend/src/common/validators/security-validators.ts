import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function DisallowClientField(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'disallowClientField',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} cannot be provided by client`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return value === undefined || value === null;
        },
      },
    });
  };
}

export function RoleBasedAccess(allowedRoles: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'roleBasedAccess',
      target: object.constructor,
      propertyName,
      options: {
        message: `Insufficient permissions to set ${propertyName}`,
        ...validationOptions,
      },
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const req = (args.object as any).__request;
          const roles: string[] = req?.user?.roles || [];
          if (!Array.isArray(roles)) return false;
          return allowedRoles.some((r) => roles.includes(r));
        },
      },
    });
  };
}
