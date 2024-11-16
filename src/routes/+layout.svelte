<script lang="ts">
    import { Header } from "$components";
    import "./../app.css";
    import { invalidate } from '$app/navigation';
    import { setUserState } from "$lib/state/user-state.svelte";


    let {children, data}  = $props();
    // Derived: anytime data changes, we want to update our session, supabase and user proprty
    let {session, supabase, user} = $derived(data);
    // Set the global context in the layout.svelte that wraps around the main route
    let userState = setUserState({session: data.session, supabase: data.supabase, user: data.user})

    // Remember effect = useEffect, don't specify dependencies, all variables used inside acts as dependancies
    $effect(() => {
        userState.updateState({session, supabase, user})
    });

    $effect(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
    });

</script>

<Header />
{@render children()}