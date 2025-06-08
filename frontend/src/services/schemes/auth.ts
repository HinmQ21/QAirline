export type User = {
  customer_id: number;
  username: string;
  email: string;
  full_name: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}
