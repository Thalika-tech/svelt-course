import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

interface ReturnObject {
  success: boolean;
  email: string;
  password: string;
  passwordConfirmation?: never;
  name?: never;
  errors: string[];
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = request.formData();

    const email = (await formData).get("email") as string;
    const password = (await formData).get("password") as string;

    const returnObject: ReturnObject = {
      success: true,
      email,
      password,
      errors: [],
    };

    if (!email.length) {
      returnObject.errors.push("Email is required.");
    }

    if (!password.length) {
      returnObject.errors.push("Password is required.");
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }

    // Sign In flow with superbase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      returnObject.success = false;
      return fail(400, returnObject as any);
    }

    redirect(303, " /private/dashboard");
  },
} satisfies Actions;