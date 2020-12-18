import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {Injectable} from "@nestjs/common";
import {CreateAccountInput} from "./dtos/create-account.dto";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

	async createAccount({ email, password, role }: CreateAccountInput): Promise<string | undefined> {
		// 데이터 베이스에 존재하지 않는 이메일이 있는지 확인
		// 새로운 계정을 만든다 또는 계정을 생성하고 비밀번호를 해싱한다.
		// 위 모든것이 true 라면 ok 를 아니면 error 를 return 한다.

		try {
			const exists = await this.users.findOne({ email });
			if (exists) {
				// 계정이 존재하므로 에러를 return 해야함
				return '해당 이메일을 가진 사용자가 이미 존재합니다.';
			}
			await this.users.save(this.users.create({ email, password, role }));
		} catch (e) {
			return '계정을 생성 할 수 없음';
		}
	}
}

