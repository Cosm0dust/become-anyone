import { Post } from "../entities/post.entity";

export interface PaginatedComments {
   data: Post[];
   meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
   };
}