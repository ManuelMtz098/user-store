import { bcryptAdapter, envs, Jwt } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { UserEntity } from '../../domain/entities/user.enttity';
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  public async loginUser(dto: LoginUserDto) {
    const user = await UserModel.findOne({ email: dto.email });
    if (!user) throw CustomError.badRequest("Email not exist");

    const isMatch = bcryptAdapter.compare(dto.password, user.password);
    if(!isMatch) throw CustomError.badRequest("Password not valid");

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await Jwt.generateToken({ id: user.id })
    if(!token) throw CustomError.internalServer("Error while creating JWT")

    return {
      user: userEntity,
      token: token,
    };
  }

  public async registerUser(dto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: dto.email });

    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(dto);
      user.password = bcryptAdapter.hash(dto.password);
      await user.save();

      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await Jwt.generateToken({ id: user.id })
      if(!token) throw CustomError.internalServer("Error while creating JWT")

      return {
        user: userEntity,
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await Jwt.generateToken({ email });
    if(!token) throw CustomError.internalServer("Error getting token");

    const link = `${envs.WEB_sERVICE}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if(!isSent) throw CustomError.internalServer("Error sending email");

    return true;
  }

  public validateEmail = async (token: string) => {
    const payload = await Jwt.validateToken(token);
    if(!payload) throw CustomError.unAuthorzed("Invalid token");

    const { email } = payload as { email: string };

    if(!email) throw CustomError.internalServer("Email not in token");

    const user = await UserModel.findOne({ email });
    if(!user) throw CustomError.internalServer("Email not exist");

    user.emailValidated = true;
    await user.save();

    return true;
  }
}