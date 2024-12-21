import { CategoryModel, ProductModel } from "../../data";
import { CreateCategoryDto, CreateProductDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class ProductService {
    constructor(){}

    async getProducts(paginationDto: PaginationDto) {
        const {page, limit} = paginationDto;

        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category', 'name')
            ]);
                
            return {
                page,
                limit,
                total,
                next: `/api/products?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/products?page=${page - 1}&limit=${limit}` : null,
                products: products,
            }
        } catch (error) {
            throw CustomError.internalServer();
        }
    }

    async createProduct(createProductDto: CreateProductDto) {
        const productExists = await ProductModel.findOne({name: createProductDto.name});
        if(productExists) throw CustomError.badRequest("Product already exists");

        try {
            const product = new ProductModel(createProductDto);
            await product.save();
            return {
                product
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}