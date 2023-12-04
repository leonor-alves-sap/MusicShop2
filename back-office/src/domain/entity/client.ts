class Client {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  balance: number;

  constructor(
    name: string,
    email: string,
    password: string,
    age: number,
    gender: string,
    balance: number,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.age = age;
    this.gender = gender;
    this.balance = balance;
  }

  getName(): string {
    return this.name;
  }
  getEmail(): string {
    return this.email;
  }
  getPassword(): string {
    return this.password;
  }
  getAge(): number {
    return this.age;
  }
  getGender(): string {
    return this.gender;
  }
  getBalance(): number {
    return this.balance;
  }

  // Setter methods
  setName(name: string): void {
    this.name = name;
  }
  setEmail(email: string): void {
    this.email = email;
  }
  setPassword(password: string): void {
    this.password = password;
  }
  setAge(age: number): void {
    this.age = age;
  }
  setGender(gender: string): void {
    this.gender = gender;
  }
}

export { Client };
