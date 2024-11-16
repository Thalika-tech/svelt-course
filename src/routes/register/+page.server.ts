import type { Actions } from "./$types";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { fail, redirect } from "@sveltejs/kit";

interface ReturnObject {
  success: boolean;
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
      console.log("There has been an error");
      console.log(error);
      returnObject.success = true;
      return fail(400, returnObject as any);
    }

    redirect(303, " /private/dashboard");
  },
} satisfies Actions;
