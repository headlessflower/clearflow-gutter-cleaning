export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser();
    const supabase = useSupabaseClient();
    const config = useRuntimeConfig();

    if (process.server) return;

    // hydrate session
    if (!user.value) {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            const redirect = encodeURIComponent(to.fullPath || "/admin");
            return navigateTo(`/login?redirect=${redirect}`, { replace: true });
        }
    }

    const raw = String(config.public.adminEmails || "");
    const allow = raw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

    const email = String(user.value?.email || "").toLowerCase();

    // dev-friendly: if not configured, don't lock yourself out
    if (allow.length === 0) return;

    if (!allow.includes(email)) {
        return navigateTo("/", { replace: true });
    }
});
