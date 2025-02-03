//import ApiService from "@/services/api";
import { paginationLimit } from "@/constants";
import client from "@/helpers/client";
import type { Post } from "@/interfaces";
import { type Comment, type Discussion } from "dsteem";



class ContentService {
  private extractImages(discussion: Discussion): string[] {
    try {
      const metadata = typeof discussion.json_metadata === 'string'
        ? JSON.parse(discussion.json_metadata)
        : discussion.json_metadata;
      if (metadata && Array.isArray(metadata.image)) {
        return metadata.image;
      }

      return [];
    } catch (e) {
      console.error('Error parsing json_metadata:', e);
      return [];
    }
  }

  private extractTags(discussion: Discussion): string[] {
    try {
      const metadata = typeof discussion.json_metadata === 'string'
        ? JSON.parse(discussion.json_metadata)
        : discussion.json_metadata;

      if (metadata && Array.isArray(metadata.tags)) {
        return metadata.tags;
      }

      return [];
    } catch (e) {
      console.error('Error parsing json_metadata:', e);
      return [];
    }
  }

  public async getTrending(start: number = 1, limit: number = 25) {
    return new Promise<Post[]>(async (resolve) => {
      const discussions = await client.database.getDiscussions('trending', { tag: 'steem', limit: 25 })
      const posts: Post[] = discussions.map(discussion => ({
        ...discussion,
        images: this.extractImages(discussion),
        tags: this.extractTags(discussion)
      }));
      resolve(posts);
    });
  }

  public async find(author: string, permlink: string) {
    return new Promise<Comment>(async (resolve) => {
      const post = await client.call('condenser_api', 'get_content', [author, permlink])
      resolve(post);
    });
  }

  public async findComments(author: string, permlink: string) {
    return new Promise<Comment[]>(async (resolve) => {
      const comments = await client.call('condenser_api', 'get_content_replies', [author, permlink])
      resolve(comments);
    });
  }
}

export default new ContentService();
