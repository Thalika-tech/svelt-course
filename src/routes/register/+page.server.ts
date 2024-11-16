import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

interface ReturnObject {
  success: boolean;
  email: string;
  password: string;
  passwordConfirmation: string;
  name: string;
  errors: string[];
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = request.formData();

    const name = (await formData).get("name") as string;
    const email = (await formData).get("email") as string;
    const password = (await formData).get("password") as string;
    const passwordConfirmation = (await formData).get("passwordConfirmation") as string;

    const returnObject: ReturnObject = {
      success: true,
      email,
      password,
      passwordConfirmation,
      name,
      errors: [],
    };

    if (name.length < 3) {
      returnObject.errors.push("The name is too short. Must be at lease 3 characters.");
    }

    if (!email.length) {
      returnObject.errors.push("Email is required.");
    }

    if (!password.length) {
      returnObject.errors.push("Password is required.");
    }

    if (password !== passwordConfirmation) {
      returnObject.errors.push("Password do not match.");
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }

    // Registration flow with superbase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      returnObject.success = false;
      return fail(400, returnObject as any);
    }

    // Select table from superbase - reference supabase docs
    const userId = data.user.id;
    await supabase.from("user_names").insert([{ user_id: userId, name }]);

    redirect(303, " /private/dashboard");
  },
} satisfies Actions;
