
class Client {
    name: string;
    email: string;
    age: number;
    gender: string;
    balance: number;
  
    constructor(
      name: string,
      email: string,
      age: number,
      gender: string,
      balance: number
    ) {
      this.name = name;
      this.email = email;
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
    setAge(age: number): void {
        this.age = age;
    }
    setGender(gender: string): void {
        this.gender = gender;
    }
}

export { Client };