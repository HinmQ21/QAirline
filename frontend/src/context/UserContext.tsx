import { clientApi } from "@/services/client/main";
import { User } from "@/services/schemes/auth";

export class UserContext {
  user: User | null = null;

  async fetchUser() {
    const user = await clientApi.me();
    this.user = user;
    return user;
  }

  getUser() {
    return this.user;
  }

  async getchUser() {
    if (!this.user) {
      await this.fetchUser();
    }
    return this.user;
  }
}
