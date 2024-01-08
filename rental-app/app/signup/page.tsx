import Link from 'next/link';
import { Form } from '@/app/ui/login-signup-form';
import { redirect } from 'next/navigation';
import { getUser, createUser } from '@/app/lib/actions';
import { SubmitButton } from '@/app/ui/submit-button';

export default function Login() {
  async function register(formData: FormData) {
    'use server';
    let email = formData.get('email') as string;
    let password = formData.get('password') as string;
    let user = await getUser(email);

    if (user !== null) {
      return 'User already exists'; // TODO: Handle errors with useFormStatus
    } else {
      await createUser(email, password);
      redirect('/login');
    }
  }
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36"></div>
        </div>
        <Form action={register}>
          <SubmitButton>Sign Up</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {'Already have an account? '}
            <Link href="/login" className="font-semibold text-gray-800">
              Sign in
            </Link>
            {' instead.'}
          </p>
        </Form>
      </div>
    </main>
  );
}
