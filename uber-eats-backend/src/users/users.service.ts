import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {User} from "./entities/user.entity";
import {CreateAccountInput} from "./dtos/create-account.dto";
import {LoginInput} from "./dtos/login.dto";
import {JwtService} from "../jwt/jwt.service";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly users: Repository<User>,
		private readonly jwtService: JwtService,
	) {

	}

	async createAccount({ email, password, role }: CreateAccountInput): Promise<{ok: boolean; error?: string}> {
		// 데이터 베이스에 존재하지 않는 이메일이 있는지 확인
		// 새로운 계정을 만든다 또는 계정을 생성하고 비밀번호를 해싱한다.
		// 위 모든것이 true 라면 ok 를 아니면 error 를 return 한다.

		try {
			const exists = await this.users.findOne({ email });
			if (exists) {
				// 계정이 존재하므로 에러를 return 해야함
				return {ok: false, error: '해당 이메일을 가진 사용자가 이미 존재합니다.'};
			}
			await this.users.save(this.users.create({ email, password, role }));
			return {ok: true}
		} catch (e) {
			return {ok: false, error: '계정을 생성 할 수 없음'};
		}
	}

	async login({email, password}: LoginInput): Promise<{ok: boolean; error?: string; token?: string}> {
		// 이메일을 가진 유저를 찾아라
		// password 가 맞는지 확인해라
		// JWT 를 만들고 user 에게 주기
		try {
			const user = await this.users.findOne({email});
			if (!user) {
				return {ok: false, error: '유저를 찾을 수 없습니다.'};
			}
			const passwordCorrect = await user.checkPassword(password);
			if (!passwordCorrect) {
				return {ok: false, error: '패스워드가 틀립니다.'};
			}
			const token = this.jwtService.sign(user.id);
			return {ok: true, token}
		} catch (error) {
			return {ok: false, error};
		}
	}

	async findById(id: number): Promise<User> {
		return this.users.findOne({id})
	}
}

