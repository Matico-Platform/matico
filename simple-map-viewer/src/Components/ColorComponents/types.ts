

export class SingleColor{
    constructor(
        public r:number,
        public g:number,
        public b:number,
        public a:number,
        ){}
}

export class EqualIntervalColor{
    constructor(
        public min: number,
        public max: number,
        public bins: number,
        public colors: SingleColor[],
        public column: string
    ){};
}

type Category  = number | string | boolean

export class CategoricalColor{
    constructor(
        public categories: Category[],
        public colors: SingleColor[],
    ){}
}

export type ColorSpecification = SingleColor | EqualIntervalColor | CategoricalColor;
