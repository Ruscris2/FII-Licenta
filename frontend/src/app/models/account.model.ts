
export class AccountModel {
  constructor(
    public username: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',
    public country: string = '',
    public city: string = '',
    public address: string = '',
    public zipcode: string = ''
  ) {}
}
