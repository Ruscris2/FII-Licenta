
export class RegisterModel {
  constructor(
    public firstName: string = '',
    public lastName: string = '',
    public username: string = '',
    public email: string = '',
    public password: string = '',
    public confirmPassword: string = '',
    public address?: string,
    public country?: string,
    public city?: string,
    public zipcode?: string
  ) {}
}
