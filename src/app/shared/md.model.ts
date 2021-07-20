export class Electrodomestico{
    public id?: number;
    public categoria!: number;
    public nombre!: string;
    public precio!: number;
    public imagen!: string;
    public descripcion!: string;
    public disponibilidad!: number; 
}

export class Usuario{
    public id?: number;
    public nombre?: string;
    public email!: string;
    public pass!: string;
}


export class Banco{
    public id?: number;
    public cardHolder!: string;
    public cardNum!: string;
    public dateExp!: string;
    public cvv!: number;
    public saldo?: number;
}


export class Cesta{
    public id?: number;
    public id_pr?: number;
    public id_usu?: number;
    public cantidad?: number; 
}







