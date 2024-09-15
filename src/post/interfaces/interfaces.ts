import { FileUpload } from "graphql-upload-ts";
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

export interface SerializedFileBuffer extends Pick<FileUpload, "filename"> {
  buffer: { type: string; data: number[] };
}
