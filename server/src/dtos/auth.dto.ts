interface IToken {
    token: string
}

export class ResponseSignInDTO {

    public readonly token!: string;

    constructor(data: IToken) {
        this.token = data.token;
    }
}

export class JwtPayload {

    public readonly id!: number;
    public readonly name!: string;
    public readonly email!: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
    }
}