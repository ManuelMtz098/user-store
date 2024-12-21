import { Validators } from "../../../config";

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string,
    ){}

    static create(object: {[key: string]: any}): [string?, CreateProductDto?] {
        const {name, available, price, description, user, category} = object;

        if(!name) return ['Missing name', undefined];

        if(!user) return ['Missing user', undefined];
        if(!Validators.isMongoID(user)) return ['Invalid user ID'];
        
        if(!category) return ['Missing category', undefined];
        if(!Validators.isMongoID(category)) return ['Invalid category ID'];

        return [
            undefined,
            new CreateProductDto(name, !!available, price, description, user, category)
        ]
    }
}