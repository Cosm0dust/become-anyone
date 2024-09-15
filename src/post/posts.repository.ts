import { ExtendedRepository } from "src/common/graphql/customExtended";
import { CustomRepository } from "../common/decorators/typeorm.decorator";
import { Post } from "./entities/post.entity";

@CustomRepository(Post)
export class PostRepository extends ExtendedRepository<Post> {}
