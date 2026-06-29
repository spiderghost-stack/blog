export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/private/", "/api/"],
        },
        sitemap: "https://mindlog.dev/sitemap.xml",
    };
}
